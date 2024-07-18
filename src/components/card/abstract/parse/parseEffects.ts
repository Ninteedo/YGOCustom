import Effect from "../effect/Effect.tsx";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import EffectMainClause from "../effect/clause/EffectMainClause.ts";
import IgnitionEffect from "../effect/IgnitionEffect.tsx";
import QuickEffect from "../effect/QuickEffect.tsx";
import EffectClause from "../effect/clause/EffectClause.ts";
import TriggerEffect from "../effect/TriggerEffect.tsx";
import EffectConditionClause from "../effect/clause/EffectConditionClause.ts";
import EffectCostClause from "../effect/clause/EffectCostClause.ts";
import ContinuousEffect from "../effect/ContinuousEffect.tsx";
import EffectParseError from "./EffectParseError.ts";
import SummoningCondition from "../effect/SummoningCondition.tsx";
import GeminiEffect from "../effect/GeminiEffect.tsx";

interface EffectData {
  restrictions: EffectRestriction[];
  effects: Effect[];
}

function parseEffectClauses(sentence: string): EffectClause[] {
  // return [new EffectMainClause(sentence)];

  const hasCondition = sentence.includes(": ");
  const hasCost = sentence.includes("; ");

  const clauses: EffectClause[] = [];
  let main = sentence;
  if (hasCondition) {
    const [condition, remaining] = sentence.split(": ");
    clauses.push(new EffectConditionClause(condition));
    main = remaining;
  }
  if (hasCost) {
    const [cost, remaining] = main.split("; ");
    clauses.push(new EffectCostClause(cost));
    main = remaining;
  }
  clauses.push(new EffectMainClause(main));
  return clauses;
}

export interface ParseEffectsProps {
  text: string;
  isFastCard?: boolean;
  isSpellTrapCard?: boolean;
  isContinuousSpellTrapCard?: boolean;
}

export function parseEffects(props: ParseEffectsProps): EffectData {
  const {text} = props;
  const sentences = (text + " ")
    .split(/\.[ )\n]/)
    .map((sentence) => sentence.trim())
    .map((sentence) => isBrokenBracketedSentence(sentence) ? sentence + ".)" : sentence + ".")
    .filter((sentence) => sentence.length > 1);
  const effects: Effect[] = [];
  const restrictions: EffectRestriction[] = [];

  for (let i = 1; i < sentences.length; i++) {
    let sentence = sentences[i];
    if (sentence.startsWith("(") && sentence.match(/\)\.?$/)) {
      // Merge the sentence with the previous one
      if (sentence.endsWith(".")) {
        sentence = sentence.slice(0, -1);
      }
      sentences[i - 1] += " " + sentence;
      sentences.splice(i, 1);
      i--;
    }
    if (hasIncompleteDoubleQuotes(sentence)) {
      // Merge the sentence with the previous one
      sentences[i] += " " + sentences[i + 1];
      sentences.splice(i + 1, 1);
    }
  }

  if (isGeminiCard(sentences)) {
    return {restrictions, effects: [parseGeminiCard(sentences, props)]};
  }

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    parseSentence(sentence, restrictions, effects, i, props);
  }

  return {restrictions, effects};
}

function parseSentence(
  sentence: string,
  restrictions: EffectRestriction[],
  effects: Effect[],
  i: number,
  props: ParseEffectsProps,
): void {
  const {isSpellTrapCard = false, isFastCard = false} = props;
  if (sentence.startsWith("You can only ")) {
    restrictions.push(new EffectRestriction(sentence));
  } else {
    if (isSpellTrapCard && i === 0) {
      parseSpellTrapCardFirstEffect(props, sentence, effects);
    } else if (sentence.includes("(Quick Effect):") || sentence.toLowerCase().includes("during either player's turn")) {
      effects.push(createQuickEffect(sentence));
    } else if (hasTimedCondition(sentence)) {
      effects.push(createTriggerEffect(sentence));
    } else if (!isSpellTrapCard && isSummoningCondition(sentence)) {
      effects.push(createSummoningCondition(sentence));
    } else if (hasActivationWindowMention(sentence)) {
      if (duringNonMainPhase(sentence) || hasTimedCondition(sentence)) {
        effects.push(createTriggerEffect(sentence));
      } else {
        if (isFastCard) {
          effects.push(createQuickEffect(sentence));
        } else {
          effects.push(createIgnitionEffect(sentence));
        }
      }
    } else if (!sentence.includes(":")) {
      effects.push(createContinuousEffect(sentence));
    } else if (duringNonMainPhase(sentence)) {
      effects.push(createTriggerEffect(sentence));
    } else {
      throw new EffectParseError("Could not determine effect type for sentence: " + sentence);
    }
  }
}

