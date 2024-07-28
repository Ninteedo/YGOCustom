import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {CardSubKind} from "../card/abstract/CardSubKind.ts";

export interface SearchOption {
  label: string;
  value: string;
  category: SearchOptionCategory;
  test: (card: BaseDbCard) => boolean;
}

enum SearchOptionCategory {
  SubType = "SubType",
}

function subTypeTest(subType: CardSubKind): (card: BaseDbCard) => boolean {
  return (card: BaseDbCard) => card.subKind === subType;
}

export const searchOptions: SearchOption[] = [
  {label: "Fusion", value: "fusion", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.FUSION)},
  {label: "Ritual", value: "ritual", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.RITUAL)},
  {label: "Synchro", value: "synchro", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.SYNCHRO)},
  {label: "Xyz", value: "xyz", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.XYZ)},
  // {label: "Pendulum", value: "pendulum", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.PENDULUM)},
  {label: "Link", value: "link", category: SearchOptionCategory.SubType, test: subTypeTest(CardSubKind.LINK)},
];
