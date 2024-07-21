import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";

export default class ConditionalIgnitionParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return this.hasTimedCondition(sentence) && !this.duringMainPhase(sentence) && this.isSlowCondition(sentence);
  }

  parse({sentence}: EffectParseProps): Effect {
    return new IgnitionEffect(parseEffectClauses(sentence));
  }
}
