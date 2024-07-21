import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";

/**
 * Parses a timed trigger effect.
 *
 * This is a trigger effect that has a condition that triggered with "If", "When", or equivalent for a timed event.
 */
export default class TimedTriggerParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      !this.duringMainPhase(sentence)
      && (this.hasTimedCondition(sentence) && !this.isSlowCondition(sentence))
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new TriggerEffect(parseEffectClauses(sentence));
  }
}
