import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";

export default class FastCardActivationWindowParseRule extends EffectParseRule {
  match({sentence, isFastCard}: EffectParseProps): boolean {
    return (
      isFastCard && !this.duringMainPhase(sentence) && this.hasActivationWindowMention(sentence)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new QuickEffect(parseEffectClauses(sentence));
  }
}
