import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";

export default class TimedConditionParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      this.hasActivationWindowMention(sentence)
      && !this.duringMainPhase(sentence)
      && !this.duringNonMainPhase(sentence)
      && this.hasTimedCondition(sentence)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return this.getTriggerOrIgnition(sentence, !this.isSlowCondition(sentence));
  }
}
