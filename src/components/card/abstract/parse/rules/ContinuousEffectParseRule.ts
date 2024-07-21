import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";

export default class ContinuousEffectParseRule implements EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return !sentence.includes(": ") && !sentence.includes("; ");
  }

  parse({sentence}: EffectParseProps): Effect {
    return new ContinuousEffect(new EffectMainClause(sentence));
  }
}
