import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import SummoningCondition from "../../effect/SummoningCondition.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";

/**
 * Parses a summoning condition.
 */
export default class SummoningConditionParseRule extends EffectParseRule {
  match({sentence, isSpellTrap}: EffectParseProps): boolean {
    if (isSpellTrap) {
      return false;
    }

    if (this.hasCost(sentence) || this.hasCondition(sentence)) {
      return false;
    }

    const summoningTypes = ["Ritual", "Fusion", "Synchro", "Xyz", "Link", "Special", "Tribute"];
    const pattern = "you can (also )?(" + summoningTypes.join("|") + ") summon (this card|\")";
    return !!(
      sentence.match(new RegExp(pattern, "i")) ||
      sentence.startsWith("Cannot be Normal Summoned/Set") ||
      sentence.startsWith("Cannot be Special Summoned") ||
      sentence.match(/^Must (first )?be (\w)+ Summoned/)
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new SummoningCondition(new EffectMainClause(sentence));
  }
}
