import {EffectMonster} from "../EffectMonster.ts";
import {MonsterAttribute} from "../MonsterAttribute.ts";
import {MonsterCategory} from "../MonsterCategory.ts";
import {MonsterType, monsterTypeFromString} from "../MonsterType.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffect} from "../../effect/EffectCard.ts";
import EffectRestriction from "../../effect/EffectRestriction.tsx";

export class FusionMonster extends EffectMonster implements MaterialedMonster {
  public readonly materials: string;

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
    materials: string,
    monsterTypes: MonsterType[],
    level: number,
  ) {
    super(art, attribute, categories, effectRestrictions, effects, id, level, monsterTypes, name, atk, def, "fusion");
    this.materials = materials;
  }

  public static fromJson(json: any): FusionMonster {
    const artSrc: string = json.art;
    const effectRestrictions: EffectRestriction[] = json.effectRestrictions.map((r: string) => new EffectRestriction(r));
    const effects: Effect[] = json.effects.map(parseEffect);
    const monsterTypes: MonsterType[] = json.type.map((type: string) => monsterTypeFromString(type));

    return new FusionMonster(
      artSrc,
      json.atk,
      json.attribute,
      json.categories,
      json.def,
      effectRestrictions,
      effects,
      json.id,
      json.name,
      json.materials,
      monsterTypes,
      json.level,
    );
  }
}
