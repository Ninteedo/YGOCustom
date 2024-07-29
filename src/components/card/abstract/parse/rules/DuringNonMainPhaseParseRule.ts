import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import TriggerEffect from "../../effect/TriggerEffect.tsx";

export default class DuringNonMainPhaseParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      !!sentence.toLowerCase().match(/during (each|the|your|your opponent's) (next )?(draw|standby|battle|end) phase/)
      || !!sentence.match(/At the (start|end) of the /)
    );
  }

  parse({sentence, isFastCard}: EffectParseProps): Effect {
    if (isFastCard) {
      return new QuickEffect(parseEffectClauses(sentence));
    } else {
      return new TriggerEffect(parseEffectClauses(sentence));
    }
  }
}
