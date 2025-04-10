import Effect from "../../effect/Effect.tsx";
import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import {parseEffectClauses} from "../parseEffects.ts";
import SubEffectClause from "../../effect/clause/SubEffectClause.tsx";

export default class SubEffectParseRule extends EffectParseRule {
  public match({isSub, lastEffect, lastIsSub}: EffectParseProps): boolean {
    if (!isSub || lastEffect === null || !lastEffect.isProperEffect() || lastIsSub) {
      return false;
    }
    const lastEffectText = lastEffect.toText();
    return (
      lastEffectText.includes("this effect")
      || lastEffectText.includes("these effects")
      || lastEffectText.includes("this additional effect")
      || lastEffectText.includes("the following effect")
      || lastEffectText.includes(" the appropriate effect")
      || lastEffectText.toLowerCase().includes("toss a coin")
      || lastEffectText.includes(" of the following ")
      || lastEffectText.includes(" choose 1 effect ")
      || lastEffectText.includes(" an effect based on ")
    );
  }

  public parse({sentence, lastEffect}: EffectParseProps): Effect | null {
    if (lastEffect) {
      lastEffect.addSubEffect([new SubEffectClause(parseEffectClauses(sentence))]);
    }
    return null;
  }
}
