import Effect from "../effect/Effect.tsx";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import EffectMainClause from "../effect/clause/EffectMainClause.ts";
import EffectClause from "../effect/clause/EffectClause.ts";
import EffectConditionClause from "../effect/clause/EffectConditionClause.ts";
import EffectCostClause from "../effect/clause/EffectCostClause.ts";
import EffectParseError from "./EffectParseError.ts";
import GeminiEffect from "../effect/GeminiEffect.tsx";
import {EffectParseProps, EffectParseRule} from "./rules/EffectParseRule.ts";
import SpellTrapActivationParseRule from "./rules/SpellTrapActivationParseRule.ts";
import FlipParseRule from "./rules/FlipParseRule.ts";
import ExplicitQuickEffectParseRule from "./rules/ExplicitQuickEffectParseRule.ts";
import SummoningConditionParseRule from "./rules/SummoningConditionParseRule.ts";
import ContinuousEffectParseRule from "./rules/ContinuousEffectParseRule.ts";
import DuringNonMainPhaseParseRule from "./rules/DuringNonMainPhaseParseRule.ts";
import ConditionalIgnitionParseRule from "./rules/ConditionalIgnitionParseRule.ts";
import TimedTriggerParseRule from "./rules/TimedTriggerParseRule.ts";
import EffectRestrictionParseRule from "./rules/EffectRestrictionParseRule.ts";
import TriggerEffect from "../effect/TriggerEffect.tsx";
import IgnitionEffect from "../effect/IgnitionEffect.tsx";
import FastCardActivationWindowParseRule from "./rules/FastCardActivationWindowParseRule.ts";
import TimedConditionParseRule from "./rules/TimedConditionParseRule.ts";
import ActivationWindowFallbackParseRule from "./rules/ActivationWindowFallbackParseRule.ts";

interface EffectData {
  restrictions: EffectRestriction[];
  effects: Effect[];
}

export function parseEffectClauses(sentence: string): EffectClause[] {
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
    .split(/\.[ )\n\r]/)
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
    if (sentence.startsWith("●")) {
      sentences[i] = sentence.substring(1).trimStart();
    }
  }

  const parsers: EffectParseRule[] = [
    new EffectRestrictionParseRule(),
    new SpellTrapActivationParseRule(),
    new FlipParseRule(),
    new ExplicitQuickEffectParseRule(),
    new SummoningConditionParseRule(),
    new TimedTriggerParseRule(),
    new TimedConditionParseRule(),
    new FastCardActivationWindowParseRule(),
    new ConditionalIgnitionParseRule(),
    new ContinuousEffectParseRule(),
    new DuringNonMainPhaseParseRule(),
    new ActivationWindowFallbackParseRule(),
  ]

  if (isGeminiCard(sentences)) {
    return {restrictions, effects: [parseGeminiCard(sentences, props, parsers)]};
  }

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    parseSentenceNew(sentence, effects, i, props, parsers);
  }

  return {restrictions, effects};
}

function parseSentenceNew(
  sentence: string,
  effects: Effect[],
  i: number,
  props: ParseEffectsProps,
  parsers: EffectParseRule[],
): void {
  const parseProps: EffectParseProps = {
    text: props.text,
    sentence,
    isSpellTrap: props.isSpellTrapCard || false,
    isFastCard: props.isFastCard || false,
    isContinuous: props.isContinuousSpellTrapCard || false,
    isFirstSentence: i === 0,
  };
  const matchingRule = parsers.find((rule) => rule.match(parseProps));
  if (!matchingRule) {
    throw new EffectParseError("No matching rule found for sentence: " + sentence);
  }
  effects.push(matchingRule.parse(parseProps));
}

export function duringNonMainPhase(sentence: string): boolean {
  return !!sentence.toLowerCase().match(/during (each|the|your|your opponent's) (draw|standby|battle|end) phase/) || !!sentence.match(/At the (start|end) of the /);
}

export function duringMainPhase(sentence: string): boolean {
  return sentence.startsWith("During your Main Phase, ");
}

function hasCondition(sentence: string): boolean {
  return sentence.includes(": ");
}

export function hasTimedCondition(sentence: string): boolean {
  const condition = getCondition(sentence);
  const keywords = ["if", "when", "each time"];
  return keywords.some((keyword) => condition.toLowerCase().includes(keyword + " "));
}

export function isSlowCondition(sentence: string): boolean {
  return sentence.startsWith("If you control ");
}

export function hasActivationWindowMention(sentence: string): boolean {
  return sentence.startsWith("Once per turn") ||
    sentence.startsWith("During your Main Phase") ||
    sentence.startsWith("You can ") ||
    sentence.startsWith("Once per Chain");
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
    (
      sentences[1].startsWith("While this card is a Normal Monster on the field, you can Normal Summon it to have it become an Effect Monster with this effect")
      || sentences[1].startsWith("While this card is face-up on the field, you can Normal Summon it to have it be treated as an Effect Monster with this effect")
    )
  );
}

function parseGeminiCard(sentences: string[], props: ParseEffectsProps, parsers: EffectParseRule[]): GeminiEffect {
  let effectSentences = sentences.slice(2);
  if (sentences[1].startsWith("While this card is face-up on the field, you can Normal Summon it to have it be treated as an Effect Monster with this effect:\n●")) {
    effectSentences = [sentences[1].substring(sentences[1].indexOf("●") + 1, sentences[1].length - 1).trimStart()].concat(effectSentences);
  }
  const effects: Effect[] = [];
  for (let i = 0; i < effectSentences.length; i++) {
    parseSentenceNew(effectSentences[i], effects, 0, props, parsers);
  }
  return new GeminiEffect(effects);
}

export function getTriggerOrIgnition(sentence: string, isTrigger: boolean): Effect {
  const clauses = parseEffectClauses(sentence);
  if (isTrigger) {
    return new IgnitionEffect(clauses);
  } else {
    return new TriggerEffect(clauses);
  }
}

// function getCost(sentence: string): string {
//   const remaining = sentence.substring(getCondition(sentence).length + 2);
//   return remaining.split("; ")[0];
// }
