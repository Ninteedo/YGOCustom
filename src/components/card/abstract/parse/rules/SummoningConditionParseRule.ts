import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import SummoningCondition from "../../effect/SummoningCondition.tsx";
import EffectMainClause from "../../effect/clause/EffectMainClause.tsx";

/**
 * Parses a summoning condition.
 */
export default class SummoningConditionParseRule extends EffectParseRule {
  match({sentence, isSpellTrap}: EffectParseProps): boolean {
    if (isSpellTrap || this.hasCost(sentence) || this.hasCondition(sentence)) {
      return false;
    }

    if (sentence.startsWith("Cannot be Normal Summoned/Set") || sentence.startsWith("Cannot be Special Summoned")) {
      return true;
    }

    const summoningTypes = ["Ritual", "Fusion", "Synchro", "Xyz", "Link", "Special", "Tribute", "Normal"];
    const summoningTypeDisjunction = "(" + summoningTypes.join("|") + ")";
    const positivePattern = `(this monster can only be |you (can|must) (also )?)${summoningTypeDisjunction} summon(ed)? (this card|")?`;
    const negativePattern = `cannot be ${summoningTypeDisjunction} summoned`;
    return !!(
      sentence.match(/^Must (first )?be (either )?(\w)+ Summoned/)
      || sentence.match(new RegExp(positivePattern, "i"))
      || sentence.match(new RegExp(negativePattern, "i"))
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    return new SummoningCondition([new EffectMainClause(sentence)]);
  }
}
