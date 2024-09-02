import BaseDbCard from "../card/abstract/BaseDbCard.tsx";

export interface SearchSort {
  label: string;
  value: string;
  sort: (a: BaseDbCard, b: BaseDbCard) => number;
}

export const searchSorts: SearchSort[] = [
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
  {
    label: "Card Kind",
    value: "kind",
    sort: cardKindSort,
  },
];

function inverseSort(sort: (a: BaseDbCard, b: BaseDbCard) => number): (a: BaseDbCard, b: BaseDbCard) => number {
  return (a, b) => -sort(a, b);
}

function nameSort(a: BaseDbCard, b: BaseDbCard): number {
  return a.name.localeCompare(b.name);
}

function cardKindSort(a: BaseDbCard, b: BaseDbCard): number {
  function getKind(card: BaseDbCard): string {
    return card.kind + " " + card.subKind;
  }

  return getKind(a).localeCompare(getKind(b));
}
