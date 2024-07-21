import Effect from "../../effect/Effect.tsx";
import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import QuickEffect from "../../effect/QuickEffect.tsx";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";

export default class SpellTrapActivationParseRule implements EffectParseRule {
  match({isSpellTrap, isFirstSentence}: EffectParseProps): boolean {
    return isSpellTrap && isFirstSentence;
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
