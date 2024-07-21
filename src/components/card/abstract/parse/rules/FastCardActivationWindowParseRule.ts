import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {duringMainPhase, hasActivationWindowMention, parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";

export default class FastCardActivationWindowParseRule implements EffectParseRule {
  match({sentence, isFastCard}: EffectParseProps): boolean {
    return (
      isFastCard && !duringMainPhase(sentence) && hasActivationWindowMention(sentence)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new QuickEffect(parseEffectClauses(sentence));
  }
}
