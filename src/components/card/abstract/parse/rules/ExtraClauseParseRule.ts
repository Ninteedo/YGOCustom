import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import EffectExtraClause from "../../effect/clause/EffectExtraClause.tsx";

/**
 * Parses a sentence that indicates that a card is always treated as another card.
 */
export default class ExtraClauseParseRule extends EffectParseRule {
  match({sentence, lastEffect}: EffectParseProps): boolean {
    return !!lastEffect && sentence.startsWith("(") && sentence.endsWith(")");
  }

  parse({sentence, lastEffect}: EffectParseProps): Effect | null {
    if (lastEffect) {
      lastEffect.addSubEffect([new EffectExtraClause(sentence)]);
    }
    return null;
  }
}
