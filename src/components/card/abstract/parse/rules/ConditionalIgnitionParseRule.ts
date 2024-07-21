import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {duringMainPhase, hasTimedCondition, isSlowCondition, parseEffectClauses} from "../parseEffects.ts";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";

export default class ConditionalIgnitionParseRule implements EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return hasTimedCondition(sentence) && !duringMainPhase(sentence) && isSlowCondition(sentence);
  }

  parse({sentence}: EffectParseProps): Effect {
    return new IgnitionEffect(parseEffectClauses(sentence));
  }
}
