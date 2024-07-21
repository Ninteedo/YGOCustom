import Effect from "../effect/Effect.tsx";
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
import FastCardActivationWindowParseRule from "./rules/FastCardActivationWindowParseRule.ts";
import TimedConditionParseRule from "./rules/TimedConditionParseRule.ts";
import ActivationWindowFallbackParseRule from "./rules/ActivationWindowFallbackParseRule.ts";
import AlwaysTreatedAsParseRule from "./rules/AlwaysTreatedAsParseRule.ts";
import ExtraEffectSentenceParseRule from "./rules/ExtraEffectSentenceParseRule.ts";

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

const parsers: EffectParseRule[] = [
  new EffectRestrictionParseRule(),
  new AlwaysTreatedAsParseRule(),
  new SpellTrapActivationParseRule(),
  new FlipParseRule(),
  new ExplicitQuickEffectParseRule(),
  new SummoningConditionParseRule(),
  new ExtraEffectSentenceParseRule(),
  new TimedTriggerParseRule(),
  new TimedConditionParseRule(),
  new FastCardActivationWindowParseRule(),
  new ConditionalIgnitionParseRule(),
  new ContinuousEffectParseRule(),
  new DuringNonMainPhaseParseRule(),
  new ActivationWindowFallbackParseRule(),
];

export function parseEffects(props: ParseEffectsProps): Effect[] {
  const {text} = props;
  const sentences = (text + " ")
    .split(/\.[ )\n\r]/)
    .map((sentence) => sentence.trim())
    .map((sentence) => sentence + (isBrokenBracketedSentence(sentence) ? ".)" : "."))
    .filter((sentence) => sentence.length > 1);
  const effects: Effect[] = [];

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

  if (isGeminiCard(sentences)) {
    return [parseGeminiCard(sentences, props, parsers)];
  }

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    parseSentenceNew(sentence, effects, props, parsers);
  }

  return effects;
}

function parseSentenceNew(
  sentence: string,
  effects: Effect[],
  props: ParseEffectsProps,
  parsers: EffectParseRule[],
): void {
  const parseProps: EffectParseProps = {
    text: props.text,
    sentence,
    isSpellTrap: props.isSpellTrapCard || false,
    isFastCard: props.isFastCard || false,
    isContinuous: props.isContinuousSpellTrapCard || false,
    isFirstSentence: !effects.find(effect => effect.isProperEffect()),
    lastEffect: effects.length > 0 ? effects[effects.length - 1] : null,
  };
  const matchingRule = parsers.find((rule) => rule.match(parseProps));
  if (!matchingRule) {
    throw new EffectParseError("No matching rule found for sentence: " + sentence);
  }
  const parsedEffect = matchingRule.parse(parseProps);
  if (parsedEffect) {
    effects.push(parsedEffect);
  }
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
    parseSentenceNew(effectSentences[i], effects, props, parsers);
  }
  return new GeminiEffect(effects);
}
