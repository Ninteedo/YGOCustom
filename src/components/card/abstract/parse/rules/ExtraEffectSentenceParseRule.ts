import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";

/**
 * Parses a sentence that is an extension of the previous sentence.
 */
export default class ExtraEffectSentenceParseRule extends EffectParseRule {
  match({sentence, lastEffect}: EffectParseProps): boolean {
    return (
      !!lastEffect && !this.hasCondition(sentence) && !this.hasCost(sentence) && (
        sentence.startsWith("Otherwise, ")
        || sentence.startsWith("That ")
        || sentence.startsWith("It ")
        || sentence.includes(" this effect ")
      )
    );
  }

  parse({sentence, lastEffect}: EffectParseProps): null {
    if (lastEffect instanceof TriggerEffect || lastEffect instanceof IgnitionEffect || lastEffect instanceof QuickEffect) {
      lastEffect.clauses.push(new EffectMainClause(sentence));
    }
    return null;
  }
}
