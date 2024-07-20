import {EffectMonster} from "../EffectMonster.ts";
import {MonsterAttribute} from "../MonsterAttribute.ts";
import {MonsterCategory} from "../MonsterCategory.ts";
import {MonsterType, parseMonsterTypes} from "../MonsterType.ts";
import Effect from "../../effect/Effect.tsx";
import {parseEffects} from "../../effect/EffectCard.ts";
import EffectRestriction, {parseEffectRestrictions} from "../../effect/EffectRestriction.tsx";
import {CardSubKind} from "../../CardSubKind.ts";

export class RegularEffectMonster extends EffectMonster {
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
    super(art, attribute, categories, effectRestrictions, effects, id, level, monsterTypes, name, atk, def, CardSubKind.EFFECT);
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
}
