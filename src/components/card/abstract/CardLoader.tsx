import {BaseCard} from "./BaseCard.ts";
import {BaseMonsterCard} from "./monster/BaseMonsterCard.ts";
import {RegularEffectMonster} from "./monster/subkinds/RegularEffectMonster.tsx";
import {FusionMonster} from "./monster/subkinds/FusionMonster.tsx";
import YAML from "yaml";
import {SynchroMonster} from "./monster/subkinds/SynchroMonster.tsx";
import {NormalMonster} from "./monster/subkinds/NormalMonster.tsx";
import {RitualMonster} from "./monster/subkinds/RitualMonster.tsx";

const CARD_DIR = "cards"

export async function loadCard(id: string | undefined): Promise<BaseCard | null> {
  // Load card JSON from file, then create an appropriate card object, based on the card type
  return fetch(`${CARD_DIR}/${id}.yaml`)
    .then((response) => response.text())
    .then((response) => YAML.parse(response))
    .then((yaml) => {
      const cardType: string = yaml.cardType.toLowerCase();
      switch (cardType) {
        case "monster":
          return parseMonsterCard(yaml);
        // case "spell":
        //   return SpellCard.fromJson(json);
        // case "trap":
        //   return TrapCard.fromJson(json);
        default:
          throw new Error(`Unknown card type: ${cardType}`);
      }
    })
}

function parseMonsterCard(json: { kind: string }): BaseMonsterCard {
  if (json.kind === undefined || json.kind.length === 0) {
    return RegularEffectMonster.fromJson(json);
  }

  const monsterKind: string = json.kind.toLowerCase();
  switch (monsterKind) {
    case "regular":
      return RegularEffectMonster.fromJson(json);
    case "normal":
      return NormalMonster.fromJson(json);
    case "ritual":
      return RitualMonster.fromJson(json);
    case "fusion":
      return FusionMonster.fromJson(json);
    case "synchro":
      return SynchroMonster.fromJson(json);
    // case "xyz":
    //   return parseXyzMonster(json);
    // case "link":
    //   return parseLinkMonster(json);
    default:
      throw new Error(`Unknown monster kind: ${monsterKind}`);
  }
}
