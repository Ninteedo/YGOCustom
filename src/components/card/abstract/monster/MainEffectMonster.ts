import {EffectMonster} from "./EffectMonster.ts";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import {MonsterType} from "./MonsterType.ts";

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
  public readonly type: MonsterType[];
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
    type: MonsterType[],
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
    this.type = type;
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
}

export function parseRegularMonster(json: any): MainEffectMonster {
  return new MainEffectMonster(
    json.art,
    json.atk,
    json.attribute,
    json.categories,
    json.def,
    json.effectRestrictions,
    json.effects,
    json.id,
    json.name,
    json.type,
    json.level,
  );
}
