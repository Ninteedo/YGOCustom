import {EffectMonster} from "./EffectMonster.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import {MonsterType, monsterTypefromString} from "./MonsterType.ts";
import React from "react";
import {MonsterCard, MonsterCardProps} from "./MonsterCardShared.tsx";
import Effect from "../effect/Effect.tsx";
import {parseEffect} from "../effect/EffectCard.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";

export class MainEffectMonster extends EffectMonster {

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
    super(art, attribute, categories, effectRestrictions, effects, id, level, monsterTypes, name, atk, def);

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

  public static fromJson(json: string): MainEffectMonster {
    const obj = JSON.parse(json);
    return new MainEffectMonster(
      obj.art,
      obj.atk,
      obj.attribute,
      obj.categories,
      obj.def,
      obj.effectRestrictions,
      obj.effects,
      obj.id,
      obj.name,
      obj.type,
      obj.level,
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

export function parseRegularMonster(json: any): MainEffectMonster {
  const artSrc: string = json.art;
  const effectRestrictions: EffectRestriction[] = json.effectRestrictions.map((r: string) => new EffectRestriction(r));
  const effects: Effect[] = json.effects.map(parseEffect);
  const monsterTypes: MonsterType[] = json.type.map((type: string) => monsterTypefromString(type));

  return new MainEffectMonster(
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
