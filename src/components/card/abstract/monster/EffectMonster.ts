import {BaseMonsterCard} from "./BaseMonsterCard.ts";
import EffectCard from "../effect/EffectCard.ts";
import {CardAttribute} from "./CardAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import Effect from "../effect/Effect.tsx";
import {MonsterType} from "./MonsterType.ts";
import React from "react";
import {MonsterCard, MonsterCardProps} from "../display/MonsterCardDisplayElement.tsx";
import {CardSubKind} from "../CardSubKind.ts";

export abstract class EffectMonster extends BaseMonsterCard implements EffectCard {
  public readonly effectRestrictions: EffectRestriction[];
  public readonly effects: Effect[];
  public readonly level: number;

  private cardData: MonsterCardProps;

  protected constructor(
    art: string,
    attribute: CardAttribute,
    categories: MonsterCategory[],
    effectRestrictions: EffectRestriction[],
    effects: Effect[],
    id: string,
    level: number,
    monsterTypes: MonsterType[],
    name: string,
    atk: number,
    def: number,
    subKind: CardSubKind,
  ) {
    super(art, attribute, categories, id, monsterTypes, name, atk, def, subKind);
    this.effectRestrictions = effectRestrictions;
    this.effects = effects;
    this.level = level;

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

  protected addMaterials(materials: string): void {
    this.cardData.materials = materials;
  }

  public toCardDetail(): React.ReactNode {
    return MonsterCard(this.cardData, this.kind, this.subKind);
  }

  public toCardElement(): React.ReactNode {
    return MonsterCard(this.cardData, this.kind, this.subKind);
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  public toText(): string {
    return toString();
  }
}
