import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";

export default class ExplicitQuickEffectParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return !!(
      sentence.includes("(Quick Effect):")
      || sentence.toLowerCase().includes("during either player's turn")
      || sentence.toLowerCase().match(/if this card is (treated as )?a continuous trap/)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new QuickEffect(parseEffectClauses(sentence));
  }
}
