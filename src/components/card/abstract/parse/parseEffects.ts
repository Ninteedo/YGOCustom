import Effect from "../effect/Effect.tsx";
import EffectMainClause from "../effect/clause/EffectMainClause.tsx";
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
import SubEffectParseRule from "./rules/SubEffectParseRule.ts";
import QuickDuringMainPhase from "./rules/QuickDuringMainPhase.ts";
import {containsIgnoreQuotes, takeUntilIgnoreQuotes} from "../../../../utils/stringParse.ts";
import BasicIgnitionParseRuleParseRule from "./rules/BasicIgnitionParseRule.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";

interface EffectSentence {
  text: string;
  isSub: boolean;
  precedingNewLine: boolean;
}

interface EffectDetail {
  effect: Effect;
  isSub: boolean;
}

export function parseEffectClauses(sentence: string): EffectClause[] {
  // return [new EffectMainClause(sentence)];

  const hasCondition = containsIgnoreQuotes(sentence, ":");
  const hasCost = containsIgnoreQuotes(sentence, ";");

  const clauses: EffectClause[] = [];
  let main = sentence;
  if (hasCondition) {
    const condition = takeUntilIgnoreQuotes(main, ":");
    const remaining = main.substring(condition.length + 1).trimStart();
    clauses.push(new EffectConditionClause(condition));
    main = remaining;
  }
  if (hasCost) {
    const cost = takeUntilIgnoreQuotes(main, ";");
    const remaining = main.substring(cost.length + 1).trimStart();
    clauses.push(new EffectCostClause(cost));
    main = remaining.trimStart();
  }
  if (main.length > 0) {
    clauses.push(new EffectMainClause(main));
  }
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
  new SubEffectParseRule(),
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
  new QuickDuringMainPhase(),
  new BasicIgnitionParseRuleParseRule(),
];

export function parseEffects(props: ParseEffectsProps): Effect[] {
  const {text} = props;
  const sentences: EffectSentence[] = splitSentences(text);

  for (let i = 1; i < sentences.length; i++) {
    let {text: sentence} = sentences[i];
    if (sentence.startsWith("(") && sentence.match(/\)\.?$/)) {
      // Merge the sentence with the previous one
      if (sentence.endsWith(".")) {
        sentence = sentence.slice(0, -1);
      }
      sentences[i - 1].text += " " + sentence;
      sentences.splice(i, 1);
      i--;
    }
    if (sentence.endsWith("(min.")) {
      // Merge the sentence with the next one
      sentences[i].text += " " + sentences[i + 1].text;
      sentences.splice(i + 1, 1);
    }
    if (hasIncompleteDoubleQuotes(sentence)) {
      // Merge the sentence with the previous one
      sentences[i].text += " " + sentences[i + 1].text;
      sentences.splice(i + 1, 1);
    }
    if (sentence.startsWith("●")) {
      sentences[i] = {text: sentence.substring(1).trimStart(), isSub: true, precedingNewLine: sentences[i].precedingNewLine};
    }
  }

  if (isGeminiCard(sentences.map((sentence) => sentence.text))) {
    return [parseGeminiCard(sentences, props, parsers)];
  }

  const effects: EffectDetail[] = [];
  for (let i = 0; i < sentences.length; i++) {
    const {text: sentence, isSub, precedingNewLine} = sentences[i];
    parseSentenceNew(sentence, isSub, precedingNewLine, effects, props, parsers);
  }

  return effects.map(({effect}) => effect);
}

function parseSentenceNew(
  sentence: string,
  isSub: boolean,
  precedingNewLine: boolean,
  effects: EffectDetail[],
  props: ParseEffectsProps,
  parsers: EffectParseRule[],
): void {
  let lastEffectIndex: number | undefined = undefined;
  for (let i = effects.length - 1; i >= 0; i--) {
    if (!(effects[i].effect instanceof EffectRestriction)) {
      lastEffectIndex = i;
      break;
    }
  }

  const parseProps: EffectParseProps = {
    text: props.text,
    sentence,
    isSpellTrap: props.isSpellTrapCard || false,
    isFastCard: props.isFastCard || false,
    isContinuous: props.isContinuousSpellTrapCard || false,
    isFirstSentence: !effects.find(({effect}) => effect.isProperEffect()),
    lastEffect: lastEffectIndex !== undefined ? effects[lastEffectIndex].effect : null,
    lastIsSub: lastEffectIndex !== undefined ? effects[lastEffectIndex].isSub : null,
    isSub,
    hasPrecedingNewLine: precedingNewLine,
  };
  const matchingRule = parsers.find((rule) => rule.match(parseProps));
  if (!matchingRule) {
    throw new EffectParseError("No matching rule found for sentence: " + sentence);
  }
  const parsedEffect = matchingRule.parse(parseProps);
  if (parsedEffect) {
    effects.push({effect: parsedEffect, isSub});
  }
}

function splitSentences(text: string): EffectSentence[] {
  const sentences: EffectSentence[] = [];
  let inQuotes = false;
  let inBrackets = false;
  let prevSentenceEnd = 0;
  let i = 0;
  let endsInNewLine = false;

  function endSentence(): void {
    const newSentence = text.substring(prevSentenceEnd, i + 1).trim();
    if (newSentence.length > 0) {
      endsInNewLine = newSentence.startsWith("\n") || sentences.length > 0 && text[prevSentenceEnd - 1] === "\n";
      const isSub = newSentence.startsWith("●");
      sentences.push({text: newSentence, isSub, precedingNewLine: endsInNewLine});
    }
    prevSentenceEnd = i + 1;
    endsInNewLine = false;
  }

  function isSentenceTerminator(char: string): boolean {
    return char === "." || char === "\n";
  }

  for (i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "(") {
      inBrackets = true;
    } else if (char === ")") {
      inBrackets = false;
      if (i > 0 && text[i - 1] === ".") {
        endSentence();
      }
    } else if (isSentenceTerminator(char) && !inQuotes && !inBrackets) {
      endSentence();
    } else if (char === "●" && i > 0) {
      i -= 1;
      endSentence();
      i += 1;
    }
  }
  endSentence();
  return sentences;
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

function parseGeminiCard(sentences: EffectSentence[], props: ParseEffectsProps, parsers: EffectParseRule[]): GeminiEffect {
  const effectSentences: EffectSentence[] = sentences.slice(2).map((sentence) => ({text: sentence.text, isSub: false, precedingNewLine: false}));
  if (sentences[1].text.startsWith("While this card is face-up on the field, you can Normal Summon it to have it be treated as an Effect Monster with this effect:\n●")) {
    // effectSentences = [[sentences[1][0].substring(sentences[1].indexOf("●") + 1, sentences[1].length - 1).trimStart()].concat(effectSentences), effectSentences[1]];
    // effectSentences =
  }
  const effects: EffectDetail[] = [];
  for (let i = 0; i < effectSentences.length; i++) {
    parseSentenceNew(effectSentences[i].text, effectSentences[i].isSub, effectSentences[i].precedingNewLine, effects, props, parsers);
  }
  return new GeminiEffect(effects.map(({effect}) => effect));
}
