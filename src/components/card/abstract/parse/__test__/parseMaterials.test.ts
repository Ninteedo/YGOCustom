import {describe, expect, test} from "@jest/globals";
import {readMaterialsText, readNonMaterialsText} from "../parseMaterials.ts";

interface ParseMaterialsProps {
  text: string;
  materials: string | undefined;
  nonMaterials: string;
}

describe('parseEffects of card', () => {
  function testParseMaterials({text, materials, nonMaterials}: ParseMaterialsProps): void {
    const parsedMaterials = readMaterialsText(text);
    expect(parsedMaterials).toEqual(materials);
    const parsedNonMaterials = readNonMaterialsText(text);
    expect(parsedNonMaterials).toEqual(nonMaterials);
  }

  test('Phantom of Yubel', () => {
    const text = "1 \"Yubel\" monster + 1 Fiend monster with 0 ATK/DEF\r\nMust be Special Summoned (from your Extra Deck) by shuffling the above cards from your hand, field, and/or GY into the Deck/Extra Deck. Cannot be used as Fusion Material. Cannot be destroyed by battle, also you take no damage from battles involving this card. When your opponent activates a monster effect (Quick Effect): You can Tribute this card; the activated effect becomes \"Your opponent destroys 1 \"Yubel\" monster in their hand, Deck, or field\". You can only use this effect of \"Phantom of Yubel\" once per turn.";
    const materials = "1 \"Yubel\" monster + 1 Fiend monster with 0 ATK/DEF";
    const nonMaterials = "Must be Special Summoned (from your Extra Deck) by shuffling the above cards from your hand, field, and/or GY into the Deck/Extra Deck. Cannot be used as Fusion Material. Cannot be destroyed by battle, also you take no damage from battles involving this card. When your opponent activates a monster effect (Quick Effect): You can Tribute this card; the activated effect becomes \"Your opponent destroys 1 \"Yubel\" monster in their hand, Deck, or field\". You can only use this effect of \"Phantom of Yubel\" once per turn.";
    testParseMaterials({text, materials, nonMaterials});
  });

  test('Drill Warrior', () => {
    const text = "\"Drill Synchron\" + 1 or more non-Tuner monsters\n" +
      "Once per turn, during your Main Phase 1: You can halve this card's ATK, and if you do, it can attack your opponent directly this turn. Once per turn: You can discard 1 card, and if you do, banish this card. During your next Standby Phase: Special Summon this card banished by this effect, then add 1 monster from your Graveyard to your hand.";
    const materials = "\"Drill Synchron\" + 1 or more non-Tuner monsters";
    const nonMaterials = "Once per turn, during your Main Phase 1: You can halve this card's ATK, and if you do, it can attack your opponent directly this turn. Once per turn: You can discard 1 card, and if you do, banish this card. During your next Standby Phase: Special Summon this card banished by this effect, then add 1 monster from your Graveyard to your hand.";
    testParseMaterials({text, materials, nonMaterials});
  })
});
