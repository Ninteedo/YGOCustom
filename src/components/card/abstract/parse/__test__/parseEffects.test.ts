import {describe, expect, test} from "@jest/globals";
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
import GeminiEffect from "../../effect/GeminiEffect.tsx";
import {parsePendulumText} from "../parsePendulum.ts";
import AlwaysTreatedAs from "../../effect/AlwaysTreatedAs.tsx";
import FlipEffect from "../../effect/FlipEffect.tsx";
import SubEffectClause from "../../effect/clause/SubEffectClause.tsx";

describe('parseEffects should parse', () => {
  function testParseEffects(props: ParseEffectsProps, expectedEffects: Effect[]) {
    const effects = parseEffects(props);
    expect(effects).toStrictEqual(expectedEffects);
  }

  function testParsePendulumEffects(
    props: ParseEffectsProps,
    expectedPendulumEffects: Effect[],
    expectedMonsterEffects: Effect[]
  ) {
    const {pendulumEffects, monsterEffects} = parsePendulumText(props.text, false);
    expect(pendulumEffects).toStrictEqual(expectedPendulumEffects);
    expect(monsterEffects).toStrictEqual(expectedMonsterEffects);
  }

  test('Purrely', () => {
    const text = "If this card is Normal or Special Summoned: You can excavate the top 3 cards of your Deck, and if you do, you can add 1 excavated \"Purrely\" Spell/Trap to your hand, also place the rest on the bottom of the Deck in any order. Once per turn: You can reveal 1 \"Purrely\" Quick-Play Spell in your hand, and if you do, Special Summon 1 Xyz Monster that mentions it from your Extra Deck, by using this face-up card you control as material, and if you do, attach the revealed card to the Summoned monster as additional material. (This is treated as an Xyz Summon.)";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can excavate the top 3 cards of your Deck, and if you do, you can add 1 excavated \"Purrely\" Spell/Trap to your hand, also place the rest on the bottom of the Deck in any order."),
      ]),
      new IgnitionEffect([
        new EffectConditionClause("Once per turn"),
        new EffectMainClause("You can reveal 1 \"Purrely\" Quick-Play Spell in your hand, and if you do, Special Summon 1 Xyz Monster that mentions it from your Extra Deck, by using this face-up card you control as material, and if you do, attach the revealed card to the Summoned monster as additional material. (This is treated as an Xyz Summon.)"),
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Big Welcome Labrynth', () => {
    const text = "Special Summon 1 \"Labrynth\" monster from your hand, Deck, or GY, then return 1 monster you control to the hand. You can banish this card from your GY, then target 1 Fiend monster you control, or, if you control a Level 8 or higher Fiend monster, you can target 1 card your opponent controls instead; return that card to the hand. You can only use 1 \"Big Welcome Labrynth\" effect per turn, and only once that turn.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("Special Summon 1 \"Labrynth\" monster from your hand, Deck, or GY, then return 1 monster you control to the hand."),
      ]),
      new QuickEffect([
        new EffectCostClause("You can banish this card from your GY, then target 1 Fiend monster you control, or, if you control a Level 8 or higher Fiend monster, you can target 1 card your opponent controls instead"),
        new EffectMainClause("return that card to the hand."),
      ]),
      new EffectRestriction("You can only use 1 \"Big Welcome Labrynth\" effect per turn, and only once that turn."),
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true}, effects);
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
    testParseEffects({text}, effects);
  });

  test('Snake-Eye Ash', () => {
    const text = "If this card is Normal or Special Summoned: You can add 1 Level 1 FIRE monster from your Deck to your hand. You can send 2 face-up cards you control to the GY, including this card; Special Summon 1 \"Snake-Eye\" monster from your hand or Deck, except \"Snake-Eye Ash\". You can only use each effect of \"Snake-Eye Ash\" once per turn.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 Level 1 FIRE monster from your Deck to your hand."),
      ]),
      new IgnitionEffect([
        new EffectCostClause("You can send 2 face-up cards you control to the GY, including this card"),
        new EffectMainClause("Special Summon 1 \"Snake-Eye\" monster from your hand or Deck, except \"Snake-Eye Ash\"."),
      ]),
      new EffectRestriction("You can only use each effect of \"Snake-Eye Ash\" once per turn."),
    ];
    testParseEffects({text}, effects);
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
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
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
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true, isContinuousSpellTrapCard: true}, effects);
  })

  test('Laundry Dragonmaid', () => {
    const text = "If this card is Normal or Special Summoned: You can send the top 3 cards of your Deck to the GY. At the start of the Battle Phase: You can return this card to the hand, and if you do, Special Summon 1 Level 7 \"Dragonmaid\" monster from your hand or GY. You can only use each effect of \"Laundry Dragonmaid\" once per turn."
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can send the top 3 cards of your Deck to the GY."),
      ]),
      new TriggerEffect([
        new EffectConditionClause("At the start of the Battle Phase"),
        new EffectMainClause("You can return this card to the hand, and if you do, Special Summon 1 Level 7 \"Dragonmaid\" monster from your hand or GY."),
      ]),
      new EffectRestriction("You can only use each effect of \"Laundry Dragonmaid\" once per turn."),
    ];
    testParseEffects({text}, effects);
  });

  test('My Friend Purrely', () => {
    const text = "You can pay 500 LP; reveal 3 \"Purrely\" cards from your Deck, except \"My Friend Purrely\", and your opponent randomly picks 1 for you to add to your hand, also shuffle the rest into your Deck. If a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card, even during the Damage Step: You can add up to 3 \"Purrely\" Quick-Play Spells with different names from your GY to your hand. You can only use each effect of \"My Friend Purrely\" once per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectCostClause("You can pay 500 LP"),
        new EffectMainClause("reveal 3 \"Purrely\" cards from your Deck, except \"My Friend Purrely\", and your opponent randomly picks 1 for you to add to your hand, also shuffle the rest into your Deck."),
      ]),
      new TriggerEffect([
        new EffectConditionClause("If a face-up \"Purrely\" Xyz Monster(s) you control leaves the field because of an opponent's card, even during the Damage Step"),
        new EffectMainClause("You can add up to 3 \"Purrely\" Quick-Play Spells with different names from your GY to your hand."),
      ]),
      new EffectRestriction("You can only use each effect of \"My Friend Purrely\" once per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
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
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Purrelyly', () => {
    const text = "If this card is Normal or Special Summoned: You can add 1 \"Purrely\" card from your Deck to your hand, except a Quick-Play Spell. You can target 1 \"Purrely\" Quick-Play Spell in your GY; Special Summon 1 Xyz Monster from your Extra Deck that mentions that card, by using this card you control as material, and if you do, attach that Spell to the Summoned monster. (This is treated as an Xyz Summon.) You can only use each effect of \"Purrelyly\" once per turn.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 \"Purrely\" card from your Deck to your hand, except a Quick-Play Spell."),
      ]),
      new IgnitionEffect([
        new EffectCostClause("You can target 1 \"Purrely\" Quick-Play Spell in your GY"),
        new EffectMainClause("Special Summon 1 Xyz Monster from your Extra Deck that mentions that card, by using this card you control as material, and if you do, attach that Spell to the Summoned monster. (This is treated as an Xyz Summon.)"),
      ]),
      new EffectRestriction("You can only use each effect of \"Purrelyly\" once per turn.")
    ];
    testParseEffects({text}, effects);
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
    testParseEffects({text}, effects);
  });

  test('Red-Eyes Alternative Black Dragon', () => {
    const text = "Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by Tributing 1 \"Red-Eyes\" monster from your hand or field. You can only Special Summon \"Red-Eyes Alternative Black Dragon\" once per turn this way. If this card is destroyed by battle, or if this card in its owner's possession is destroyed by an opponent's card effect: You can target 1 Level 7 or lower \"Red-Eyes\" monster in your GY, except \"Red-Eyes Alternative Black Dragon\"; Special Summon it, and if it was a \"Red-Eyes B. Dragon\" that was Special Summoned, its original ATK becomes doubled.";
    const effects = [
      new SummoningCondition(new EffectMainClause("Cannot be Normal Summoned/Set.")),
      new SummoningCondition(new EffectMainClause("Must first be Special Summoned (from your hand) by Tributing 1 \"Red-Eyes\" monster from your hand or field.")),
      new EffectRestriction("You can only Special Summon \"Red-Eyes Alternative Black Dragon\" once per turn this way."),
      new TriggerEffect([
        new EffectConditionClause("If this card is destroyed by battle, or if this card in its owner's possession is destroyed by an opponent's card effect"),
        new EffectCostClause("You can target 1 Level 7 or lower \"Red-Eyes\" monster in your GY, except \"Red-Eyes Alternative Black Dragon\""),
        new EffectMainClause("Special Summon it, and if it was a \"Red-Eyes B. Dragon\" that was Special Summoned, its original ATK becomes doubled.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Red-Eyes Archfiend of Lightning', () => {
    const text = "This card is treated as a Normal Monster while face-up on the field or in the Graveyard. While this card is a Normal Monster on the field, you can Normal Summon it to have it become an Effect Monster with this effect.\n● Once per turn: You can destroy all face-up monsters your opponent controls with DEF lower than this card's ATK.";
    const effects = [
      new GeminiEffect([
        new IgnitionEffect([
          new EffectConditionClause("Once per turn"),
          new EffectMainClause("You can destroy all face-up monsters your opponent controls with DEF lower than this card's ATK.")
        ])
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Red-Eyes Black Dragon Sword', () => {
    const text = "Must be Special Summoned with \"The Claw of Hermos\", using a Dragon monster. If this card is Special Summoned: Target 1 other face-up monster on the field; equip this card to it. It gains 1000 ATK, and 500 ATK/DEF for each Dragon monster on the field and in the GYs.";
    const effects = [
      new SummoningCondition(new EffectMainClause("Must be Special Summoned with \"The Claw of Hermos\", using a Dragon monster.")),
      new TriggerEffect([
        new EffectConditionClause("If this card is Special Summoned"),
        new EffectCostClause("Target 1 other face-up monster on the field"),
        new EffectMainClause("equip this card to it.")
      ]),
      new ContinuousEffect(new EffectMainClause("It gains 1000 ATK, and 500 ATK/DEF for each Dragon monster on the field and in the GYs."))
    ];
    testParseEffects({text}, effects);
  });

  test('Centur-Ion Primera', () => {
    const text = "While this card is a Continuous Trap, Level 5 or higher \"Centur-Ion\" monsters you control cannot be destroyed by card effects. You can only use each of the following effects of \"Centur-Ion Primera\" once per turn. If this card is Normal or Special Summoned: You can add 1 \"Centur-Ion\" card from your Deck to your hand, except \"Centur-Ion Primera\", also you cannot Special Summon \"Centur-Ion Primera\" for the rest of this turn. During the Main Phase, if this card is a Continuous Trap: You can Special Summon this card.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("While this card is a Continuous Trap, Level 5 or higher \"Centur-Ion\" monsters you control cannot be destroyed by card effects.")),
      new EffectRestriction("You can only use each of the following effects of \"Centur-Ion Primera\" once per turn."),
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 \"Centur-Ion\" card from your Deck to your hand, except \"Centur-Ion Primera\", also you cannot Special Summon \"Centur-Ion Primera\" for the rest of this turn.")
      ]),
      new QuickEffect([
        new EffectConditionClause("During the Main Phase, if this card is a Continuous Trap"),
        new EffectMainClause("You can Special Summon this card.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Mystical Space Typhoon', () => {
    const text = "Target 1 Spell/Trap on the field; destroy that target.";
    const effects = [
      new QuickEffect([
        new EffectCostClause("Target 1 Spell/Trap on the field"),
        new EffectMainClause("destroy that target.")
      ])
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true}, effects);
  });

  test('Stand Up Centur-Ion', () => {
    const text = "Cannot be destroyed by your opponent's card effects while you control a \"Centur-Ion\" Monster Card. You can only use each of the following effects of \"Stand Up Centur-Ion!\" once per turn. During your Main Phase, if this card was activated this turn: You can send 1 card from your hand to the GY; place 1 \"Centur-Ion\" monster from your Deck in your Spell & Trap Zone as a face-up Continuous Trap. If a monster(s) is Special Summoned, you can: Immediately after this effect resolves, Synchro Summon 1 Synchro Monster, using monsters you control as material, including a \"Centur-Ion\" monster.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("Cannot be destroyed by your opponent's card effects while you control a \"Centur-Ion\" Monster Card.")),
      new EffectRestriction("You can only use each of the following effects of \"Stand Up Centur-Ion!\" once per turn."),
      new IgnitionEffect([
        new EffectConditionClause("During your Main Phase, if this card was activated this turn"),
        new EffectCostClause("You can send 1 card from your hand to the GY"),
        new EffectMainClause("place 1 \"Centur-Ion\" monster from your Deck in your Spell & Trap Zone as a face-up Continuous Trap.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If a monster(s) is Special Summoned, you can"),
        new EffectMainClause("Immediately after this effect resolves, Synchro Summon 1 Synchro Monster, using monsters you control as material, including a \"Centur-Ion\" monster.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Dragonmaid Lorpar', () => {
    const text = "Cannot be destroyed by card effects while you control a Fusion Monster. You can only use each of the following effects of \"Dragonmaid Lorpar\" once per turn.\r\n● You can discard this card, then target 1 face-up monster on the field; players cannot activate that target's effects on the field this turn.\r\n● At the end of the Battle Phase: You can return this card to the hand, and if you do, Special Summon 1 Level 3 \"Dragonmaid\" monster from your hand.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("Cannot be destroyed by card effects while you control a Fusion Monster.")),
      new EffectRestriction("You can only use each of the following effects of \"Dragonmaid Lorpar\" once per turn."),
      new IgnitionEffect([
        new EffectCostClause("You can discard this card, then target 1 face-up monster on the field"),
        new EffectMainClause("players cannot activate that target's effects on the field this turn.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("At the end of the Battle Phase"),
        new EffectMainClause("You can return this card to the hand, and if you do, Special Summon 1 Level 3 \"Dragonmaid\" monster from your hand.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Gemini Lancer', () => {
    const text = "This card is treated as a Normal Monster while face-up on the field or in the Graveyard. While this card is face-up on the field, you can Normal Summon it to have it be treated as an Effect Monster with this effect:\n● During battle between this attacking card and a Defense Position monster whose DEF is lower than the ATK of this card, inflict the difference as Battle Damage to your opponent.";
    const effects = [
      new GeminiEffect([
        new ContinuousEffect(new EffectMainClause("During battle between this attacking card and a Defense Position monster whose DEF is lower than the ATK of this card, inflict the difference as Battle Damage to your opponent"))
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Dragonmaid Sheou', () => {
    const text = "During each Standby Phase: You can Special Summon 1 Level 9 or lower \"Dragonmaid\" monster from your hand or GY. When your opponent activates a card or effect (Quick Effect): You can negate the activation, and if you do, destroy that card, also, after that, return this card to the Extra Deck, and if you do, Special Summon 1 \"House Dragonmaid\" from your Extra Deck. You can only use each effect of \"Dragonmaid Sheou\" once per turn.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("During each Standby Phase"),
        new EffectMainClause("You can Special Summon 1 Level 9 or lower \"Dragonmaid\" monster from your hand or GY.")
      ]),
      new QuickEffect([
        new EffectConditionClause("When your opponent activates a card or effect (Quick Effect)"),
        new EffectMainClause("You can negate the activation, and if you do, destroy that card, also, after that, return this card to the Extra Deck, and if you do, Special Summon 1 \"House Dragonmaid\" from your Extra Deck.")
      ]),
      new EffectRestriction("You can only use each effect of \"Dragonmaid Sheou\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Odd-Eyes Pendulum Dragon', () => {
    const text = "[ Pendulum Effect ]\n" +
      "You can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0. During your End Phase: You can destroy this card, and if you do, add 1 Pendulum Monster with 1500 or less ATK from your Deck to your hand. You can only use each Pendulum Effect of \"Odd-Eyes Pendulum Dragon\" once per turn.\n" +
      "[ Monster Effect ]\n" +
      "If this card battles an opponent's monster, any battle damage this card inflicts to your opponent is doubled."
    const pendulumEffects = [
      new ContinuousEffect(new EffectMainClause("You can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0.")),
      new TriggerEffect([
        new EffectConditionClause("During your End Phase"),
        new EffectMainClause("You can destroy this card, and if you do, add 1 Pendulum Monster with 1500 or less ATK from your Deck to your hand.")
      ]),
      new EffectRestriction("You can only use each Pendulum Effect of \"Odd-Eyes Pendulum Dragon\" once per turn.")
    ];
    const monsterEffects = [
      new ContinuousEffect(new EffectMainClause("If this card battles an opponent's monster, any battle damage this card inflicts to your opponent is doubled."))
    ];
    testParsePendulumEffects({text}, pendulumEffects, monsterEffects);
  });

  test('Revolution Synchron', () => {
    const text = "If you Synchro Summon a \"Power Tool\" monster or a Level 7 or 8 Dragon monster, this card in your hand can also be used as material. You can only use this effect of \"Revolution Synchron\" once per turn. If you control a Level 7 or higher Synchro Monster while this card is in your GY: You can send the top card of your Deck to the GY, and if you do, Special Summon this card, also its Level becomes 1. You can only use this effect of \"Revolution Synchron\" once per Duel.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("If you Synchro Summon a \"Power Tool\" monster or a Level 7 or 8 Dragon monster, this card in your hand can also be used as material.")),
      new EffectRestriction("You can only use this effect of \"Revolution Synchron\" once per turn."),
      new IgnitionEffect([
        new EffectConditionClause("If you control a Level 7 or higher Synchro Monster while this card is in your GY"),
        new EffectMainClause("You can send the top card of your Deck to the GY, and if you do, Special Summon this card, also its Level becomes 1."),
      ]),
      new EffectRestriction("You can only use this effect of \"Revolution Synchron\" once per Duel."),
    ];
    testParseEffects({text}, effects);
  });

  test('ALERT!', () => {
    const text = "(This card is always treated as a \"Rescue-ACE\" card.)\n" +
      "Add 1 \"Rescue-ACE\" monster from your GY to your hand, or if you control \"Rescue-ACE Hydrant\", you can add 1 \"Rescue-ACE\" monster from your Deck to your hand instead. You can only activate 1 \"ALERT!\" per turn."
    const effects = [
      new AlwaysTreatedAs("This card is always treated as a \"Rescue-ACE\" card."),
      new QuickEffect([
        new EffectMainClause("Add 1 \"Rescue-ACE\" monster from your GY to your hand, or if you control \"Rescue-ACE Hydrant\", you can add 1 \"Rescue-ACE\" monster from your Deck to your hand instead.")
      ]),
      new EffectRestriction("You can only activate 1 \"ALERT!\" per turn."),
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Mimighoul Archfiend', () => {
    const text = "FLIP: If it is the Main Phase: Apply these effects in sequence.\n" +
      "● Your opponent draws 1 card. ● Send 1 card from your hand to the GY. ● Give control of this card to your opponent.\n" +
      "During your Main Phase: You can Special Summon this card from your hand to your opponent's field in face-down Defense Position. If this card is Normal or Special Summoned: You can change 1 face-down monster on the field to face-up Attack or Defense Position. You can only use each effect of \"Mimighoul Archfiend\" once per turn."
    const effects = [
      new FlipEffect([
        new EffectConditionClause("If it is the Main Phase"),
        new EffectMainClause("Apply these effects in sequence."),
        new SubEffectClause([new EffectMainClause("Your opponent draws 1 card.")]),
        new SubEffectClause([new EffectMainClause("Send 1 card from your hand to the GY.")]),
        new SubEffectClause([new EffectMainClause("Give control of this card to your opponent.")]),
      ]),
      new IgnitionEffect([
        new EffectConditionClause("During your Main Phase"),
        new EffectMainClause("You can Special Summon this card from your hand to your opponent's field in face-down Defense Position.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can change 1 face-down monster on the field to face-up Attack or Defense Position.")
      ]),
      new EffectRestriction("You can only use each effect of \"Mimighoul Archfiend\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Welcome Labrynth', () => {
    const text = "Special Summon 1 \"Labrynth\" monster from your Deck, also until the end of the next turn after this card resolves, you cannot Special Summon monsters from the Deck or Extra Deck, except Fiend monsters. If a monster leaves the field by your Normal Trap effect, while this card is in your GY, except the turn it was sent there: You can Set this card. You can only use each effect of \"Welcome Labrynth\" once per turn.";
    const effects = [
      new QuickEffect([new EffectMainClause("Special Summon 1 \"Labrynth\" monster from your Deck, also until the end of the next turn after this card resolves, you cannot Special Summon monsters from the Deck or Extra Deck, except Fiend monsters.")]),
      new TriggerEffect([
        new EffectConditionClause("If a monster leaves the field by your Normal Trap effect, while this card is in your GY, except the turn it was sent there"),
        new EffectMainClause("You can Set this card.")
      ]),
      new EffectRestriction("You can only use each effect of \"Welcome Labrynth\" once per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Triple Tactics Talent', () => {
    const text = "If your opponent has activated a monster effect during your Main Phase this turn: Activate 1 of these effects;\n" +
      "● Draw 2 cards.\n" +
      "● Take control of 1 monster your opponent controls until the End Phase.\n" +
      "● Look at your opponent's hand, and choose 1 card from it to shuffle into the Deck.\n" +
      "You can only activate 1 \"Triple Tactics Talent\" per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("If your opponent has activated a monster effect during your Main Phase this turn"),
        new EffectCostClause("Activate 1 of these effects"),
        new SubEffectClause([new EffectMainClause("Draw 2 cards.")]),
        new SubEffectClause([new EffectMainClause("Take control of 1 monster your opponent controls until the End Phase.")]),
        new SubEffectClause([new EffectMainClause("Look at your opponent's hand, and choose 1 card from it to shuffle into the Deck.")])
      ]),
      new EffectRestriction("You can only activate 1 \"Triple Tactics Talent\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true}, effects);
  });

  test('Starry Knight Arrival', () => {
    const text = "During the Main Phase: You can activate 1 of these effects;\n" +
      "● Target 1 Level 7 LIGHT Dragon monster you control; return it to the hand.\n" +
      "● Special Summon 1 Level 7 LIGHT Dragon monster from your hand.\n" +
      "You can only use this effect of \"Starry Knight Arrival\" once per turn.";
    const effects = [
      new QuickEffect([
        new EffectConditionClause("During the Main Phase"),
        new EffectCostClause("You can activate 1 of these effects;"),
        new SubEffectClause([
          new EffectCostClause("Target 1 Level 7 LIGHT Dragon monster you control"),
          new EffectMainClause("return it to the hand."),
        ]),
        new SubEffectClause([new EffectMainClause("Special Summon 1 Level 7 LIGHT Dragon monster from your hand.")]),
      ]),
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Paleozoic Anomalocaris', () => {
    const text = "This card is unaffected by other monsters' effects. Once per turn, if a Trap Card(s) is sent from your Spell & Trap Zone to the Graveyard (except during the Damage Step): You can excavate the top card of your Deck, and if it is a Trap Card, add it to your hand. Otherwise, send it to the Graveyard. Once per turn, during either player's turn, if this card has a Trap Card as Xyz Material: You can detach 1 Xyz Material from this card, then target 1 card on the field; destroy it.";
    const effects = [
      new ContinuousEffect(new EffectMainClause("This card is unaffected by other monsters' effects.")),
      new TriggerEffect([
        new EffectConditionClause("Once per turn, if a Trap Card(s) is sent from your Spell & Trap Zone to the Graveyard (except during the Damage Step)"),
        new EffectMainClause("You can excavate the top card of your Deck, and if it is a Trap Card, add it to your hand."),
        new EffectMainClause("Otherwise, send it to the Graveyard."),
      ]),
      new QuickEffect([
        new EffectConditionClause("Once per turn, during either player's turn, if this card has a Trap Card as Xyz Material"),
        new EffectCostClause("You can detach 1 Xyz Material from this card, then target 1 card on the field"),
        new EffectMainClause("destroy it."),
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Ash Blossom & Joyous Spring', () => {
    const text = "When a card or effect is activated that includes any of these effects (Quick Effect): You can discard this card; negate that effect.\n" +
      "● Add a card from the Deck to the hand.\n" +
      "● Special Summon from the Deck.\n" +
      "● Send a card from the Deck to the GY.\n" +
      "You can only use this effect of \"Ash Blossom & Joyous Spring\" once per turn.";
    const effects = [
      new QuickEffect([
        new EffectConditionClause("When a card or effect is activated that includes any of these effects (Quick Effect)"),
        new EffectCostClause("You can discard this card"),
        new EffectMainClause("negate that effect."),
        new SubEffectClause([new EffectMainClause("Add a card from the Deck to the hand.")]),
        new SubEffectClause([new EffectMainClause("Special Summon from the Deck.")]),
        new SubEffectClause([new EffectMainClause("Send a card from the Deck to the GY.")]),
      ]),
      new EffectRestriction("You can only use this effect of \"Ash Blossom & Joyous Spring\" once per turn."),
    ];
    testParseEffects({text}, effects);
  });
});
