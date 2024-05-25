import {BaseMonsterCard} from "./BaseMonsterCard.ts";
import EffectCard from "../effect/EffectCard.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import Effect from "../effect/Effect.tsx";
import {MonsterType} from "./MonsterType.ts";
import React from "react";

export abstract class EffectMonster implements BaseMonsterCard, EffectCard {
public readonly attribute: MonsterAttribute;
  public readonly art: string;
  public readonly categories: MonsterCategory[];
  public readonly effectRestrictions: EffectRestriction[];
  public readonly effects: Effect[];
  public readonly id: string;
  public readonly level: number;
  public readonly monsterTypes: MonsterType[];
  public readonly name: string;
  public readonly atk: number;
  public readonly def: number;

  protected constructor(
    art: string,
    attribute: MonsterAttribute,
    categories: MonsterCategory[],
    effectRestrictions: EffectRestriction[],
    effects: Effect[],
    id: string,
    level: number,
    monsterTypes: MonsterType[],
    name: string,
    atk: number,
    def: number,
  ) {
    this.art = art;
    this.attribute = attribute;
    this.categories = categories;
    this.effectRestrictions = effectRestrictions;
    this.effects = effects;
    this.id = id;
    this.level = level;
    this.monsterTypes = monsterTypes;
    this.name = name;
    this.atk = atk;
    this.def = def;
  }

  abstract toCardDetail(): React.ReactNode;

  abstract toCardElement(): React.ReactNode;

}
