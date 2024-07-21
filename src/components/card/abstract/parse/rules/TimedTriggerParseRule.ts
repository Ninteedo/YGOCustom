import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";

export default class TimedTriggerParseRule extends EffectParseRule {
  match({sentence, isFastCard}: EffectParseProps): boolean {
    return (
      !isFastCard && !this.duringMainPhase(sentence)
      && (
        (this.hasTimedCondition(sentence) && !this.isSlowCondition(sentence))
        // || hasActivationWindowMention(sentence)
      )
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new TriggerEffect(parseEffectClauses(sentence));
  }
}
