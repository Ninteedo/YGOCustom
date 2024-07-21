import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import EffectRestriction from "../../effect/EffectRestriction.tsx";

export default class EffectRestrictionParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return sentence.startsWith("You can only ");
  }

  parse({sentence}: EffectParseProps): Effect {
    return new EffectRestriction(sentence);
  }
}
