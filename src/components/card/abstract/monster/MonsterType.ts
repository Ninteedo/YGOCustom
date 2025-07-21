export enum MonsterType {
  Aqua = "Aqua",
  Beast = "Beast",
  BeastWarrior = "Beast-Warrior",
  CreatorGod = "Creator God",
  Cyberse = "Cyberse",
  Dinosaur = "Dinosaur",
  DivineBeast = "Divine-Beast",
  Dragon = "Dragon",
  Fairy = "Fairy",
  Fiend = "Fiend",
  Fish = "Fish",
  Illusion = "Illusion",
  Insect = "Insect",
  Machine = "Machine",
  Plant = "Plant",
  Psychic = "Psychic",
  Pyro = "Pyro",
  Reptile = "Reptile",
  Rock = "Rock",
  SeaSerpent = "Sea Serpent",
  Spellcaster = "Spellcaster",
  Thunder = "Thunder",
  Warrior = "Warrior",
  WingedBeast = "Winged Beast",
  Wyrm = "Wyrm",
  Zombie = "Zombie",
  Unknown = "Unknown",
}

export const monsterTypeList: MonsterType[] = [
  MonsterType.Aqua,
  MonsterType.Beast,
  MonsterType.BeastWarrior,
  MonsterType.CreatorGod,
  MonsterType.Cyberse,
  MonsterType.Dinosaur,
  MonsterType.DivineBeast,
  MonsterType.Dragon,
  MonsterType.Fairy,
  MonsterType.Fiend,
  MonsterType.Fish,
  MonsterType.Illusion,
  MonsterType.Insect,
  MonsterType.Machine,
  MonsterType.Plant,
  MonsterType.Psychic,
  MonsterType.Pyro,
  MonsterType.Reptile,
  MonsterType.Rock,
  MonsterType.SeaSerpent,
  MonsterType.Spellcaster,
  MonsterType.Thunder,
  MonsterType.Warrior,
  MonsterType.WingedBeast,
  MonsterType.Wyrm,
  MonsterType.Zombie,
];

export function monsterTypeFromString(value: string): MonsterType {
  switch (value.trim()) {
    case "Aqua": return MonsterType.Aqua;
    case "Beast": return MonsterType.Beast;
    case "Beast-Warrior": return MonsterType.BeastWarrior;
    case "Creator God": return MonsterType.CreatorGod;
    case "Creator-God": return MonsterType.CreatorGod;
    case "Cyberse": return MonsterType.Cyberse;
    case "Dinosaur": return MonsterType.Dinosaur;
    case "Divine-Beast": return MonsterType.DivineBeast;
    case "Dragon": return MonsterType.Dragon;
    case "Fairy": return MonsterType.Fairy;
    case "Fiend": return MonsterType.Fiend;
    case "Fish": return MonsterType.Fish;
    case "Illusion": return MonsterType.Illusion;
    case "Insect": return MonsterType.Insect;
    case "Machine": return MonsterType.Machine;
    case "Plant": return MonsterType.Plant;
    case "Psychic": return MonsterType.Psychic;
    case "Pyro": return MonsterType.Pyro;
    case "Reptile": return MonsterType.Reptile;
    case "Rock": return MonsterType.Rock;
    case "Sea Serpent": return MonsterType.SeaSerpent;
    case "Spellcaster": return MonsterType.Spellcaster;
    case "Thunder": return MonsterType.Thunder;
    case "Warrior": return MonsterType.Warrior;
    case "Winged Beast": return MonsterType.WingedBeast;
    case "Wyrm": return MonsterType.Wyrm;
    case "Zombie": return MonsterType.Zombie;
    default: return MonsterType.Unknown;
  }
}

export function parseMonsterTypes(values: string[] | string): MonsterType[] {
  if (typeof values === "string") {
    values = values.split(",");
  }
  return values.map(monsterTypeFromString);
}
