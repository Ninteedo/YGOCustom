import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {CardSubKind, isExtraDeck} from "../card/abstract/CardSubKind.ts";
import {MonsterType} from "../card/abstract/monster/MonsterType.ts";
import {MONSTER_ATTRIBUTES} from "../card/abstract/monster/CardAttribute.tsx";
import {CardKind} from "../card/abstract/CardKind.ts";
import {MonsterSpecialKind} from "../card/abstract/MonsterSpecialKind.ts";

export interface SearchOption {
  label: string;
  value: string;
  category: SearchOptionCategory;
  test: (card: BaseDbCard) => boolean;
}

export enum SearchOptionCategory {
  CardKind = "CardKind",
  SubType = "SubType",
  Level = "Level",
  MonsterType = "MonsterType",
  Attribute = "Attribute",
  MonsterSpecial = "MonsterSpecial",
  Pendulum = "Pendulum",
}

function cardKindTest(kind: string): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.kind === kind;
}

function cardKindSearchOption(kind: string): SearchOption {
  return {
    label: kind,
    value: `kind-${kind.toLowerCase()}`,
    category: SearchOptionCategory.CardKind,
    test: cardKindTest(kind),
  };
}

function subKindTest(subKind: CardSubKind): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.subKind === subKind;
}

function subKindSearchOption(subKind: CardSubKind): SearchOption {
  return {
    label: subKind,
    value: `subkind-${subKind.toLowerCase()}`,
    category: SearchOptionCategory.SubType,
    test: subKindTest(subKind),
  };
}

function mainDeckSearchOption(): SearchOption {
  return {
    label: "Main Deck",
    value: "subkind-main-deck",
    category: SearchOptionCategory.SubType,
    test: card => !isExtraDeck(card.subKind),
  }
}

function extraDeckSearchOption(): SearchOption {
  return {
    label: "Extra Deck",
    value: "subkind-extra-deck",
    category: SearchOptionCategory.SubType,
    test: card => isExtraDeck(card.subKind),
  }
}

function levelTest(level: number): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.getAnyLevelNumber() === level;
}

function levelSearchOption(level: number): SearchOption {
  return {
    label: `Level/Rank/Link-${level}`,
    value: `level-${level}`,
    category: SearchOptionCategory.Level,
    test: levelTest(level),
  };
}

function monsterTypeTest(type: MonsterType): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.getMonsterType() === type;
}

function monsterTypeSearchOption(type: MonsterType): SearchOption {
  return {
    label: type,
    value: `type-${type.toLowerCase()}`,
    category: SearchOptionCategory.MonsterType,
    test: monsterTypeTest(type),
  };
}

function cardAttributeTest(attribute: string): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.getAttribute() === attribute;
}

function cardAttributeSearchOption(attribute: string): SearchOption {
  return {
    label: attribute,
    value: `attribute-${attribute.toLowerCase()}`,
    category: SearchOptionCategory.Attribute,
    test: cardAttributeTest(attribute),
  };
}

function pendulumTest(card: BaseDbCard): boolean {
  return card.isPendulum;
}

function pendulumSearchOption(): SearchOption {
  return {
    label: "Pendulum",
    value: "pendulum",
    category: SearchOptionCategory.Pendulum,
    test: pendulumTest,
  };
}

function monsterSpecialKindTest(specialKind: MonsterSpecialKind): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => !!card.json.monsterTypeLine?.includes(specialKind);
}

function monsterSpecialKindSearchOption(specialKind: MonsterSpecialKind): SearchOption {
  return {
    label: specialKind,
    value: `special-${specialKind.toLowerCase()}`,
    category: SearchOptionCategory.MonsterSpecial,
    test: monsterSpecialKindTest(specialKind),
  };
}

const cardKindSearchOptions: SearchOption[] = Array.from(Object.values(CardKind), cardKindSearchOption);

const subKindSearchOptions: SearchOption[] = Array.from(Object.values(CardSubKind), subKindSearchOption);

const levelSearchOptions: SearchOption[] = Array.from({length: 12}, (_, i) => levelSearchOption(i + 1));

const monsterTypeSearchOptions: SearchOption[] = Array.from(Object.values(MonsterType), monsterTypeSearchOption);

const attributeSearchOptions: SearchOption[] = Array.from(Object.values(MONSTER_ATTRIBUTES), cardAttributeSearchOption);

const monsterSpecialSearchOptions: SearchOption[] = Array.from(Object.values(MonsterSpecialKind), monsterSpecialKindSearchOption);

export const searchOptions: SearchOption[] = [
  ...cardKindSearchOptions,
  ...subKindSearchOptions,
  mainDeckSearchOption(),
  extraDeckSearchOption(),
  pendulumSearchOption(),
  ...levelSearchOptions,
  ...monsterTypeSearchOptions,
  ...attributeSearchOptions,
  ...monsterSpecialSearchOptions,
];
