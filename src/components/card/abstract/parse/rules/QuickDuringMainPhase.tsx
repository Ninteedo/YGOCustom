import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";

export default class QuickDuringMainPhase extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      !!sentence.toLowerCase().match(/during (each|the|your opponent's) main phase/)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new QuickEffect(parseEffectClauses(sentence));
  }
}
