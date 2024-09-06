export enum CardKind {
  MONSTER = 'Monster',
  SPELL = 'Spell',
  TRAP = 'Trap',
}

export const cardKindOrder = {
  [CardKind.MONSTER]: 0,
  [CardKind.SPELL]: 1,
  [CardKind.TRAP]: 2,
};

export function readCardKind(kind: string): CardKind {
  if (kind.includes("monster")) {
    return CardKind.MONSTER;
  } else if (kind.includes("spell")) {
    return CardKind.SPELL;
  } else if (kind.includes("trap")) {
    return CardKind.TRAP;
  }
  throw new Error(`Unknown card kind: ${kind}`);
}

export function isSpellTrapCard(kind: CardKind): boolean {
  return kind === CardKind.SPELL || kind === CardKind.TRAP;
}
