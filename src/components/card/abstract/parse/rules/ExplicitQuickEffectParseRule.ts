import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";

/**
 * Parses an explicit Quick Effect.
 *
 * This rule matches if the sentence contains "(Quick Effect):" or "During either player's turn".
 *
 * Also matches if the sentence contains "If this card is treated as a Continuous Trap".
 */
export default class ExplicitQuickEffectParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    const condition = this.getCondition(sentence);
    return !!(
      condition.includes("(Quick Effect)")
      || condition.toLowerCase().includes("during either player's turn")
      || condition.toLowerCase().match(/if this card is (treated as )?a continuous trap/)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new QuickEffect(parseEffectClauses(sentence));
  }
}
