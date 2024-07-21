import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import FlipEffect from "../../effect/FlipEffect.tsx";

export default class FlipParseRule implements EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return sentence.startsWith("FLIP:");
  }

  parse({sentence}: EffectParseProps): Effect {
    return new FlipEffect(parseEffectClauses(sentence));
  }
}