function parseSpellTrapCardFirstEffect({isFastCard, isContinuousSpellTrapCard}: ParseEffectsProps, sentence: string, effects: Effect[]): void {
  if (!isContinuousSpellTrapCard || sentence.includes(": ") || sentence.includes("; ")) {
    if (isFastCard) {
      effects.push(createQuickEffect(sentence));
    } else {
      effects.push(createIgnitionEffect(sentence));
    }
  } else {
    effects.push(createContinuousEffect(sentence));
  }
}

function duringNonMainPhase(sentence: string): boolean {
  return !!sentence.match(/[Dd]uring the (Draw|Standby|Battle|End) Phase/) || !!sentence.match(/At the (start|end) of the /);
}

function hasCondition(sentence: string): boolean {
  return sentence.includes(": ");
}

function hasCost(sentence: string): boolean {
  return sentence.includes("; ");
}

function hasTimedCondition(sentence: string): boolean {
  const condition = getCondition(sentence);
  const keywords = ["if", "when", "each time"];
  return keywords.some((keyword) => condition.toLowerCase().includes(keyword + " "));
}

function hasActivationWindowMention(sentence: string): boolean {
  return sentence.startsWith("Once per turn") ||
    sentence.startsWith("During your Main Phase") ||
    sentence.startsWith("You can ") ||
    sentence.startsWith("Once per Chain");
}

function isSummoningCondition(sentence: string): boolean {
  const summoningTypes = ["Fusion", "Synchro", "Xyz", "Link", "Special", "Tribute"];
  return !!(
    summoningTypes.some((type) => sentence.match(new RegExp("you can (also)? " + type + " Summon (this card|\")"))) ||
    sentence.startsWith("Cannot be Normal Summoned/Set") ||
    sentence.startsWith("Cannot be Special Summoned") ||
    sentence.match(/^Must first be (\w)+ Summoned/)
  );
}

function createIgnitionEffect(sentence: string): IgnitionEffect {
  return new IgnitionEffect(parseEffectClauses(sentence));
}

function createQuickEffect(sentence: string): QuickEffect {
  return new QuickEffect(parseEffectClauses(sentence));
}

function createTriggerEffect(sentence: string): TriggerEffect {
  return new TriggerEffect(parseEffectClauses(sentence));
}

function createContinuousEffect(sentence: string): ContinuousEffect {
  if (hasCondition(sentence) || hasCost(sentence)) {
    throw new EffectParseError("Continuous effect should not contain a condition or cost: " + sentence);
  }
  return new ContinuousEffect(parseEffectClauses(sentence)[0]);
}

function createSummoningCondition(sentence: string): SummoningCondition {
  return new SummoningCondition(new EffectMainClause(sentence));
}

function getCondition(sentence: string): string {
  if (!hasCondition(sentence)) {
    return "";
  }
  return sentence.split(": ")[0];
}

function isBrokenBracketedSentence(sentence: string): boolean {
  if (!sentence.startsWith("(")) {
    return false
  }
  const openBrackets = sentence.match(/\(/g);
  const closeBrackets = sentence.match(/\)/g);
  return !!openBrackets && openBrackets.length !== (closeBrackets || []).length;
}

function hasIncompleteDoubleQuotes(sentence: string): boolean {
  const openQuotes = sentence.match(/"/g);
  return !!openQuotes && openQuotes.length % 2 === 1;
}

function isGeminiCard(sentences: string[]): boolean {
  return (
    sentences[0] === "This card is treated as a Normal Monster while face-up on the field or in the Graveyard." &&
    sentences[1] === "While this card is a Normal Monster on the field, you can Normal Summon it to have it become an Effect Monster with this effect."
  )
}

function parseGeminiCard(sentences: string[], props: ParseEffectsProps): GeminiEffect {
  const effectSentences = sentences.slice(2).map((sentence) => sentence.substring(2));
  const effects: Effect[] = [];
  for (let i = 0; i < effectSentences.length; i++) {
    parseSentence(effectSentences[i], [], effects, 0, props);
  }
  return new GeminiEffect(effects);
}

// function getCost(sentence: string): string {
//   const remaining = sentence.substring(getCondition(sentence).length + 2);
//   return remaining.split("; ")[0];
// }
