import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";

export default class BasicIgnitionParseRuleParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return this.hasCondition(sentence) || this.hasCost(sentence);
  }

  parse({sentence}: EffectParseProps): Effect {
    return new IgnitionEffect(parseEffectClauses(sentence));
  }
}
