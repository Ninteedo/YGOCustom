import {BaseMonsterCard} from "../BaseMonsterCard.ts";
import {MonsterAttribute} from "../MonsterAttribute.ts";
import {MonsterType} from "../MonsterType.ts";
import {MonsterCategory} from "../MonsterCategory.ts";
import React from "react";

export class NormalMonster extends BaseMonsterCard {
  public readonly lore: string;
  public readonly level: number;

  constructor(
    id: string,
    name: string,
    level: number,
    attribute: MonsterAttribute,
    monsterType: MonsterType[],
    art: string,
    categories: MonsterCategory[],
    atk: number,
    def: number,
    lore: string,
  ) {
    super(art, attribute, categories, id, monsterType, name, atk, def, "normal");
    this.lore = lore;
    this.level = level;
  }

  public static fromJson(json: any): NormalMonster {
    const attribute: MonsterAttribute = json.attribute;
    const monsterType: MonsterType[] = json.type;
    const categories: MonsterCategory[] = json.categories;
    return new NormalMonster(
      json.id,
      json.name,
      json.level,
      attribute,
      monsterType,
      json.art,
      categories,
      json.atk,
      json.def,
      json.lore,
    );
  }

  toCardDetail(): React.ReactNode {
    return undefined;
  }

  toCardElement(): React.ReactNode {
    return undefined;
  }

  toText(): string {
    return JSON.stringify(this);
  }
}
