import Effect from "../../effect/Effect.tsx";
import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";

/**
 * Parses the activation effect of a Spell or Trap card.
 *
 * This is the first sentence of the card text.
 *
 * This can also apply to Continuous Spell/Trap cards if the sentence starts with "When this card is activated".
 */
export default class SpellTrapActivationParseRule extends EffectParseRule {
  match({sentence, isSpellTrap, isFirstSentence, isContinuous}: EffectParseProps): boolean {
    return isSpellTrap && isFirstSentence && (
      !isContinuous || sentence.startsWith("When this card is activated")
    );
  }

  parse({isContinuous, sentence, isFastCard}: EffectParseProps): Effect {
    const clauses = parseEffectClauses(sentence);
    if (!isContinuous || sentence.includes(": ") || sentence.includes("; ")) {
      if (isFastCard) {
        return new QuickEffect(clauses);
      } else {
        return new IgnitionEffect(clauses);
      }
    } else {
      return new ContinuousEffect(clauses[0]);
    }
  }
}
