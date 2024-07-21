import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {duringMainPhase, hasTimedCondition, isSlowCondition, parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";

export default class TimedTriggerParseRule implements EffectParseRule {
  match({sentence, isFastCard}: EffectParseProps): boolean {
    return (
      !isFastCard && !duringMainPhase(sentence)
      && (
        (hasTimedCondition(sentence) && !isSlowCondition(sentence))
        // || hasActivationWindowMention(sentence)
      )
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new TriggerEffect(parseEffectClauses(sentence));
  }
}
