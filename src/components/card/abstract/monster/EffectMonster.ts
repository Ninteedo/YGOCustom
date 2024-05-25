import {BaseMonsterCard} from "./BaseMonsterCard.ts";
import EffectCard from "../effect/EffectCard.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import Effect from "../effect/Effect.tsx";
import {MonsterType} from "./MonsterType.ts";
import React from "react";

export abstract class EffectMonster extends BaseMonsterCard implements EffectCard {
  public readonly effectRestrictions: EffectRestriction[];
  public readonly effects: Effect[];
  public readonly level: number;

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
    subKind: string,
  ) {
    super(art, attribute, categories, id, monsterTypes, name, atk, def, subKind);
    this.effectRestrictions = effectRestrictions;
    this.effects = effects;
    this.level = level;
  }

  abstract toCardDetail(): React.ReactNode;

  abstract toCardElement(): React.ReactNode;

}
