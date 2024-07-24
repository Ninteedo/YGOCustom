import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import FlipEffect from "../../effect/FlipEffect.tsx";

/**
 * Parses a FLIP effect.
 */
export default class FlipParseRule extends EffectParseRule {
  private readonly flipPrefix = "FLIP: ";

  match({sentence}: EffectParseProps): boolean {
    return sentence.startsWith(this.flipPrefix);
  }

  parse({sentence}: EffectParseProps): Effect {
    return new FlipEffect(parseEffectClauses(sentence.substring(this.flipPrefix.length)));
  }
}
