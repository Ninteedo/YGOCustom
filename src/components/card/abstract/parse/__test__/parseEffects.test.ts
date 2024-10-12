import {describe, expect, test} from "@jest/globals";
import {parseEffects, ParseEffectsProps} from "../parseEffects";
import EffectRestriction from "../../effect/EffectRestriction.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import EffectConditionClause from "../../effect/clause/EffectConditionClause.ts";
import EffectMainClause from "../../effect/clause/EffectMainClause.tsx";
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

describe('parseEffects of card', () => {
  function testParseEffects(props: ParseEffectsProps, expectedEffects: Effect[]) {
    const effects = parseEffects(props);
    expect(effects).toStrictEqual(expectedEffects);
  }

  function testParsePendulumEffects(
    props: ParseEffectsProps,
    expectedPendulumEffects: Effect[],
    expectedMonsterEffects: Effect[]
  ) {
    const {pendulumEffects, monsterEffects} = parsePendulumText(props.text, false, false);
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
        [new EffectMainClause("Activate this card by paying 1000 LP.")]
      ),
      new ContinuousEffect(
        [new EffectMainClause("Negate the effects of all face-up monsters while they are face-up on the field (but their effects can still be activated).")],
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
      new ContinuousEffect([new EffectMainClause("Your opponent cannot target \"Purrely\" monsters you control with card effects, the turn they are Special Summoned.")]),
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
      new SummoningCondition([
        new EffectMainClause("Once per turn, you can also Xyz Summon \"Kashtira Arise-Heart\" by using 1 \"Kashtira\" monster you control, if an effect of \"Kashtira Shangri-Ira\" was successfully activated this turn. (Transfer its materials to this card.)")
      ]),
      new ContinuousEffect(
        [new EffectMainClause("Any card sent to the GY is banished instead.")]
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
      new SummoningCondition([new EffectMainClause("Cannot be Normal Summoned/Set.")]),
      new SummoningCondition([new EffectMainClause("Must first be Special Summoned (from your hand) by Tributing 1 \"Red-Eyes\" monster from your hand or field.")]),
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
      new SummoningCondition([new EffectMainClause("Must be Special Summoned with \"The Claw of Hermos\", using a Dragon monster.")]),
      new TriggerEffect([
        new EffectConditionClause("If this card is Special Summoned"),
        new EffectCostClause("Target 1 other face-up monster on the field"),
        new EffectMainClause("equip this card to it."),
        new EffectMainClause("It gains 1000 ATK, and 500 ATK/DEF for each Dragon monster on the field and in the GYs.")
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Centur-Ion Primera', () => {
    const text = "While this card is a Continuous Trap, Level 5 or higher \"Centur-Ion\" monsters you control cannot be destroyed by card effects. You can only use each of the following effects of \"Centur-Ion Primera\" once per turn. If this card is Normal or Special Summoned: You can add 1 \"Centur-Ion\" card from your Deck to your hand, except \"Centur-Ion Primera\", also you cannot Special Summon \"Centur-Ion Primera\" for the rest of this turn. During the Main Phase, if this card is a Continuous Trap: You can Special Summon this card.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("While this card is a Continuous Trap, Level 5 or higher \"Centur-Ion\" monsters you control cannot be destroyed by card effects.")]),
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
      new ContinuousEffect([new EffectMainClause("Cannot be destroyed by your opponent's card effects while you control a \"Centur-Ion\" Monster Card.")]),
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
      new ContinuousEffect([new EffectMainClause("Cannot be destroyed by card effects while you control a Fusion Monster.")]),
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
        new ContinuousEffect([new EffectMainClause("During battle between this attacking card and a Defense Position monster whose DEF is lower than the ATK of this card, inflict the difference as Battle Damage to your opponent.")])
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
      new ContinuousEffect([new EffectMainClause("You can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0.")]),
      new TriggerEffect([
        new EffectConditionClause("During your End Phase"),
        new EffectMainClause("You can destroy this card, and if you do, add 1 Pendulum Monster with 1500 or less ATK from your Deck to your hand.")
      ]),
      new EffectRestriction("You can only use each Pendulum Effect of \"Odd-Eyes Pendulum Dragon\" once per turn.")
    ];
    const monsterEffects = [
      new ContinuousEffect([new EffectMainClause("If this card battles an opponent's monster, any battle damage this card inflicts to your opponent is doubled.")])
    ];
    testParsePendulumEffects({text}, pendulumEffects, monsterEffects);
  });

  test('Revolution Synchron', () => {
    const text = "If you Synchro Summon a \"Power Tool\" monster or a Level 7 or 8 Dragon monster, this card in your hand can also be used as material. You can only use this effect of \"Revolution Synchron\" once per turn. If you control a Level 7 or higher Synchro Monster while this card is in your GY: You can send the top card of your Deck to the GY, and if you do, Special Summon this card, also its Level becomes 1. You can only use this effect of \"Revolution Synchron\" once per Duel.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("If you Synchro Summon a \"Power Tool\" monster or a Level 7 or 8 Dragon monster, this card in your hand can also be used as material.")]),
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
        new EffectCostClause("You can activate 1 of these effects"),
        new SubEffectClause([
          new EffectCostClause("Target 1 Level 7 LIGHT Dragon monster you control"),
          new EffectMainClause("return it to the hand."),
        ]),
        new SubEffectClause([new EffectMainClause("Special Summon 1 Level 7 LIGHT Dragon monster from your hand.")]),
      ]),
      new EffectRestriction("You can only use this effect of \"Starry Knight Arrival\" once per turn.")
    ];
    testParseEffects({text, isFastCard: true, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Paleozoic Anomalocaris', () => {
    const text = "This card is unaffected by other monsters' effects. Once per turn, if a Trap Card(s) is sent from your Spell & Trap Zone to the Graveyard (except during the Damage Step): You can excavate the top card of your Deck, and if it is a Trap Card, add it to your hand. Otherwise, send it to the Graveyard. Once per turn, during either player's turn, if this card has a Trap Card as Xyz Material: You can detach 1 Xyz Material from this card, then target 1 card on the field; destroy it.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("This card is unaffected by other monsters' effects.")]),
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

  test('Digital Bug Centibit', () => {
    const text = "Cannot be used as an Xyz Material for an Xyz Summon, except for the Xyz Summon of an Insect-Type monster. Once per turn, when this face-up card is changed from Attack Position to Defense Position: You can Special Summon 1 Level 3 Insect-Type monster from your Deck in Defense Position. An Xyz Monster that was Summoned using this card on the field as Xyz Material gains this effect.\n" +
      "● This card can attack all Defense Position monsters your opponent controls once each.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("Cannot be used as an Xyz Material for an Xyz Summon, except for the Xyz Summon of an Insect-Type monster.")]),
      new TriggerEffect([
        new EffectConditionClause("Once per turn, when this face-up card is changed from Attack Position to Defense Position"),
        new EffectMainClause("You can Special Summon 1 Level 3 Insect-Type monster from your Deck in Defense Position.")
      ]),
      new ContinuousEffect([
        new EffectMainClause("An Xyz Monster that was Summoned using this card on the field as Xyz Material gains this effect."),
        new SubEffectClause([
          new EffectMainClause("This card can attack all Defense Position monsters your opponent controls once each.")
        ])
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Devotee of Nephthys', () => {
    const text = "You can Ritual Summon this card with \"Rebirth of Nephthys\". You can only use each of the following effects of \"Devotee of Nephthys\" once per turn.\n" +
      "● If this card is Ritual Summoned: You can activate this effect; Special Summon 1 \"Nephthys\" monster from your Deck, also during the End Phase of this turn, destroy this card.\n" +
      "● If this card is in the GY: You can destroy 1 \"Nephthys\" card in your hand, and if you do, Special Summon this card."
    const effects = [
      new SummoningCondition([new EffectMainClause("You can Ritual Summon this card with \"Rebirth of Nephthys\".")]),
      new EffectRestriction("You can only use each of the following effects of \"Devotee of Nephthys\" once per turn."),
      new TriggerEffect([
        new EffectConditionClause("If this card is Ritual Summoned"),
        new EffectCostClause("You can activate this effect"),
        new EffectMainClause("Special Summon 1 \"Nephthys\" monster from your Deck, also during the End Phase of this turn, destroy this card.")
      ]),
      new IgnitionEffect([
        new EffectConditionClause("If this card is in the GY"),
        new EffectMainClause("You can destroy 1 \"Nephthys\" card in your hand, and if you do, Special Summon this card.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Dragonmaid Downtime', () => {
    const text = "You can target 1 \"Dragonmaid\" monster you control, then activate 1 of these effects;\n" +
      "● Return it to the hand, and if you do, add 1 \"Dragonmaid\" card from your Deck to your hand, except \"Dragonmaid Downtime\".\n" +
      "● Return it to the hand, and if you do, return 1 Spell/Trap your opponent controls to the hand.\n" +
      "You can only use this effect of \"Dragonmaid Downtime\" once per turn.";
    const effects = [
      new QuickEffect([
        new EffectCostClause("You can target 1 \"Dragonmaid\" monster you control, then activate 1 of these effects"),
        new SubEffectClause([
          new EffectMainClause("Return it to the hand, and if you do, add 1 \"Dragonmaid\" card from your Deck to your hand, except \"Dragonmaid Downtime\".")
        ]),
        new SubEffectClause([
          new EffectMainClause("Return it to the hand, and if you do, return 1 Spell/Trap your opponent controls to the hand.")
        ]),
      ]),
      new EffectRestriction("You can only use this effect of \"Dragonmaid Downtime\" once per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Angello Vaalmonica', () => {
    const pendulumText = "Each time you gain LP while you control a Fiend Monster Card in your other Pendulum Zone, place 1 Resonance Counter on this card. Once per turn, when an opponent's monster declares an attack, you can: Immediately after this effect resolves, Link Summon 1 \"Vaalmonica\" Link Monster.";
    const monsterText = "If this card is in your hand: You can discard 1 other card; take 1 \"Dimonno Vaalmonica\" from your Deck, and place this card and that card in your Pendulum Zones. During your Main Phase, if this card was Normal or Special Summoned this turn: You can banish 1 \"Vaalmonica\" Normal Spell/Trap from your GY; apply whichever effect on that card includes gaining LP. You can only use each effect of \"Angello Vaalmonica\" once per turn.";
    const expectedPendulumEffects = [
      new ContinuousEffect([new EffectMainClause("Each time you gain LP while you control a Fiend Monster Card in your other Pendulum Zone, place 1 Resonance Counter on this card.")]),
      new TriggerEffect([
        new EffectConditionClause("Once per turn, when an opponent's monster declares an attack, you can"),
        new EffectMainClause("Immediately after this effect resolves, Link Summon 1 \"Vaalmonica\" Link Monster.")
      ])
    ];
    const text = `[ Pendulum Effect ]\n${pendulumText}\n[ Monster Effect ]\n${monsterText}`;
    const expectedMonsterEffects = [
      new IgnitionEffect([
        new EffectConditionClause("If this card is in your hand"),
        new EffectCostClause("You can discard 1 other card"),
        new EffectMainClause("take 1 \"Dimonno Vaalmonica\" from your Deck, and place this card and that card in your Pendulum Zones.")
      ]),
      new IgnitionEffect([
        new EffectConditionClause("During your Main Phase, if this card was Normal or Special Summoned this turn"),
        new EffectCostClause("You can banish 1 \"Vaalmonica\" Normal Spell/Trap from your GY"),
        new EffectMainClause("apply whichever effect on that card includes gaining LP.")
      ]),
      new EffectRestriction("You can only use each effect of \"Angello Vaalmonica\" once per turn.")
    ];
    testParsePendulumEffects({text}, expectedPendulumEffects, expectedMonsterEffects);
  });

  test('Magical Musketeer Max', () => {
    const text = "If this card is Link Summoned: You can activate 1 of these effects;\n" +
      "● Add \"Magical Musket\" Spells/Traps with different names from your Deck to your hand, up to the number of monsters your opponent controls. ● Special Summon \"Magical Musket\" monsters with different names from your Deck, up to the number of Spells/Traps your opponent controls.\n" +
      "You can only use this effect of \"Magical Musketeer Max\" once per turn. During either player's turn, you can activate \"Magical Musket\" Spell/Trap Cards from your hand.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Link Summoned"),
        new EffectCostClause("You can activate 1 of these effects"),
        new SubEffectClause([
          new EffectMainClause("Add \"Magical Musket\" Spells/Traps with different names from your Deck to your hand, up to the number of monsters your opponent controls.")
        ]),
        new SubEffectClause([
          new EffectMainClause("Special Summon \"Magical Musket\" monsters with different names from your Deck, up to the number of Spells/Traps your opponent controls.")
        ]),
      ]),
      new EffectRestriction("You can only use this effect of \"Magical Musketeer Max\" once per turn."),
      new ContinuousEffect([new EffectMainClause("During either player's turn, you can activate \"Magical Musket\" Spell/Trap Cards from your hand.")])
    ];
    testParseEffects({text}, effects);
  });

  test('Arias the Labrynth Servant', () => {
    const text = "During the Main Phase (Quick Effect): You can send this card from your hand or field to the GY; Special Summon 1 \"Labrynth\" monster, or Set 1 Normal Trap, from your hand. The Set Normal Trap can be activated this turn. When your opponent activates a card or effect in response to your card or effect activation of a Normal Trap or a \"Labrynth\" card, except \"Arias the Labrynth Butler\" (Quick Effect): You can activate this effect in the GY; Special Summon this card. You can only use each effect of \"Arias the Labrynth Butler\" once per turn.";
    const effects = [
      new QuickEffect([
        new EffectConditionClause("During the Main Phase (Quick Effect)"),
        new EffectCostClause("You can send this card from your hand or field to the GY"),
        new EffectMainClause("Special Summon 1 \"Labrynth\" monster, or Set 1 Normal Trap, from your hand."),
        new EffectMainClause("The Set Normal Trap can be activated this turn.")
      ]),
      new QuickEffect([
        new EffectConditionClause("When your opponent activates a card or effect in response to your card or effect activation of a Normal Trap or a \"Labrynth\" card, except \"Arias the Labrynth Butler\" (Quick Effect)"),
        new EffectCostClause("You can activate this effect in the GY"),
        new EffectMainClause("Special Summon this card.")
      ]),
      new EffectRestriction("You can only use each effect of \"Arias the Labrynth Butler\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  // test('Arcana Force III - The Empress', () => {
  //   const text = "If this card is Summoned: Toss a coin.\n" +
  //     "● Heads: When your opponent Normal Summons/Sets a monster: You can Special Summon 1 \"Arcana Force\" monster from your hand.\n" +
  //     "● Tails: Each time your opponent Normal Summons/Sets a monster: Send 1 card from your hand to the GY.";
  //   const effects = [
  //     new TriggerEffect([
  //       new EffectConditionClause("If this card is Summoned"),
  //       new EffectMainClause("Toss a coin."),
  //       new SubEffectClause([
  //         new EffectConditionClause("Heads"),
  //         new EffectConditionClause("When your opponent Normal Summons/Sets a monster"),
  //         new EffectMainClause("You can Special Summon 1 \"Arcana Force\" monster from your hand."),
  //       ]),
  //       new SubEffectClause([
  //         new EffectConditionClause("Tails"),
  //         new EffectConditionClause("Each time your opponent Normal Summons/Sets a monster"),
  //         new EffectMainClause("Send 1 card from your hand to the GY."),
  //       ]),
  //     ]),
  //   ];
  //   testParseEffects({text}, effects);
  // });

  test('Danger! Nessie!', () => {
    const text = "You can reveal this card in your hand; your opponent randomly chooses 1 card from your entire hand, then you discard the chosen card. Then, if the discarded card was not \"Danger! Nessie!\", Special Summon 1 \"Danger! Nessie!\" from your hand, and if you do, draw 1 card. If this card is discarded: You can add 1 \"Danger!\" card from your Deck to your hand, except \"Danger! Nessie!\". You can only use this effect of \"Danger! Nessie!\" once per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectCostClause("You can reveal this card in your hand"),
        new EffectMainClause("your opponent randomly chooses 1 card from your entire hand, then you discard the chosen card."),
        new EffectMainClause("Then, if the discarded card was not \"Danger! Nessie!\", Special Summon 1 \"Danger! Nessie!\" from your hand, and if you do, draw 1 card.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If this card is discarded"),
        new EffectMainClause("You can add 1 \"Danger!\" card from your Deck to your hand, except \"Danger! Nessie!\".")
      ]),
      new EffectRestriction("You can only use this effect of \"Danger! Nessie!\" once per turn."),
    ];
    testParseEffects({text}, effects);
  });

  test('Drill Warrior', () => {
    const text = "Once per turn, during your Main Phase 1: You can halve this card's ATK, and if you do, it can attack your opponent directly this turn. Once per turn: You can discard 1 card, and if you do, banish this card. During your next Standby Phase: Special Summon this card banished by this effect, then add 1 monster from your Graveyard to your hand.";
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("Once per turn, during your Main Phase 1"),
        new EffectMainClause("You can halve this card's ATK, and if you do, it can attack your opponent directly this turn.")
      ]),
      new IgnitionEffect([
        new EffectConditionClause("Once per turn"),
        new EffectMainClause("You can discard 1 card, and if you do, banish this card.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("During your next Standby Phase"),
        new EffectMainClause("Special Summon this card banished by this effect, then add 1 monster from your Graveyard to your hand.")
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Numeron Dragon', () => {
    const text = "Once per turn: You can detach 1 material from this card; this card gains ATK equal to the combined Ranks of all Xyz Monsters currently on the field x 1000, until the end of your opponent's turn. When this card is destroyed by card effect: You can destroy as many monsters on the field as possible (min. 1), then each player Sets 1 Spell/Trap from their GY to their field. When an opponent's monster declares an attack while this card is in your GY and you have no cards in your hand or field: You can Special Summon this card."
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("Once per turn"),
        new EffectCostClause("You can detach 1 material from this card"),
        new EffectMainClause("this card gains ATK equal to the combined Ranks of all Xyz Monsters currently on the field x 1000, until the end of your opponent's turn.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("When this card is destroyed by card effect"),
        new EffectMainClause("You can destroy as many monsters on the field as possible (min. 1), then each player Sets 1 Spell/Trap from their GY to their field.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("When an opponent's monster declares an attack while this card is in your GY and you have no cards in your hand or field"),
        new EffectMainClause("You can Special Summon this card.")
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Number 97: Draglubion', () => {
    const text = "Your opponent cannot target this card with card effects. You can detach 1 material from this card; take 2 Dragon \"Number\" monsters with different names from your Extra Deck and/or GY, except \"Number 97: Draglubion\", Special Summon 1 of them and attach the other to it as material, also for the rest of this turn you cannot Special Summon other monsters, or declare an attack, except with that Special Summoned monster. You can only use this effect of \"Number 97: Draglubion\" once per turn.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("Your opponent cannot target this card with card effects.")]),
      new IgnitionEffect([
        new EffectCostClause("You can detach 1 material from this card"),
        new EffectMainClause("take 2 Dragon \"Number\" monsters with different names from your Extra Deck and/or GY, except \"Number 97: Draglubion\", Special Summon 1 of them and attach the other to it as material, also for the rest of this turn you cannot Special Summon other monsters, or declare an attack, except with that Special Summoned monster.")
      ]),
      new EffectRestriction("You can only use this effect of \"Number 97: Draglubion\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Labrynth Labyrinth', () => {
    const text = "If you activate a Set \"Welcome Labrynth\" Normal Trap, you can add this additional effect to that card's effect at resolution.\n" +
      "● Also after that, destroy 1 card on the field.\n" +
      "If you activate a non-\"Labrynth\" Normal Trap Card (except during the Damage Step): You can Special Summon 1 Fiend monster from your hand or GY. You can only use each effect of \"Labrynth Labyrinth\" once per turn.";
    const effects = [
      new ContinuousEffect([
        new EffectMainClause("If you activate a Set \"Welcome Labrynth\" Normal Trap, you can add this additional effect to that card's effect at resolution."),
        new SubEffectClause([new EffectMainClause("Also after that, destroy 1 card on the field.")])
      ]),
      new TriggerEffect([
        new EffectConditionClause("If you activate a non-\"Labrynth\" Normal Trap Card (except during the Damage Step)"),
        new EffectMainClause("You can Special Summon 1 Fiend monster from your hand or GY.")
      ]),
      new EffectRestriction("You can only use each effect of \"Labrynth Labyrinth\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Purrely Delicious Memory', () => {
    const text = "Choose 1 monster on the field, and until the end of the next turn, it cannot be destroyed by battle. After choosing a card, then you can apply the following effect.\n" +
      "● Discard 1 card, and if you do, Special Summon 1 Level 1 \"Purrely\" monster from your Deck.\n" +
      "A \"Purrely\" Xyz Monster that has this card as material gains the following effect.\n" +
      "● Gains 300 ATK/DEF for each material attached to it.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("Choose 1 monster on the field, and until the end of the next turn, it cannot be destroyed by battle."),
        new EffectMainClause("After choosing a card, then you can apply the following effect."),
        new SubEffectClause([
          new EffectMainClause("Discard 1 card, and if you do, Special Summon 1 Level 1 \"Purrely\" monster from your Deck.")
        ])
      ]),
      new ContinuousEffect([
        new EffectMainClause("A \"Purrely\" Xyz Monster that has this card as material gains the following effect."),
        new SubEffectClause([
          new EffectMainClause("Gains 300 ATK/DEF for each material attached to it.")
        ])
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Purrely Sleepy Memory', () => {
    const text = "The next battle or effect damage you take this turn will become 0. You can also immediately apply the following effect.\n" +
      "● Discard 1 card, and if you do, Special Summon 1 Level 1 \"Purrely\" monster from your Deck.\n" +
      "A \"Purrely\" Xyz Monster that has this card as material gains the following effect.\n" +
      "● Once per turn, during your opponent's Standby Phase: You can draw 1 card.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("The next battle or effect damage you take this turn will become 0."),
        new EffectMainClause("You can also immediately apply the following effect."),
        new SubEffectClause([
          new EffectMainClause("Discard 1 card, and if you do, Special Summon 1 Level 1 \"Purrely\" monster from your Deck.")
        ])
      ]),
      new ContinuousEffect([
        new EffectMainClause("A \"Purrely\" Xyz Monster that has this card as material gains the following effect."),
        new SubEffectClause([
          new EffectConditionClause("Once per turn, during your opponent's Standby Phase"),
          new EffectMainClause("You can draw 1 card.")
        ])
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Epurrely Plump', () => {
    const text = "Once per turn: You can target up to 2 Spells/Traps in the GYs; attach them to this card as material. This is a Quick Effect if this card has \"Purrely Delicious Memory\" as material. Up to thrice per turn, when you activate a \"Purrely\" Quick-Play Spell Card (Quick Effect): You can attach that card on the field to this card as material, then you can banish 1 monster on the field until the End Phase.";
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("Once per turn"),
        new EffectCostClause("You can target up to 2 Spells/Traps in the GYs"),
        new EffectMainClause("attach them to this card as material."),
        new EffectMainClause("This is a Quick Effect if this card has \"Purrely Delicious Memory\" as material.")
      ]),
      new QuickEffect([
        new EffectConditionClause("Up to thrice per turn, when you activate a \"Purrely\" Quick-Play Spell Card (Quick Effect)"),
        new EffectMainClause("You can attach that card on the field to this card as material, then you can banish 1 monster on the field until the End Phase.")
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Purrelyeap!?', () => {
    const text = "Target 1 \"Purrely\" Xyz Monster you control; Special Summon from your Extra Deck, 1 \"Purrely\" Xyz Monster with a different Rank, by using that target as material, but return it to the Extra Deck during the End Phase of the next turn. (This is treated as an Xyz Summon. Transfer its materials to the Summoned monster.) You can banish this card from your GY, then target up to 3 \"Purrely\" monsters in your GY; shuffle them into the Deck. You can only activate 1 \"Purrelyeap!?\" per turn.";
    const effects = [
      new QuickEffect([
        new EffectCostClause("Target 1 \"Purrely\" Xyz Monster you control"),
        new EffectMainClause("Special Summon from your Extra Deck, 1 \"Purrely\" Xyz Monster with a different Rank, by using that target as material, but return it to the Extra Deck during the End Phase of the next turn. (This is treated as an Xyz Summon. Transfer its materials to the Summoned monster.)"),
      ]),
      new QuickEffect([
        new EffectCostClause("You can banish this card from your GY, then target up to 3 \"Purrely\" monsters in your GY"),
        new EffectMainClause("shuffle them into the Deck.")
      ]),
      new EffectRestriction("You can only activate 1 \"Purrelyeap!?\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Mayakashi Mayhem', () => {
    const text = "If a Zombie Synchro Monster(s) is Special Summoned, except from the Extra Deck, even during the Damage Step: You can apply 1 of the following effects. You cannot apply that same effect of \"Mayakashi Mayhem\" for the rest of this turn.\n" +
      "● Draw 1 card.\n" +
      "● Set 1 \"Mayakashi\" Spell/Trap directly from your Deck, except \"Mayakashi Mayhem\".\n" +
      "● Send the 1 monster with the lowest ATK your opponent controls to the GY (your choice, if tied).\n" +
      "● Inflict 800 damage to your opponent.\n" +
      "You can only activate the effect of \"Mayakashi Mayhem\" once per Chain.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If a Zombie Synchro Monster(s) is Special Summoned, except from the Extra Deck, even during the Damage Step"),
        new EffectMainClause("You can apply 1 of the following effects."),
        new EffectMainClause("You cannot apply that same effect of \"Mayakashi Mayhem\" for the rest of this turn."),
        new SubEffectClause([new EffectMainClause("Draw 1 card.")]),
        new SubEffectClause([new EffectMainClause("Set 1 \"Mayakashi\" Spell/Trap directly from your Deck, except \"Mayakashi Mayhem\".")]),
        new SubEffectClause([new EffectMainClause("Send the 1 monster with the lowest ATK your opponent controls to the GY (your choice, if tied).")]),
        new SubEffectClause([new EffectMainClause("Inflict 800 damage to your opponent.")]),
      ]),
      new EffectRestriction("You can only activate the effect of \"Mayakashi Mayhem\" once per Chain.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Mayakashi Winter', () => {
    const text = "Monsters your opponent controls lose 100 ATK/DEF for each \"Mayakashi\" monster with a different name in your GY. You can only use 1 of the following effects of \"Mayakashi Winter\" per turn, and only once that turn.\n" +
      "● Send this card and 1 \"Mayakashi\" monster you control to the GY; draw 1 card.\n" +
      "● Banish this card and 1 Zombie monster from your GY, then target 1 \"Mayakashi\" monster in your GY; Special Summon it.";
    const effects = [
      new ContinuousEffect([new EffectMainClause("Monsters your opponent controls lose 100 ATK/DEF for each \"Mayakashi\" monster with a different name in your GY.")]),
      new EffectRestriction("You can only use 1 of the following effects of \"Mayakashi Winter\" per turn, and only once that turn."),
      new IgnitionEffect([
        new EffectCostClause("Send this card and 1 \"Mayakashi\" monster you control to the GY"),
        new EffectMainClause("draw 1 card.")
      ]),
      new IgnitionEffect([
        new EffectCostClause("Banish this card and 1 Zombie monster from your GY, then target 1 \"Mayakashi\" monster in your GY"),
        new EffectMainClause("Special Summon it.")
      ]),
    ];
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Emblema Oath', () => {
    const text = "Activate 1 of these effects;\n" +
      "● Place 1 \"Centur-Ion\" monster from your Deck in your Spell & Trap Zone as a face-up Continuous Trap. For the rest of this turn, while you control that card, or any card with that same original name, you cannot Special Summon from the Extra Deck, except \"Centur-Ion\" monsters.\n" +
      "● Set 1 \"Centur-Ion\" Spell/Trap directly from your Deck.\n" +
      "You can only activate 1 \"Emblema Oath\" per turn.";
    const effects = [
      new QuickEffect([
        new EffectCostClause("Activate 1 of these effects"),
        new SubEffectClause([
          new EffectMainClause("Place 1 \"Centur-Ion\" monster from your Deck in your Spell & Trap Zone as a face-up Continuous Trap."),
          new EffectMainClause("For the rest of this turn, while you control that card, or any card with that same original name, you cannot Special Summon from the Extra Deck, except \"Centur-Ion\" monsters.")
        ]),
        new SubEffectClause([new EffectMainClause("Set 1 \"Centur-Ion\" Spell/Trap directly from your Deck.")]),
      ]),
      new EffectRestriction("You can only activate 1 \"Emblema Oath\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Gimmick Puppet Egg Head', () => {
    const text = "You can only use the effect of \"Gimmick Puppet Egg Head\" once per turn. You can discard 1 \"Gimmick Puppet\" monster, then activate 1 of these effects;\n" +
      "● Inflict 800 damage to your opponent.\n" +
      "● This card's Level becomes 8 until the End Phase.";
    const effects = [
      new EffectRestriction("You can only use the effect of \"Gimmick Puppet Egg Head\" once per turn."),
      new IgnitionEffect([
        new EffectCostClause("You can discard 1 \"Gimmick Puppet\" monster, then activate 1 of these effects"),
        new SubEffectClause([new EffectMainClause("Inflict 800 damage to your opponent.")]),
        new SubEffectClause([new EffectMainClause("This card's Level becomes 8 until the End Phase.")]),
      ]),
    ];
    testParseEffects({text}, effects);
  });

  test('Metaphys Horus', () => {
    const text = "If this card is Synchro Summoned: You can activate the appropriate effect(s), depending on the non-Tuner monster(s) used as Synchro Material;\n" +
      "● Normal Monster: This face-up card is unaffected by other card effects this turn.\n" +
      "● Effect Monster: You can target 1 other face-up card on the field; negate that target's effects.\n" +
      "● Pendulum Monster: Your opponent chooses 1 monster they control and gives control of it to you, but it cannot attack this turn.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Synchro Summoned"),
        new EffectCostClause("You can activate the appropriate effect(s), depending on the non-Tuner monster(s) used as Synchro Material"),
        new SubEffectClause([new EffectConditionClause("Normal Monster"), new EffectMainClause("This face-up card is unaffected by other card effects this turn.")]),
        new SubEffectClause([new EffectConditionClause("Effect Monster"), new EffectCostClause("You can target 1 other face-up card on the field"), new EffectMainClause("negate that target's effects.")]),
        new SubEffectClause([new EffectConditionClause("Pendulum Monster"), new EffectMainClause("Your opponent chooses 1 monster they control and gives control of it to you, but it cannot attack this turn.")]),
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Gigantic "Champion" Sargas', () => {
    const text = "Once per turn, you can also Xyz Summon \"Gigantic \"Champion\" Sargas\" by using 1 \"Springans\" Xyz Monster you control. (Transfer its materials to this card.) While this card has material: You can add 1 \"Springans\" or \"Therion\" card from your Deck to your hand. If material is detached from a monster(s) on the field (except during the Damage Step): You can target 1 card on the field; either destroy it or return it to the hand. You can only use each effect of \"Gigantic \"Champion\" Sargas\" once per turn."
    const effects = [
      new SummoningCondition([new EffectMainClause("Once per turn, you can also Xyz Summon \"Gigantic \"Champion\" Sargas\" by using 1 \"Springans\" Xyz Monster you control. (Transfer its materials to this card.)")]),
      new IgnitionEffect([
        new EffectConditionClause("While this card has material"),
        new EffectMainClause("You can add 1 \"Springans\" or \"Therion\" card from your Deck to your hand.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If material is detached from a monster(s) on the field (except during the Damage Step)"),
        new EffectCostClause("You can target 1 card on the field"),
        new EffectMainClause("either destroy it or return it to the hand.")
      ]),
      new EffectRestriction("You can only use each effect of \"Gigantic \"Champion\" Sargas\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Arcana Force XXI - The World', () => {
    const text = "When this card is Summoned, toss a coin: ● Heads: During your End Phase, you can send 2 monsters you control to the Graveyard to skip your opponent's next turn. ● Tails: During your opponent's Draw Phase, add the top card of their Graveyard to their hand."
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("When this card is Summoned, toss a coin"),
        new SubEffectClause([
          new EffectConditionClause("Heads"),
          new EffectMainClause("During your End Phase, you can send 2 monsters you control to the Graveyard to skip your opponent's next turn.")
        ]),
        new SubEffectClause([
          new EffectConditionClause("Tails"),
          new EffectMainClause("During your opponent's Draw Phase, add the top card of their Graveyard to their hand.")
        ]),
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Arcana Force EX - The Dark Ruler', () => {
    const text = "Cannot be Normal Summoned/Set. Must be Special Summoned (from your hand) by sending 3 monsters you control to the Graveyard, and cannot be Special Summoned by other ways. When this card is Special Summoned: Toss a coin and gain the appropriate effect.\n" +
      "● Heads: This card can make a second attack during each Battle Phase, but if it does so using this effect, change it to Defense Position at the end of the Battle Phase. Its battle position cannot be changed until the end of your next turn.\n" +
      "● Tails: If this card is destroyed, destroy all cards on the field.";
    const effects = [
      new SummoningCondition([new EffectMainClause("Cannot be Normal Summoned/Set.")]),
      new SummoningCondition([new EffectMainClause("Must be Special Summoned (from your hand) by sending 3 monsters you control to the Graveyard, and cannot be Special Summoned by other ways.")]),
      new TriggerEffect([
        new EffectConditionClause("When this card is Special Summoned"),
        new EffectMainClause("Toss a coin and gain the appropriate effect."),
        new SubEffectClause([
          new EffectConditionClause("Heads"),
          new EffectMainClause("This card can make a second attack during each Battle Phase, but if it does so using this effect, change it to Defense Position at the end of the Battle Phase."),
          new EffectMainClause("Its battle position cannot be changed until the end of your next turn.")
        ]),
        new SubEffectClause([
          new EffectConditionClause("Tails"),
          new EffectMainClause("If this card is destroyed, destroy all cards on the field.")
        ]),
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Skull Guardian', () => {
    const text = "This monster can only be Ritual Summoned with the Ritual Spell Card, \"Novox's Prayer\". You must also offer monsters whose total Level Stars equal 7 or more as a Tribute from the field or your hand.";
    const effects = [
      new SummoningCondition([new EffectMainClause("This monster can only be Ritual Summoned with the Ritual Spell Card, \"Novox's Prayer\"."),
        new EffectMainClause("You must also offer monsters whose total Level Stars equal 7 or more as a Tribute from the field or your hand.")])
    ];
    testParseEffects({text}, effects);
  });

  test('Agave Dragon', () => {
    const text = "If this card is Link Summoned: You can apply these effects in sequence, depending on the Types of monsters in the GYs (skip over any that do not apply). You can only use this effect of \"Agave Dragon\" once per turn.\n" +
      "● Inflict 100 damage to your opponent for each Dragon.\n" +
      "● This card gains 200 ATK for each Dinosaur.\n" +
      "● All monsters your opponent currently controls lose 300 ATK for each Sea Serpent.\n" +
      "● You gain 400 LP for each Wyrm.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("If this card is Link Summoned"),
        new EffectMainClause("You can apply these effects in sequence, depending on the Types of monsters in the GYs (skip over any that do not apply)."),
        new SubEffectClause([new EffectMainClause("Inflict 100 damage to your opponent for each Dragon.")]),
        new SubEffectClause([new EffectMainClause("This card gains 200 ATK for each Dinosaur.")]),
        new SubEffectClause([new EffectMainClause("All monsters your opponent currently controls lose 300 ATK for each Sea Serpent.")]),
        new SubEffectClause([new EffectMainClause("You gain 400 LP for each Wyrm.")]),
      ]),
      new EffectRestriction("You can only use this effect of \"Agave Dragon\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Awakening of the Crystal Ultimates', () => {
    const text = "Reveal 1 \"Ultimate Crystal\" monster in your hand, then activate 1 of these effects. If you control an \"Ultimate Crystal\" monster, you can activate 1 or 2 of these effects in sequence, instead (and do not have to reveal a monster).\n" +
      "● Take 1 \"Rainbow Bridge\" card or 1 \"Rainbow Refraction\" from your Deck, and either add it to your hand or send it to the GY.\n" +
      "● Special Summon 1 \"Crystal Beast\" Monster Card from your hand, Deck, GY, or Spell & Trap Zone.\n" +
      "You can only activate 1 \"Awakening of the Crystal Ultimates\" per turn.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("Reveal 1 \"Ultimate Crystal\" monster in your hand, then activate 1 of these effects."),
        new EffectMainClause("If you control an \"Ultimate Crystal\" monster, you can activate 1 or 2 of these effects in sequence, instead (and do not have to reveal a monster)."),
        new SubEffectClause([new EffectMainClause("Take 1 \"Rainbow Bridge\" card or 1 \"Rainbow Refraction\" from your Deck, and either add it to your hand or send it to the GY.")]),
        new SubEffectClause([new EffectMainClause("Special Summon 1 \"Crystal Beast\" Monster Card from your hand, Deck, GY, or Spell & Trap Zone.")]),
      ]),
      new EffectRestriction("You can only activate 1 \"Awakening of the Crystal Ultimates\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Gunkan Suship Daily Special', () => {
    const text = "(When you activate this card, you can also reveal 1 \"Gunkan Suship Shari\" in your hand.) Reveal 3 \"Gunkan\" monsters from your Deck, your opponent chooses 1 of them for you to add to your hand, also shuffle the rest into your Deck. If you revealed \"Gunkan Suship Shari\" in your hand at activation, you can choose the card to add to your hand, instead of your opponent choosing. If this card is in your GY, except the turn it was sent there: You can banish this card, then target 3 \"Gunkan\" monsters in your GY; shuffle them into the Deck, then draw 1 card.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("(When you activate this card, you can also reveal 1 \"Gunkan Suship Shari\" in your hand.)"),
        new EffectMainClause("Reveal 3 \"Gunkan\" monsters from your Deck, your opponent chooses 1 of them for you to add to your hand, also shuffle the rest into your Deck."),
        new EffectMainClause("If you revealed \"Gunkan Suship Shari\" in your hand at activation, you can choose the card to add to your hand, instead of your opponent choosing.")
      ]),
      new QuickEffect([
        new EffectConditionClause("If this card is in your GY, except the turn it was sent there"),
        new EffectCostClause("You can banish this card, then target 3 \"Gunkan\" monsters in your GY"),
        new EffectMainClause("shuffle them into the Deck, then draw 1 card.")
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Traptrip Garden', () => {
    const text = "During your Main Phase, you can Normal Summon 1 \"Traptrix\" monster, in addition to your Normal Summon/Set. (You can only gain this effect once per turn.) The first time each Insect or Plant monster you control would be destroyed by battle each turn, it is not destroyed. You can banish 1 monster you control; Special Summon 1 \"Traptrix\" monster from your hand or GY. You can only use this effect of \"Traptrip Garden\" once per turn.";
    const effects = [
      new ContinuousEffect([
        new EffectMainClause("During your Main Phase, you can Normal Summon 1 \"Traptrix\" monster, in addition to your Normal Summon/Set. (You can only gain this effect once per turn.)"),
      ]),
      new ContinuousEffect([new EffectMainClause("The first time each Insect or Plant monster you control would be destroyed by battle each turn, it is not destroyed.")]),
      new IgnitionEffect([
        new EffectCostClause("You can banish 1 monster you control"),
        new EffectMainClause("Special Summon 1 \"Traptrix\" monster from your hand or GY.")
      ]),
      new EffectRestriction("You can only use this effect of \"Traptrip Garden\" once per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isContinuousSpellTrapCard: true}, effects);
  });

  test('Wynn the Wind Channeler', () => {
    const text = "(This card is always treated as a \"Charmer\" card.)\n" +
      "You can discard this card and 1 other WIND monster; add 1 WIND monster with 1500 or less DEF from your Deck to your hand, except \"Wynn the Wind Channeler\", also you cannot activate monster effects for the rest of this turn, except WIND monsters. When a WIND monster you control is destroyed by battle while this card is in your hand: You can Special Summon this card. You can only use each effect of \"Wynn the Wind Channeler\" once per turn.";
    const effects = [
      new AlwaysTreatedAs("This card is always treated as a \"Charmer\" card."),
      new IgnitionEffect([
        new EffectCostClause("You can discard this card and 1 other WIND monster"),
        new EffectMainClause("add 1 WIND monster with 1500 or less DEF from your Deck to your hand, except \"Wynn the Wind Channeler\", also you cannot activate monster effects for the rest of this turn, except WIND monsters.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("When a WIND monster you control is destroyed by battle while this card is in your hand"),
        new EffectMainClause("You can Special Summon this card.")
      ]),
      new EffectRestriction("You can only use each effect of \"Wynn the Wind Channeler\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Switch Point', () => {
    const text = "Choose 1 monster your opponent controls, and your opponent sends either of the following to the GY.\n" +
      "● The chosen monster.\n" +
      "● The other monsters they control.\n" +
      "Your opponent must control 3 or more monsters for you to activate and resolve this effect."
    const effects = [
      new QuickEffect([
        new EffectMainClause("Choose 1 monster your opponent controls, and your opponent sends either of the following to the GY."),
        new SubEffectClause([new EffectMainClause("The chosen monster.")]),
        new SubEffectClause([new EffectMainClause("The other monsters they control.")]),
        new EffectMainClause("Your opponent must control 3 or more monsters for you to activate and resolve this effect.")
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Arcana Reading', () => {
    const text = "Toss a coin and apply this effect. If \"Light Barrier\" is in your Field Zone, you can choose the effect instead.\n" +
      "● Heads: Add 1 card from your Deck to your hand that has a coin tossing effect, except \"Arcana Reading\".\n" +
      "● Tails: Your opponent adds 1 card from their Deck to their hand.\n" +
      "You can banish this card from your GY; immediately after this effect resolves, Normal Summon 1 \"Arcana Force\" monster.\n" +
      "You can only use each effect of \"Arcana Reading\" once per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectMainClause("Toss a coin and apply this effect."),
        new EffectMainClause("If \"Light Barrier\" is in your Field Zone, you can choose the effect instead."),
        new SubEffectClause([
          new EffectConditionClause("Heads"),
          new EffectMainClause("Add 1 card from your Deck to your hand that has a coin tossing effect, except \"Arcana Reading\".")
        ]),
        new SubEffectClause([
          new EffectConditionClause("Tails"),
          new EffectMainClause("Your opponent adds 1 card from their Deck to their hand.")
        ]),
      ]),
      new IgnitionEffect([
        new EffectCostClause("You can banish this card from your GY"),
        new EffectMainClause("immediately after this effect resolves, Normal Summon 1 \"Arcana Force\" monster.")
      ]),
      new EffectRestriction("You can only use each effect of \"Arcana Reading\" once per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true}, effects);
  });

  test('Dingirsu, the Orcust of the Evening Star', () => {
    const text = "You can only Special Summon \"Dingirsu, the Orcust of the Evening Star(s)\" once per turn. You can also Xyz Summon this card by using an \"Orcust\" Link Monster you control as material. If a card(s) you control would be destroyed by battle or card effect, you can detach 1 material from this card instead. If this card is Special Summoned: You can activate 1 of these effects;\n" +
      "● Send 1 card your opponent controls to the GY.\n" +
      "● Attach 1 of your banished Machine monsters to this card as material.";
    const effects = [
      new EffectRestriction("You can only Special Summon \"Dingirsu, the Orcust of the Evening Star(s)\" once per turn."),
      new SummoningCondition([new EffectMainClause("You can also Xyz Summon this card by using an \"Orcust\" Link Monster you control as material.")]),
      new ContinuousEffect([new EffectMainClause("If a card(s) you control would be destroyed by battle or card effect, you can detach 1 material from this card instead.")]),
      new TriggerEffect([
        new EffectConditionClause("If this card is Special Summoned"),
        new EffectCostClause("You can activate 1 of these effects"),
        new SubEffectClause([new EffectMainClause("Send 1 card your opponent controls to the GY.")]),
        new SubEffectClause([new EffectMainClause("Attach 1 of your banished Machine monsters to this card as material.")]),
      ])
    ];
    testParseEffects({text}, effects);
  });

  test('Gold Pride - Captain Carrie', () => {
    const text = "If your LP are lower than your opponent's: You can Special Summon this card from your hand. If this card is Normal or Special Summoned: You can add 1 \"Gold Pride\" Trap from your Deck to your hand. If this card is sent to the GY: You can target 1 \"Gold Pride\" monster you control that was Special Summoned from the Extra Deck; banish up to 3 \"Gold Pride\" cards from your GY, and if you do, that monster gains 500 ATK for each card banished this way. You can only use each effect of \"Gold Pride - Captain Carrie\" once per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("If your LP are lower than your opponent's"),
        new EffectMainClause("You can Special Summon this card from your hand.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If this card is Normal or Special Summoned"),
        new EffectMainClause("You can add 1 \"Gold Pride\" Trap from your Deck to your hand.")
      ]),
      new TriggerEffect([
        new EffectConditionClause("If this card is sent to the GY"),
        new EffectCostClause("You can target 1 \"Gold Pride\" monster you control that was Special Summoned from the Extra Deck"),
        new EffectMainClause("banish up to 3 \"Gold Pride\" cards from your GY, and if you do, that monster gains 500 ATK for each card banished this way.")
      ]),
      new EffectRestriction("You can only use each effect of \"Gold Pride - Captain Carrie\" once per turn.")
    ];
    testParseEffects({text}, effects);
  });

  test('Vaalmonica Scelta', () => {
    const text = "Apply 1 of these effects. Unless you have a \"Vaalmonica\" card in your Pendulum Zone, your opponent chooses the effect.\n" +
      "● Gain 500 LP, then you can place 1 card from your hand on the bottom of the Deck, then draw 2 cards.\n" +
      "● Take 500 damage, then you can add 1 \"Vaalmonica\" Spell/Trap from your Deck to your hand, except \"Vaalmonica Scelta\".\n" +
      "You can only activate 1 \"Vaalmonica Scelta\" per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectMainClause("Apply 1 of these effects."),
        new EffectMainClause("Unless you have a \"Vaalmonica\" card in your Pendulum Zone, your opponent chooses the effect."),
        new SubEffectClause([
          new EffectMainClause("Gain 500 LP, then you can place 1 card from your hand on the bottom of the Deck, then draw 2 cards.")
        ]),
        new SubEffectClause([
          new EffectMainClause("Take 500 damage, then you can add 1 \"Vaalmonica\" Spell/Trap from your Deck to your hand, except \"Vaalmonica Scelta\".")
        ]),
      ]),
      new EffectRestriction("You can only activate 1 \"Vaalmonica Scelta\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true}, effects);
  });

  test('Blaze Cannon', () => {
    const text = "(This card is also always treated as a \"Blaze Accelerator\" card.)\n" +
      "One \"The Winged Dragon of Ra\" you control gains the following effects until the end of this turn. This card's activation and effect cannot be negated.\n" +
      "● This card is unaffected by your opponent's card effects.\n" +
      "● When an attack is declared involving this card: You can Tribute any number of other monsters that did not declare an attack this turn; this card gains ATK equal to the Tributed monsters' combined original ATK, until the end of this turn.\n" +
      "● After damage calculation, if this card attacked: You can send all monsters your opponent controls to the GY.";
    const effects = [
      new AlwaysTreatedAs("This card is also always treated as a \"Blaze Accelerator\" card."),
      new QuickEffect([
        new EffectMainClause("One \"The Winged Dragon of Ra\" you control gains the following effects until the end of this turn."),
        new EffectMainClause("This card's activation and effect cannot be negated."),
        new SubEffectClause([new EffectMainClause("This card is unaffected by your opponent's card effects.")]),
        new SubEffectClause([
          new EffectConditionClause("When an attack is declared involving this card"),
          new EffectCostClause("You can Tribute any number of other monsters that did not declare an attack this turn"),
          new EffectMainClause("this card gains ATK equal to the Tributed monsters' combined original ATK, until the end of this turn.")
        ]),
        new SubEffectClause([
          new EffectConditionClause("After damage calculation, if this card attacked"),
          new EffectMainClause("You can send all monsters your opponent controls to the GY.")
        ]),
      ])
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Vaalmonica Chosen Melody', () => {
    const text = "Apply 1 of these effects. You must control a \"Vaalmonica\" Monster Card to activate and to resolve this effect. If you control a \"Vaalmonica\" Link Monster, you can apply both effects in sequence.\n" +
      "● Gain 500 LP, also for the rest of this turn, your opponent cannot target \"Vaalmonica\" Monster Cards you control with card effects.\n" +
      "● Take 500 damage, then you can negate the effects of 1 Effect Monster your opponent controls, until the end of this turn.\n" +
      "You can only activate 1 \"Vaalmonica Chosen Melody\" per turn.";
    const effects = [
      new QuickEffect([
        new EffectMainClause("Apply 1 of these effects."),
        new EffectMainClause("You must control a \"Vaalmonica\" Monster Card to activate and to resolve this effect."),
        new EffectMainClause("If you control a \"Vaalmonica\" Link Monster, you can apply both effects in sequence."),
        new SubEffectClause([
          new EffectMainClause("Gain 500 LP, also for the rest of this turn, your opponent cannot target \"Vaalmonica\" Monster Cards you control with card effects.")
        ]),
        new SubEffectClause([
          new EffectMainClause("Take 500 damage, then you can negate the effects of 1 Effect Monster your opponent controls, until the end of this turn.")
        ])
      ]),
      new EffectRestriction("You can only activate 1 \"Vaalmonica Chosen Melody\" per turn.")
    ];
    testParseEffects({text, isSpellTrapCard: true, isFastCard: true}, effects);
  });

  test('Coordius the Triphasic Dealmon', () => {
    const text = "Once while this Fusion Summoned card is face-up on the field: You can pay LP in multiples of 2000 and choose 1 effect for every 2000 LP paid (you can only apply each effect once, and you resolve them in the listed order, skipping any that were not chosen); ● Add 1 Spell/Trap from your GY to your hand. ● Destroy 3 cards your opponent controls. ● This turn, this card gains ATK equal to half of the difference between your LP and your opponent's, also your other monsters cannot attack.\n" +
      "You can only use this effect of \"Coordius the Triphasic Dealmon\" once per turn.";
    const effects = [
      new IgnitionEffect([
        new EffectConditionClause("Once while this Fusion Summoned card is face-up on the field"),
        new EffectCostClause("You can pay LP in multiples of 2000 and choose 1 effect for every 2000 LP paid (you can only apply each effect once, and you resolve them in the listed order, skipping any that were not chosen)"),
        new SubEffectClause([new EffectMainClause("Add 1 Spell/Trap from your GY to your hand.")]),
        new SubEffectClause([new EffectMainClause("Destroy 3 cards your opponent controls.")]),
        new SubEffectClause([new EffectMainClause("This turn, this card gains ATK equal to half of the difference between your LP and your opponent's, also your other monsters cannot attack.")]),
      ]),
      new EffectRestriction("You can only use this effect of \"Coordius the Triphasic Dealmon\" once per turn.")
    ];

    testParseEffects({text}, effects);
  });

  test('Number C69: Heraldry Crest of Horror', () => {
    const text = "When an opponent's monster declares an attack: You can destroy all cards your opponent controls. If this card has \"Number 69: Heraldry Crest\" as an Xyz Material, it gains this effect.\n" +
      "● Once per turn: You can detach 1 Xyz Material from this card, then target 1 face-up Xyz Monster your opponent controls; this card gains ATK equal to that face-up monster's original ATK, and if it gains ATK this way, this card's name becomes that monster's, and it gains that monster's original effect. These effects last until the End Phase.";
    const effects = [
      new TriggerEffect([
        new EffectConditionClause("When an opponent's monster declares an attack"),
        new EffectMainClause("You can destroy all cards your opponent controls."),
      ]),
      new ContinuousEffect([
        new EffectMainClause("If this card has \"Number 69: Heraldry Crest\" as an Xyz Material, it gains this effect."),
        new SubEffectClause([
          new EffectConditionClause("Once per turn"),
          new EffectCostClause("You can detach 1 Xyz Material from this card, then target 1 face-up Xyz Monster your opponent controls"),
          new EffectMainClause("this card gains ATK equal to that face-up monster's original ATK, and if it gains ATK this way, this card's name becomes that monster's, and it gains that monster's original effect."),
          new EffectMainClause("These effects last until the End Phase.")
        ])
      ])
    ];

    testParseEffects({text}, effects);
  });

  test('Ghost Bird of Bewitchment', () => {
    const text = "This card gains an effect based on your Main Monster Zone it is in.\n" +
      "● Leftmost: Gains 1000 ATK/DEF.\n" +
      "● Rightmost: Can make up to 2 attacks on monsters during each Battle Phase.\n" +
      "● Center: Your opponent cannot target this card with card effects, also it cannot be destroyed by your opponent's card effects.\n" +
      "● Others: Monsters in this column cannot activate their effects.";
    const effects = [
      new ContinuousEffect([
        new EffectMainClause("This card gains an effect based on your Main Monster Zone it is in."),
        new SubEffectClause([new EffectConditionClause("Leftmost"), new EffectMainClause("Gains 1000 ATK/DEF.")]),
        new SubEffectClause([new EffectConditionClause("Rightmost"), new EffectMainClause("Can make up to 2 attacks on monsters during each Battle Phase.")]),
        new SubEffectClause([new EffectConditionClause("Center"), new EffectMainClause("Your opponent cannot target this card with card effects, also it cannot be destroyed by your opponent's card effects.")]),
        new SubEffectClause([new EffectConditionClause("Others"), new EffectMainClause("Monsters in this column cannot activate their effects.")]),
      ]),
    ];
    testParseEffects({text}, effects);
  });
});
