import {BaseCard} from "./BaseCard.ts";
import {BaseMonsterCard} from "./monster/BaseMonsterCard.ts";
import {RegularEffectMonster} from "./monster/RegularEffectMonster.tsx";
import {FusionMonster} from "./monster/FusionMonster.tsx";

const CARD_DIR = "cards"

export async function loadCard(id: string | undefined): Promise<BaseCard | null> {
  // Load card JSON from file, then create an appropriate card object, based on the card type
  return fetch(`${CARD_DIR}/${id}.json`)
    .then((response) => response.json())
    .then((json) => {
      const cardType: string = json.cardType.toLowerCase();
      switch (cardType) {
        case "monster":
          return parseMonsterCard(json);
        // case "spell":
        //   return SpellCard.fromJson(json);
        // case "trap":
        //   return TrapCard.fromJson(json);
        default:
          throw new Error(`Unknown card type: ${cardType}`);
      }
    })
}

export function parseMonsterCard(json: { kind: string }): BaseMonsterCard {
  if (json.kind === undefined || json.kind.length === 0) {
    return RegularEffectMonster.fromJson(json);
  }

  const monsterKind: string = json.kind.toLowerCase();
  switch (monsterKind) {
    case "regular":
      return RegularEffectMonster.fromJson(json);
    // case "normal":
    //   return parseNormalMonster(json);
    // case "ritual":
    //   return parseRitualMonster(json);
    case "fusion":
      return FusionMonster.fromJson(json);
    // case "synchro":
    //   return parseSynchroMonster(json);
    // case "xyz":
    //   return parseXyzMonster(json);
    // case "link":
    //   return parseLinkMonster(json);
    // case "pendulum":
    //   return parsePendulumMonster(json);
    default:
      throw new Error(`Unknown monster kind: ${monsterKind}`);
  }
}
