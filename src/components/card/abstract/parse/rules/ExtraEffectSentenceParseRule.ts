import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import SubEffectClause from "../../effect/clause/SubEffectClause.tsx";
import ClauseEffect from "../../effect/ClauseEffect.ts";

/**
 * Parses a sentence that is an extension of the previous sentence.
 */
export default class ExtraEffectSentenceParseRule extends EffectParseRule {
  match({sentence, lastEffect}: EffectParseProps): boolean {
    if (!(lastEffect instanceof ClauseEffect)) {
      return false;
    }

    if (lastEffect) {
      const lastEffectText = lastEffect.toText();
      if (lastEffectText.startsWith("(") && lastEffectText.endsWith(")")) {
        return true;
      }
    }

    return (
      !!lastEffect && !this.hasCondition(sentence) && !this.hasCost(sentence) && (
        sentence.startsWith("Otherwise, ")
        || sentence.startsWith("That ")
        || sentence.startsWith("It ")
        || sentence.startsWith("The Set ")
        || sentence.startsWith("Then ")
        || sentence.startsWith("Then, ")
        || sentence.startsWith("Their ")
        || sentence.startsWith("They ")
        || sentence.startsWith("These ")
        || sentence.startsWith("Its ")
        || sentence.startsWith("After choosing ")
        || sentence.startsWith("You can also ")
        || sentence.startsWith("You can use this effect ")
        || sentence.startsWith("This is a Quick Effect if ")
        || sentence.startsWith("For the rest of this turn, ")
        || sentence.startsWith("For the rest of this turn after this card resolves")
        || sentence.startsWith("You must also ")
        || sentence.startsWith("If Set")
        || sentence.startsWith("If Summoned this way")
        || sentence.startsWith("This card's activation ")
        || sentence.startsWith("Unless ")
        || sentence.includes(" activate this effect")
        || sentence.includes(" by this effect")
        || sentence.includes(" this effect's activation")
        || sentence.includes(" that same effect ")
        || sentence.includes(" this effect is activated")
        || sentence.includes(" to activate and to resolve this effect")
        || sentence.includes(" to activate and resolve this effect")
        || sentence.includes(" you can apply both ")
        || (sentence.startsWith("(") && sentence.endsWith(")"))
        || (sentence.startsWith("If ") && !sentence.includes(" would ") && sentence.includes(" instead"))
      )
    );
  }

  parse({sentence, lastEffect, hasPrecedingNewLine, isSub}: EffectParseProps): null {
    if (!(lastEffect instanceof ClauseEffect)) {
      throw new Error(`Unexpected last effect: ${lastEffect}`);
    }
    const lastClause = lastEffect.clauses[lastEffect.clauses.length - 1];
    if ((!hasPrecedingNewLine || isSub) && lastClause instanceof SubEffectClause) {
      lastClause.subClauses.push(new EffectMainClause(sentence));
    } else {
      lastEffect.clauses.push(new EffectMainClause(sentence));
    }
    return null;
  }
}
