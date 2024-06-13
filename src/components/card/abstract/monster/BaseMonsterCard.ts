import {MonsterAttribute} from "./MonsterAttribute.ts";
import {BaseCard} from "../BaseCard.ts";
import {MonsterType} from "./MonsterType.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import React from "react";

export abstract class BaseMonsterCard extends BaseCard {
  public readonly attribute: MonsterAttribute;
  public readonly categories: MonsterCategory[];
  public readonly monsterTypes: MonsterType[];
  public readonly atk: number;
  public readonly def: number;

  protected constructor(
    art: string,
    attribute: MonsterAttribute,
    categories: MonsterCategory[],
    id: string,
    monsterTypes: MonsterType[],
    name: string,
    atk: number,
    def: number,
    subKind: string,
  ) {
    super(id, name, art, "monster", subKind);
    this.attribute = attribute;
    this.categories = categories;
    this.monsterTypes = monsterTypes;
    this.atk = atk;
    this.def = def;
  }

  abstract toCardDetail(): React.ReactNode;

  abstract toCardElement(): React.ReactNode;

  getLinkUrl(): string {
    return `/card/custom/${this.id}`;
  }
}
