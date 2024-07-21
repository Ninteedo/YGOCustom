import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {hasActivationWindowMention, parseEffectClauses} from "../parseEffects.ts";
import Effect from "../../effect/Effect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";

export default class ActivationWindowFallbackParseRule implements EffectParseRule {
  match({sentence}: EffectParseProps): boolean {
    return hasActivationWindowMention(sentence);
  }

  parse({sentence, isFastCard}: EffectParseProps): Effect {
    if (isFastCard) {
      return new QuickEffect(parseEffectClauses(sentence));
    } if (sentence.includes(": ") || sentence.includes("; ")) {
      return new IgnitionEffect(parseEffectClauses(sentence))
    } else {
      return new ContinuousEffect(new EffectMainClause(sentence));
    }
  }
}
