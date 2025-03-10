import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import EffectRestriction from "../../effect/EffectRestriction.tsx";

/**
 * Parses an effect restriction.
 */
export default class EffectRestrictionParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return (
      sentence.startsWith("You can only ")
      || sentence.includes(" the turn you activate this card")
      || sentence.startsWith("You can use this effect of ")
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new EffectRestriction(sentence);
  }
}
