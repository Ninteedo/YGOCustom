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
import SummoningCondition from "../../effect/SummoningCondition.tsx";

describe('parseEffects should parse', () => {
  function testParseEffects(props: ParseEffectsProps, expectedRestrictions: EffectRestriction[], expectedEffects: Effect[]) {
    const {restrictions, effects} = parseEffects(props);
    expect(effects).toStrictEqual(expectedEffects);
    expect(restrictions).toStrictEqual(expectedRestrictions);
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
      new ContinuousEffect(
        new EffectMainClause("Activate this card by paying 1000 LP.")
      ),
      new ContinuousEffect(
        new EffectMainClause("Negate the effects of all face-up monsters while they are face-up on the field (but their effects can still be activated)."),
      ),
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true, isContinuousSpellTrapCard: true}, [], effects);
  })

  test('Laundry Dragonmaid', () => {
    const text = "If this card is Normal or Special Summoned: You can send the top 3 cards of your Deck to the GY. At the start of the Battle Phase: You can return this card to the hand, and if you do, Special Summon 1 Level 7 \"Dragonmaid\" monster from your hand or GY. You can only use each effect of \"Laundry Dragonmaid\" once per turn."
    const restrictions = [
      new EffectRestriction("You can only use each effect of \"Laundry Dragonmaid\" once per turn.")
    ];
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can send the top 3 cards of your Deck to the GY."),
      ]),
      new TriggerEffect([
        new EffectConditionClause("At the start of the Battle Phase"),
        new EffectMainClause("You can return this card to the hand, and if you do, Special Summon 1 Level 7 \"Dragonmaid\" monster from your hand or GY."),
      ]),
    ];
    testParseEffects({text}, restrictions, effects);
  });

  test('My Friend Purrely', () => {
    const text = "You can pay 500 LP; reveal 3 \"Purrely\" cards from your Deck, except \"My Friend Purrely\", and your opponent randomly picks 1 for you to add to your hand, also shuffle the rest into your Deck. If a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card, even during the Damage Step: You can add up to 3 \"Purrely\" Quick-Play Spells with different names from your GY to your hand. You can only use each effect of \"My Friend Purrely\" once per turn.";
    const restrictions = [
      new EffectRestriction("You can only use each effect of \"My Friend Purrely\" once per turn.")
    ];
    const effects = [
      new IgnitionEffect([
        new EffectCostClause("You can pay 500 LP"),
        new EffectMainClause("reveal 3 \"Purrely\" cards from your Deck, except \"My Friend Purrely\", and your opponent randomly picks 1 for you to add to your hand, also shuffle the rest into your Deck."),
      ]),
      new TriggerEffect([
        new EffectConditionClause("If a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card, even during the Damage Step"),
        new EffectMainClause("You can add up to 3 \"Purrely\" Quick-Play Spells with different names from your GY to your hand."),
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, restrictions, effects);
  });

  test('Stray Purrely Street', () => {
    const text = "Your opponent cannot target \"Purrely\" monsters you control with card effects, the turn they are Special Summoned. Once per turn, if a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card: Special Summon 1 Level 1 \"Purrely\" monster from your Deck or GY. Once per turn, during the End Phase: You can target 1 \"Purrely\" Xyz Monster on the field; attach 1 \"Purrely\" Quick-Play Spell from your Deck or GY to that monster as material.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("Your opponent cannot target \"Purrely\" monsters you control with card effects, the turn they are Special Summoned.")),
      new TriggerEffect([
        new EffectConditionClause("Once per turn, if a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card"),
        new EffectMainClause("Special Summon 1 Level 1 \"Purrely\" monster from your Deck or GY."),
      ]),
      new TriggerEffect([
        new EffectConditionClause("Once per turn, during the End Phase"),
        new EffectCostClause("You can target 1 \"Purrely\" Xyz Monster on the field"),
        new EffectMainClause("attach 1 \"Purrely\" Quick-Play Spell from your Deck or GY to that monster as material."),
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, [], effects);
  });

  test('Purrelyly', () => {
    const text = "If this card is Normal or Special Summoned: You can add 1 \"Purrely\" card from your Deck to your hand, except a Quick-Play Spell. You can target 1 \"Purrely\" Quick-Play Spell in your GY; Special Summon 1 Xyz Monster from your Extra Deck that mentions that card, by using this card you control as material, and if you do, attach that Spell to the Summoned monster. (This is treated as an Xyz Summon.) You can only use each effect of \"Purrelyly\" once per turn.";
    const restrictions = [
      new EffectRestriction("You can only use each effect of \"Purrelyly\" once per turn.")
    ];
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 \"Purrely\" card from your Deck to your hand, except a Quick-Play Spell."),
      ]),
      new IgnitionEffect([
        new EffectCostClause("You can target 1 \"Purrely\" Quick-Play Spell in your GY"),
        new EffectMainClause("Special Summon 1 Xyz Monster from your Extra Deck that mentions that card, by using this card you control as material, and if you do, attach that Spell to the Summoned monster. (This is treated as an Xyz Summon.)"),
      ])
    ];
    testParseEffects({text}, restrictions, effects);
  });

  test('Kashtira Arise-Heart', () => {
    const text = "Once per turn, you can also Xyz Summon \"Kashtira Arise-Heart\" by using 1 \"Kashtira\" monster you control, if an effect of \"Kashtira Shangri-Ira\" was successfully activated this turn. (Transfer its materials to this card.) Any card sent to the GY is banished instead. Once per Chain, each time a card(s) is banished: Attach 1 banished card to this card as material. Once per turn (Quick Effect): You can detach 3 materials from this card, then target 1 card on the field; banish it face-down.";
    const effects = [
      new SummoningCondition(
        new EffectMainClause("Once per turn, you can also Xyz Summon \"Kashtira Arise-Heart\" by using 1 \"Kashtira\" monster you control, if an effect of \"Kashtira Shangri-Ira\" was successfully activated this turn. (Transfer its materials to this card.)")
      ),
      new ContinuousEffect(
        new EffectMainClause("Any card sent to the GY is banished instead.")
      ),
      new TriggerEffect([
        new EffectConditionClause("Once per Chain, each time a card(s) is banished"),
        new EffectMainClause("Attach 1 banished card to this card as material.")
      ]),
      new QuickEffect([
        new EffectConditionClause("Once per turn (Quick Effect)"),
        new EffectCostClause("You can detach 3 materials from this card, then target 1 card on the field"),
        new EffectMainClause("banish it face-down.")
      ])
    ];
    testParseEffects({text}, [], effects);
  });

  test('Red-Eyes Alternative Black Dragon', () => {
    const text = "Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by Tributing 1 \"Red-Eyes\" monster from your hand or field. You can only Special Summon \"Red-Eyes Alternative Black Dragon\" once per turn this way. If this card is destroyed by battle, or if this card in its owner's possession is destroyed by an opponent's card effect: You can target 1 Level 7 or lower \"Red-Eyes\" monster in your GY, except \"Red-Eyes Alternative Black Dragon\"; Special Summon it, and if it was a \"Red-Eyes B. Dragon\" that was Special Summoned, its original ATK becomes doubled.";
    const restrictions = [new EffectRestriction("You can only Special Summon \"Red-Eyes Alternative Black Dragon\" once per turn this way.")];
    const effects = [
      new SummoningCondition(new EffectMainClause("Cannot be Normal Summoned/Set.")),
      new SummoningCondition(new EffectMainClause("Must first be Special Summoned (from your hand) by Tributing 1 \"Red-Eyes\" monster from your hand or field.")),
      new TriggerEffect([
        new EffectConditionClause("If this card is destroyed by battle, or if this card in its owner's possession is destroyed by an opponent's card effect"),
        new EffectCostClause("You can target 1 Level 7 or lower \"Red-Eyes\" monster in your GY, except \"Red-Eyes Alternative Black Dragon\""),
        new EffectMainClause("Special Summon it, and if it was a \"Red-Eyes B. Dragon\" that was Special Summoned, its original ATK becomes doubled.")
      ])
    ];
    testParseEffects({text}, restrictions, effects);
  });
});
