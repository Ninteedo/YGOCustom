import Effect from "../effect/Effect.tsx";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import EffectMainClause from "../effect/clause/EffectMainClause.ts";
import IgnitionEffect from "../effect/IgnitionEffect.tsx";
import QuickEffect from "../effect/QuickEffect.tsx";
import EffectClause from "../effect/clause/EffectClause.ts";
import TriggerEffect from "../effect/TriggerEffect.tsx";
import EffectConditionClause from "../effect/clause/EffectConditionClause.ts";
import EffectCostClause from "../effect/clause/EffectCostClause.ts";

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

export function parseEffects(text: string): EffectData {
  let sentences = (text + " ").split(". ").map((sentence) => sentence.trim() + ".");
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

  for (const sentence of sentences) {
    if (sentence.startsWith("You can only ")) {
      restrictions.push(new EffectRestriction(sentence));
    } else if (sentence.startsWith("If ") || sentence.startsWith("When ")) {
      effects.push(new TriggerEffect(parseEffectClauses(sentence)));
    } else if (sentence.includes("(Quick Effect):") || sentence.toLowerCase().includes("during either player's turn")) {
      effects.push(new QuickEffect(parseEffectClauses(sentence)))
    } else {
      effects.push(new IgnitionEffect(parseEffectClauses(sentence)));
    }
  }

  return {restrictions, effects};
}
