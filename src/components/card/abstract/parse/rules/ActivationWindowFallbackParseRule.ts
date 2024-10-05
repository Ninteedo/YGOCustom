import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";

/**
 * Parses a sentence that mentions an activation window.
 *
 * Low priority, only used if no other activation window rules match.
 */
export default class ActivationWindowFallbackParseRule extends EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return this.hasActivationWindowMention(sentence);
  }

  parse({sentence, isFastCard}: EffectParseProps): Effect {
    if (isFastCard) {
      return new QuickEffect(parseEffectClauses(sentence));
    } if (this.hasCondition(sentence) || this.hasCost(sentence)) {
      return new IgnitionEffect(parseEffectClauses(sentence))
    } else {
      return new ContinuousEffect([new EffectMainClause(sentence)]);
    }
  }
}
