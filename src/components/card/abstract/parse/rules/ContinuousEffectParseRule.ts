import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";

export default class ContinuousEffectParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return !this.hasCondition(sentence) && !this.hasCost(sentence);
  }

  parse({sentence}: EffectParseProps): Effect {
    return new ContinuousEffect(new EffectMainClause(sentence));
  }
}
