import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {CardSubKind} from "../card/abstract/CardSubKind.ts";
import {MonsterType} from "../card/abstract/monster/MonsterType.ts";

export interface SearchOption {
  label: string;
  value: string;
  category: SearchOptionCategory;
  test: (card: BaseDbCard) => boolean;
}

enum SearchOptionCategory {
  SubType = "SubType",
  Level = "Level",
  MonsterType = "MonsterType",
}

function subTypeTest(subType: CardSubKind): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.subKind === subType;
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
    value: `type-${type}`,
    category: SearchOptionCategory.MonsterType,
    test: monsterTypeTest(type),
  };
}

const levelSearchOptions: SearchOption[] = Array.from({length: 12}, (_, i) => levelSearchOption(i + 1));

const monsterTypeSearchOptions: SearchOption[] = Array.from(Object.values(MonsterType), monsterTypeSearchOption);

export const searchOptions: SearchOption[] = [
  {label: "Fusion", value: "fusion", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.FUSION)},
  {label: "Ritual", value: "ritual", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.RITUAL)},
  {label: "Synchro", value: "synchro", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.SYNCHRO)},
  {label: "Xyz", value: "xyz", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.XYZ)},
  // {label: "Pendulum", value: "pendulum", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.PENDULUM)},
  {label: "Link", value: "link", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.LINK)},
  ...levelSearchOptions,
  ...monsterTypeSearchOptions,
];
