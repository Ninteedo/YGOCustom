import {EffectMonster} from "./EffectMonster.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import {MonsterType, parseMonsterTypes} from "./MonsterType.ts";
import React from "react";
import {MonsterCard, MonsterCardProps} from "./MonsterCardDisplayElement.tsx";
import Effect from "../effect/Effect.tsx";
import {parseEffects} from "../effect/EffectCard.ts";
import EffectRestriction, {parseEffectRestrictions} from "../effect/EffectRestriction.tsx";

export class RegularEffectMonster extends EffectMonster {
  private readonly cardData: MonsterCardProps;

  constructor(
    art: string,
    atk: number,
    attribute: MonsterAttribute,
    categories: MonsterCategory[],
    def: number,
    effectRestrictions: EffectRestriction[],
    effects: Effect[],
    id: string,
    name: string,
    monsterTypes: MonsterType[],
    level: number,
  ) {
    super(art, attribute, categories, effectRestrictions, effects, id, level, monsterTypes, name, atk, def, "regular");

    this.cardData = {
      id: this.id,
      name: this.name,
      level: this.level,
      attribute: this.attribute,
      monsterType: this.monsterTypes,
      art: this.art,
      categories: this.categories,
      effectRestrictions: this.effectRestrictions,
      effects: this.effects,
      atk: this.atk,
      def: this.def,
    };
  }

  public static fromJson(json: any): RegularEffectMonster {
    const artSrc: string = json.art;
    const effectRestrictions: EffectRestriction[] = parseEffectRestrictions(json.effectRestrictions);
    const effects: Effect[] = parseEffects(json.effects);
    const monsterTypes: MonsterType[] = parseMonsterTypes(json.type);

    return new RegularEffectMonster(
      artSrc,
      json.atk,
      json.attribute,
      json.categories,
      json.def,
      effectRestrictions,
      effects,
      json.id,
      json.name,
      monsterTypes,
      json.level,
    );
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  public toCardDetail(): React.ReactNode {
    return MonsterCard(this.cardData, "monster", "regular");
  }

  public toCardElement(): React.ReactNode {
    return MonsterCard(this.cardData, "monster", "regular");
  }
}
