import {EffectMonster} from "./EffectMonster.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import {MonsterType, monsterTypefromString} from "./MonsterType.ts";
import React from "react";
import {MonsterCard, MonsterCardProps} from "../../MonsterCard.tsx";
import Effect from "../effect/Effect.tsx";
import {parseEffect} from "../effect/EffectCard.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";

export class MainEffectMonster implements EffectMonster {
  public readonly art: string;
  public readonly atk: number;
  public readonly attribute: MonsterAttribute;
  public readonly categories: MonsterCategory[];
  public readonly def: number;
  public readonly effectRestrictions: EffectRestriction[];
  public readonly effects: Effect[];
  public readonly id: string;
  public readonly name: string;
  public readonly monsterTypes: MonsterType[];
  public readonly level: number;

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
    this.art = art;
    this.atk = atk;
    this.attribute = attribute;
    this.categories = categories;
    this.def = def;
    this.effectRestrictions = effectRestrictions;
    this.effects = effects;
    this.id = id;
    this.name = name;
    this.monsterTypes = monsterTypes;
    this.level = level;
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
    const cardData: MonsterCardProps = {
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

    return MonsterCard(cardData);
  }
}

export function parseRegularMonster(json: any): MainEffectMonster {
  const artSrc: string = "../../../public/images/" + json.art;
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
