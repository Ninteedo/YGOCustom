import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import SubEffectClause from "../../effect/clause/SubEffectClause.tsx";
import SummoningCondition from "../../effect/SummoningCondition.tsx";

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
        || sentence.startsWith("The ")
        || sentence.startsWith("Then")
        || sentence.startsWith("Its ")
        || sentence.startsWith("After choosing ")
        || sentence.startsWith("You can also ")
        || sentence.startsWith("You can use this effect ")
        || sentence.startsWith("This is a Quick Effect if ")
        || sentence.startsWith("For the rest of this turn, ")
        || sentence.startsWith("You must also ")
        || sentence.startsWith("If Set")
        || sentence.includes(" activate this effect")
        || sentence.includes(" by this effect")
        || sentence.includes(" this effect's activation")
        || sentence.includes(" that same effect ")
        || (sentence.startsWith("(") && sentence.endsWith(")"))
      )
    );
  }

  parse({sentence, lastEffect}: EffectParseProps): null {
    if (lastEffect instanceof TriggerEffect || lastEffect instanceof IgnitionEffect || lastEffect instanceof QuickEffect || lastEffect instanceof SummoningCondition) {
      const lastClause = lastEffect.clauses[lastEffect.clauses.length - 1];
      if (lastClause instanceof SubEffectClause) {
        lastClause.subClauses.push(new EffectMainClause(sentence));
      } else {
        lastEffect.clauses.push(new EffectMainClause(sentence));
      }
    }
    return null;
  }
}
