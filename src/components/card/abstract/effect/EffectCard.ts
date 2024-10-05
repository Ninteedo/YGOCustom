import EffectRestriction from "./EffectRestriction.tsx";
import Effect from "./Effect.tsx";
import QuickEffect from "./QuickEffect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import EffectConditionClause from "./clause/EffectConditionClause.ts";
import EffectCostClause from "./clause/EffectCostClause.ts";
import EffectMainClause from "./clause/EffectMainClause.tsx";
import TriggerEffect from "./TriggerEffect.tsx";
import IgnitionEffect from "./IgnitionEffect.tsx";
import ContinuousEffect from "./ContinuousEffect.tsx";

export default interface EffectCard {
  effectRestrictions: EffectRestriction[];
  effects: Effect[];
}

export function parseEffect(effectObject: any): Effect {
  if (!effectObject.hasOwnProperty("type")) {
    throw new Error("Effect type must be defined");
  }

  let effectType = effectObject.type.toLowerCase();
  if (effectType.endsWith("effect")) {
    effectType = effectType.substring(0, effectType.length - 6);
  }

  switch (effectType) {
    case "quick":
      return new QuickEffect(parseClauses(effectObject));
    case "trigger":
      return new TriggerEffect(parseClauses(effectObject));
    case "ignition":
      return new IgnitionEffect(parseClauses(effectObject));
    case "continuous":
      return new ContinuousEffect(parseClauses(effectObject)[0]);
    default:
      throw new Error("Effect type not recognized");
  }
}

export function parseEffects(effectObjects: any[]): Effect[] {
  return effectObjects.map(parseEffect);
}

function parseClauses(effectObject: any): EffectClause[] {
  let clauses: EffectClause[] = [];

  if (effectObject.hasOwnProperty("condition") || effectObject.hasOwnProperty("cond") ) {
    clauses.push(new EffectConditionClause(effectObject.condition || effectObject.cond));
  }
  if (effectObject.hasOwnProperty("cost")) {
    clauses.push(new EffectCostClause(effectObject.cost));
  }
  if (effectObject.hasOwnProperty("main")) {
    clauses.push(new EffectMainClause(effectObject.main));
  }

  return clauses;
}
