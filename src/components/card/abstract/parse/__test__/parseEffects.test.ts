import {describe, expect, test} from '@jest/globals';
import {parseEffects} from '../parseEffects';
import EffectRestriction from "../../effect/EffectRestriction.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import EffectConditionClause from "../../effect/clause/EffectConditionClause.ts";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import Effect from "../../effect/Effect.tsx";

describe('parseEffects', () => {
  function testParseEffects(text: string, expectedRestrictions: EffectRestriction[], expectedEffects: Effect[]) {
    const {restrictions, effects} = parseEffects(text);

    expect(effects).toEqual(expectedEffects);
    expect(restrictions).toEqual(expectedRestrictions);
  }

  test('should parse "Purrely"', () => {
    const purrelyText = "If this card is Normal or Special Summoned: You can excavate the top 3 cards of your Deck, and if you do, you can add 1 excavated \"Purrely\" Spell/Trap to your hand, also place the rest on the bottom of the Deck in any order. Once per turn: You can reveal 1 \"Purrely\" Quick-Play Spell in your hand, and if you do, Special Summon 1 Xyz Monster that mentions it from your Extra Deck, by using this face-up card you control as material, and if you do, attach the revealed card to the Summoned monster as additional material. (This is treated as an Xyz Summon.)";
    const expectedRestrictions: EffectRestriction[] = [];
    const expectedEffects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can excavate the top 3 cards of your Deck, and if you do, you can add 1 excavated \"Purrely\" Spell/Trap to your hand, also place the rest on the bottom of the Deck in any order."),
      ]),
      new IgnitionEffect([
        new EffectConditionClause("Once per turn"),
        new EffectMainClause("You can reveal 1 \"Purrely\" Quick-Play Spell in your hand, and if you do, Special Summon 1 Xyz Monster that mentions it from your Extra Deck, by using this face-up card you control as material, and if you do, attach the revealed card to the Summoned monster as additional material. (This is treated as an Xyz Summon.)"),
      ])
    ];
    testParseEffects(purrelyText, expectedRestrictions, expectedEffects);
  })
});
