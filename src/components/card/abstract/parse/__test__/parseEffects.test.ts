import {describe, expect, test} from '@jest/globals';
import {parseEffects, ParseEffectsProps} from "../parseEffects";
import EffectRestriction from "../../effect/EffectRestriction.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import EffectConditionClause from "../../effect/clause/EffectConditionClause.ts";
import EffectMainClause from "../../effect/clause/EffectMainClause.ts";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import Effect from "../../effect/Effect.tsx";
import QuickEffect from "../../effect/QuickEffect.tsx";
import EffectCostClause from "../../effect/clause/EffectCostClause.ts";
import ContinuousEffect from "../../effect/ContinuousEffect.tsx";

describe('parseEffects should parse', () => {
  function testParseEffects(props: ParseEffectsProps, expectedRestrictions: EffectRestriction[], expectedEffects: Effect[]) {
    const {restrictions, effects} = parseEffects(props);
    expect(effects).toEqual(expectedEffects);
    expect(restrictions).toEqual(expectedRestrictions);
  }

  test('Purrely', () => {
    const text = "If this card is Normal or Special Summoned: You can excavate the top 3 cards of your Deck, and if you do, you can add 1 excavated \"Purrely\" Spell/Trap to your hand, also place the rest on the bottom of the Deck in any order. Once per turn: You can reveal 1 \"Purrely\" Quick-Play Spell in your hand, and if you do, Special Summon 1 Xyz Monster that mentions it from your Extra Deck, by using this face-up card you control as material, and if you do, attach the revealed card to the Summoned monster as additional material. (This is treated as an Xyz Summon.)";
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
    testParseEffects({text}, [], expectedEffects);
  });

  test('Big Welcome Labrynth', () => {
    const text = "Special Summon 1 \"Labrynth\" monster from your hand, Deck, or GY, then return 1 monster you control to the hand. You can banish this card from your GY, then target 1 Fiend monster you control, or, if you control a Level 8 or higher Fiend monster, you can target 1 card your opponent controls instead; return that card to the hand. You can only use 1 \"Big Welcome Labrynth\" effect per turn, and only once that turn.";
    const restrictions = [
      new EffectRestriction("You can only use 1 \"Big Welcome Labrynth\" effect per turn, and only once that turn.")
    ];
    const effects = [
      new QuickEffect([
        new EffectMainClause("Special Summon 1 \"Labrynth\" monster from your hand, Deck, or GY, then return 1 monster you control to the hand."),
      ]),
      new QuickEffect([
        new EffectCostClause("You can banish this card from your GY, then target 1 Fiend monster you control, or, if you control a Level 8 or higher Fiend monster, you can target 1 card your opponent controls instead"),
        new EffectMainClause("return that card to the hand."),
      ])
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true}, restrictions, effects);
  });

  test('Dimension Shifter', () => {
    const text = "If you have no cards in your GY (Quick Effect): You can send this card from your hand to the GY; until the end of the next turn, any card sent to the GY is banished instead.";
    const effects = [
      new QuickEffect([
        new EffectConditionClause("If you have no cards in your GY (Quick Effect)"),
        new EffectCostClause("You can send this card from your hand to the GY"),
        new EffectMainClause("until the end of the next turn, any card sent to the GY is banished instead."),
      ])
    ];
    testParseEffects({text}, [], effects);
  });

  test('Snake-Eye Ash', () => {
    const text = "If this card is Normal or Special Summoned: You can add 1 Level 1 FIRE monster from your Deck to your hand. You can send 2 face-up cards you control to the GY, including this card; Special Summon 1 \"Snake-Eye\" monster from your hand or Deck, except \"Snake-Eye Ash\". You can only use each effect of \"Snake-Eye Ash\" once per turn.";
    const expectedRestrictions = [
      new EffectRestriction("You can only use each effect of \"Snake-Eye Ash\" once per turn.")
    ];
    const expectedEffects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 Level 1 FIRE monster from your Deck to your hand."),
      ]),
      new IgnitionEffect([
        new EffectCostClause("You can send 2 face-up cards you control to the GY, including this card"),
        new EffectMainClause("Special Summon 1 \"Snake-Eye\" monster from your hand or Deck, except \"Snake-Eye Ash\"."),
      ])
    ];
    testParseEffects({text}, expectedRestrictions, expectedEffects);
  });

  test('Personal Spoofing', () => {
    const text = "Once per turn: You can shuffle 1 \"Altergeist\" card from your hand or face-up from your field into the Main Deck; add 1 \"Altergeist\" monster from your Deck to your hand.";
    const effects = [
      new QuickEffect([
        new EffectConditionClause("Once per turn"),
        new EffectCostClause("You can shuffle 1 \"Altergeist\" card from your hand or face-up from your field into the Main Deck"),
        new EffectMainClause("add 1 \"Altergeist\" monster from your Deck to your hand."),
      ]),
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, [], effects);
  });

  test('Skill Drain', () => {
    const text = "Activate this card by paying 1000 LP. Negate the effects of all face-up monsters while they are face-up on the field (but their effects can still be activated).";
    const effects = [
      new ContinuousEffect([
        new EffectMainClause("Activate this card by paying 1000 LP.")
      ]),
      new ContinuousEffect([
        new EffectMainClause("Negate the effects of all face-up monsters while they are face-up on the field (but their effects can still be activated)."),
      ]),
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true, isContinuousSpellTrapCard: true}, [], effects);
  })
});
