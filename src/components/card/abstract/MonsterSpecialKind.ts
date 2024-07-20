export enum MonsterSpecialKind {
  FLIP = 'Flip',
  TOON = 'Toon',
  SPIRIT = 'Spirit',
  UNION = 'Union',
  GEMINI = 'Gemini',
  TUNER = 'Tuner'
}

export function getMonsterSpecialKinds(monsterType: string): MonsterSpecialKind[] {
  const monsterTypes = monsterType.toLowerCase().split(" ");
  const kinds: MonsterSpecialKind[] = [];
  if (monsterTypes.includes("flip")) {
    kinds.push(MonsterSpecialKind.FLIP);
  }
  if (monsterTypes.includes("toon")) {
    kinds.push(MonsterSpecialKind.TOON);
  }
  if (monsterTypes.includes("spirit")) {
    kinds.push(MonsterSpecialKind.SPIRIT);
  }
  if (monsterTypes.includes("union")) {
    kinds.push(MonsterSpecialKind.UNION);
  }
  if (monsterTypes.includes("gemini")) {
    kinds.push(MonsterSpecialKind.GEMINI);
  }
  if (monsterTypes.includes("tuner")) {
    kinds.push(MonsterSpecialKind.TUNER);
  }
  return kinds;
}
