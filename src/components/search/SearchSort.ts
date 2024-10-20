import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {cardKindOrder} from "../card/abstract/CardKind.ts";
import {cardSubKindOrder} from "../card/abstract/CardSubKind.ts";

export interface SearchSort {
  label: string;
  value: string;
  sort: (a: BaseDbCard, b: BaseDbCard) => number;
}

export const searchSorts: SearchSort[] = [
  {
    label: "Card Kind",
    value: "kind",
    sort: cardKindSort,
  },
  {
    label: "Name A-Z",
    value: "nameasc",
    sort: nameSort,
  },
  {
    label: "Name Z-A",
    value: "namedesc",
    sort: inverseSort(nameSort),
  },
];

function inverseSort(sort: (a: BaseDbCard, b: BaseDbCard) => number): (a: BaseDbCard, b: BaseDbCard) => number {
  return (a, b) => -sort(a, b);
}

function nameSort(a: BaseDbCard, b: BaseDbCard): number {
  return a.name.localeCompare(b.name);
}

function cardKindSort(a: BaseDbCard, b: BaseDbCard): number {
  const kindOrderDiff = cardKindOrder[a.kind] - cardKindOrder[b.kind];
  if (kindOrderDiff !== 0) {
    return kindOrderDiff;
  }
  return cardSubKindOrder[a.subKind] - cardSubKindOrder[b.subKind];
}
