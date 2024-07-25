import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";

export default class TimedConditionParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      this.hasActivationWindowMention(sentence)
      && !this.duringMainPhase(sentence)
      && !this.duringOtherPhase(sentence)
      && this.hasTimedCondition(sentence)
      && !this.isSlowCondition(sentence)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new TriggerEffect(parseEffectClauses(sentence));
  }
}
