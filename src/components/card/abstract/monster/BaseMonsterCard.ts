import {MonsterAttribute} from "./MonsterAttribute.ts";
import {BaseCard} from "../BaseCard.ts";
import {MonsterType} from "./MonsterType.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import {parseRegularMonster} from "./MainEffectMonster.tsx";
import {parseFusionMonster} from "./FusionMonster.tsx";

export interface BaseMonsterCard extends BaseCard {
  attribute: MonsterAttribute;
  monsterTypes: MonsterType[];
  categories: MonsterCategory[];
  atk: number;
  def: number;
}

export function parseMonsterCard(json: { kind: string }): BaseMonsterCard {
  if (json.kind === undefined || json.kind.length === 0) {
    return parseRegularMonster(json);
  }

  const monsterKind: string = json.kind.toLowerCase();
  switch (monsterKind) {
    case "regular":
      return parseRegularMonster(json);
    // case "normal":
    //   return parseNormalMonster(json);
    // case "ritual":
    //   return parseRitualMonster(json);
    case "fusion":
      return parseFusionMonster(json);
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
