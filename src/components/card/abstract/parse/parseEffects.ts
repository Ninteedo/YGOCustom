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
  const {text, isSpellTrapCard = false, isFastCard = false} = props;
  const sentences = (text + " ")
    .split(". ")
    .map((sentence) => sentence.trim() + ".")
    .filter((sentence) => sentence.length > 1);
  const effects: Effect[] = [];
  const restrictions: EffectRestriction[] = [];

  for (let i = 1; i < sentences.length; i++) {
    if (sentences[i].startsWith("(") && sentences[i].endsWith(").")) {
      // Merge the sentence with the previous one
      sentences[i - 1] += " " + sentences[i].slice(0, -1);
      sentences.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (sentence.startsWith("You can only ")) {
      restrictions.push(new EffectRestriction(sentence));
    } else {
      if (isSpellTrapCard && i === 0) {
        parseSpellTrapCardFirstEffect(props, sentence, effects);
      } else if (sentence.includes("(Quick Effect):") || sentence.toLowerCase().includes("during either player's turn")) {
        effects.push(new QuickEffect(parseEffectClauses(sentence)))
      } else if (sentence.startsWith("If ") || sentence.startsWith("When ")) {
        effects.push(new TriggerEffect(parseEffectClauses(sentence)));
      } else if (sentence.startsWith("Once per turn") || sentence.startsWith("During your Main Phase") || sentence.startsWith(
        "You can ")) {
        if (isFastCard) {
          effects.push(new QuickEffect(parseEffectClauses(sentence)));
        } else {
          effects.push(new IgnitionEffect(parseEffectClauses(sentence)));
        }
      } else {
        effects.push(new ContinuousEffect([new EffectMainClause(sentence)]));
      }
    }
  }

  return {restrictions, effects};
}

function parseSpellTrapCardFirstEffect({isFastCard, isContinuousSpellTrapCard}: ParseEffectsProps, sentence: string, effects: Effect[]): void {
  if (!isContinuousSpellTrapCard || sentence.includes(": ")) {
    if (isFastCard) {
      effects.push(new QuickEffect(parseEffectClauses(sentence)));
    } else {
      effects.push(new IgnitionEffect(parseEffectClauses(sentence)));
    }
  } else {
    effects.push(new ContinuousEffect(parseEffectClauses(sentence)));
  }
}
