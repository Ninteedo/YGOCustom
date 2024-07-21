import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {
  duringMainPhase,
  duringNonMainPhase,
  getTriggerOrIgnition,
  hasActivationWindowMention,
  hasTimedCondition,
  isSlowCondition,
} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";

export default class TimedConditionParseRule implements EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      hasActivationWindowMention(sentence)
      && !duringMainPhase(sentence)
      && !duringNonMainPhase(sentence)
      && hasTimedCondition(sentence)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return getTriggerOrIgnition(sentence, !isSlowCondition(sentence));
  }
}
