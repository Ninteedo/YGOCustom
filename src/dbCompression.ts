const mappings: [string, string][] = [
  ["atk", "a"],
  ["attribute", "b"],
  ["def", "d"],
  ["forbidden", "g"],
  ["frameType", "f"],
  ["archetype", "h"],
  ["id", "i"],
  ["level", "l"],
  ["name", "n"],
  ["race", "r"],
  ["desc", "t"],
  ["imageId", "u"],
  ["linkval", "v"],
  ["type", "y"],
  // ["card_sets", "s"],
];
// const ignoredEntries: string[] = [
//   "ygoprodeck_url",
//   "card_images",
//   "card_prices",
// ];

export function compressDbCardJson(cardJson: Object): any {
  return new CardJsonEntry(cardJson, false).toCompressed();
}

export function decompressDbCardJson(compressedCardJson: Object): any {
  return new CardJsonEntry(compressedCardJson, true);
}

export class CardJsonEntry {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly frameType: string;
  public readonly desc: string;
  public readonly atk: string | undefined;
  public readonly def: string | undefined;
  public readonly race: string | undefined;
  public readonly attribute: string | undefined;
  public readonly archetype: string | undefined;
  public readonly imageId: string;
  public readonly level: string | undefined;
  public readonly linkval: string | undefined;
  public readonly forbidden: string | undefined;
  // public readonly cardSets: CardSet[];

  constructor(json: any, isCompressed: boolean) {
    this.id = getMapping(json, "id", isCompressed);
    this.name = getMapping(json, "name", isCompressed);
    this.type = getMapping(json, "type", isCompressed);
    this.desc = getMapping(json, "desc", isCompressed);
    this.atk = getMappingSafe(json, "atk", isCompressed);
    this.def = getMappingSafe(json, "def", isCompressed);
    this.archetype = getMappingSafe(json, "archetype", isCompressed);
    this.level = getMappingSafe(json, "level", isCompressed);
    this.linkval = getMappingSafe(json, "linkval", isCompressed);
    this.forbidden = getMappingSafe(json, "forbidden", isCompressed);

    if (isCompressed) {
      this.imageId = getMapping(json, "imageId", isCompressed);
      const raceNumberString = getMappingSafe(json, "race", isCompressed);
      if (raceNumberString !== undefined) {
        this.race = raceNumberToName(parseInt(raceNumberString));
      }
      const attributeNumberString = getMappingSafe(json, "attribute", isCompressed);
      if (attributeNumberString !== undefined) {
        this.attribute = attributeNumberToName(parseInt(attributeNumberString));
      }
      const frameTypeNumberString = getMappingSafe(json, "frameType", isCompressed);
      if (frameTypeNumberString !== undefined) {
        this.frameType = frameTypeNumberToName(parseInt(frameTypeNumberString));
      } else {
        throw new Error("frameType not found");
      }
      const typeShort = getMapping(json, "type", isCompressed);
      this.type = shortToType(typeShort);
    } else {
      this.imageId = json["card_images"][0]["id"];
      this.race = getMappingSafe(json, "race", isCompressed);
      this.attribute = getMappingSafe(json, "attribute", isCompressed);
      this.frameType = getMapping(json, "frameType", isCompressed);
      this.type = getMapping(json, "type", isCompressed);

      if (json["banlist_info"]) {
        const banlistInfo = json["banlist_info"];
        const tcg = banlistInfo["ban_tcg"];
        const ocg = banlistInfo["ban_ocg"];
        this.forbidden = getForbiddenValue(tcg, ocg);
      } else {
        this.forbidden = undefined;
      }
    }
    // this.cardSets = (json[getMapping("card_sets", isCompressed)]; as Object[]).map(setJson => new CardSet(setJson));
  }

  public toCompressed(): any {
    const compressed: any = {};

    for (const [key, compressedKey] of mappings) {
      // @ts-ignore
      compressed[compressedKey] = this[key];
    }

    compressed[frameTypeKeyShort] = frameTypeNameToNumber(this.frameType);
    compressed[typeKeyShort] = typeToShort(this.type);
    if (this.race) {
      compressed[raceKeyShort] = raceNameToNumber(this.race);
    }
    if (this.attribute) {
      compressed[attributeKeyShort] = attributeNameToNumber(this.attribute);
    }

    return compressed;
  }
}

function getShortKey(key: string): string {
  const found = mappings.find(([originalKey, _]) => originalKey === key);
  if (found) {
    return found[1];
  }
  throw new Error(`No mapping found for key ${key}`);
}

function getMapping(json: any, key: string, isCompressed: boolean): string {
  const found = mappings.find(([originalKey, _]) => originalKey === key)
  if (found) {
    const properKey = found[isCompressed ? 1 : 0];
    if (json[properKey]) {
      return json[properKey];
    }
  }
  throw new Error(`No mapping found for key ${key}`);
}

function getMappingSafe(json: any, key: string, isCompressed: boolean): string | undefined {
  const found = mappings.find(([originalKey, _]) => originalKey === key)
  if (found) {
    const properKey = found[isCompressed ? 1 : 0];
    if (json[properKey]) {
      return json[properKey];
    }
  }
  return undefined;
}

const raceMappings: [string, number][] = [
  ["Normal", 7],
  ["Quick-Play", 1],
  ["Continuous", 2],
  ["Counter", 3],
  ["Ritual", 4],
  ["Equip", 5],
  ["Field", 6],
  ["Pyro", 8],
  ["Rock", 9],
  ["Winged Beast", 10],
  ["Plant", 11],
  ["Insect", 12],
  ["Thunder", 13],
  ["Dragon", 14],
  ["Beast", 15],
  ["Beast-Warrior", 16],
  ["Dinosaur", 17],
  ["Fish", 18],
  ["Sea Serpent", 19],
  ["Reptile", 20],
  ["Psychic", 21],
  ["Divine-Beast", 22],
  ["Creator-God", 23],
  ["Creator God", 23],
  ["Wyrm", 24],
  ["Cyberse", 25],
  ["Illusion", 26],
  ["Warrior", 27],
  ["Spellcaster", 28],
  ["Fairy", 29],
  ["Fiend", 30],
  ["Zombie", 31],
  ["Machine", 32],
  ["Aqua", 33],
];

const raceKeyShort = getShortKey("race");

function raceNameToNumber(raceName: string): number {
  const found = raceMappings.find(([name, _]) => name === raceName);
  if (found) {
    return found[1];
  }
  throw new Error(`Race ${raceName} not found`);
}

function raceNumberToName(raceNumber: number): string {
  const found = raceMappings.find(([_, number]) => number === raceNumber);
  if (found) {
    return found[0];
  }
  throw new Error(`Race number ${raceNumber} not found`);
}

const attributeMappings: [string, number][] = [
  ["DARK", 1],
  ["LIGHT", 2],
  ["WATER", 3],
  ["FIRE", 4],
  ["EARTH", 5],
  ["WIND", 6],
  ["DIVINE", 7],
]

const attributeKeyShort = getShortKey("attribute");

function attributeNameToNumber(attributeName: string): number {
  const found = attributeMappings.find(([name, _]) => name === attributeName);
  if (found) {
    return found[1];
  }
  throw new Error(`Attribute ${attributeName} not found`);
}

function attributeNumberToName(attributeNumber: number): string {
  const found = attributeMappings.find(([_, number]) => number === attributeNumber);
  if (found) {
    return found[0];
  }
  throw new Error(`Attribute number ${attributeNumber} not found`);
}

const frameTypeMappings: [string, number][] = [
  ["effect", 1],
  ["normal", 2],
  ["fusion", 3],
  ["xyz", 4],
  ["synchro", 5],
  ["ritual", 6],
  ["link", 7],
  ["spell", 8],
  ["trap", 9],
  ["effect_pendulum", 10],
  ["normal_pendulum", 11],
  ["fusion_pendulum", 12],
  ["xyz_pendulum", 13],
  ["synchro_pendulum", 14],
  ["ritual_pendulum", 15],
  ["link_pendulum", 16],
  ["token", 17],
];

const frameTypeKeyShort = getShortKey("frameType");

function frameTypeNameToNumber(frameTypeName: string): number {
  const found = frameTypeMappings.find(([name, _]) => name === frameTypeName);
  if (found) {
    return found[1];
  }
  throw new Error(`Frame type ${frameTypeName} not found`);
}

function frameTypeNumberToName(frameTypeNumber: number): string {
  const found = frameTypeMappings.find(([_, number]) => number === frameTypeNumber);
  if (found) {
    return found[0];
  }
  throw new Error(`Frame type number ${frameTypeNumber} not found`);
}

const typeMappings: [string, string][] = [
  ["Card", "C"],
  ["Monster", "M"],
  ["Spell", "S"],
  ["Trap", "T"],
  ["Normal", "N"],
  ["Effect", "E"],
  ["Fusion", "F"],
  ["Ritual", "R"],
  ["Synchro", "Y"],
  ["XYZ", "X"],
  ["Link", "L"],
  ["Pendulum", "P"],
  ["Token", "t"],
  ["Flip", "f"],
  ["Union", "u"],
  ["Spirit", "s"],
  ["Toon", "o"],
  ["Tuner", "n"],
  ["Gemini", "g"],
]

const typeKeyShort = getShortKey("type");

function typeToShort(type: string): string {
  const parts = type.split(" ");
  const shortParts = parts.map(part => {
    const found = typeMappings.find(([name, _]) => name === part);
    if (found) {
      return found[1];
    }
    throw new Error(`Type ${part} not found`);
  });
  return shortParts.join("");
}

function shortToType(short: string): string {
  const parts = short.split("");
  const longParts = parts.map(part => {
    const found = typeMappings.find(([_, short]) => short === part);
    if (found) {
      return found[0];
    }
    throw new Error(`Type ${part} not found`);
  });
  return longParts.join(" ");
}

function getForbiddenValue(tcg: string | undefined, ocg: string | undefined): string | undefined {
  function parseValue(value: string | undefined): number {
    if (value === undefined) {
      return 3;
    }
    switch (value.toLowerCase()) {
      case "forbidden":
        return 0;
      case "limited":
        return 1;
      case "semi-limited":
        return 2;
      default:
        return 3;
    }
  }

  const tcgValue = parseValue(tcg);
  const ocgValue = parseValue(ocg);

  if (tcgValue === 3 && ocgValue === 3) {
    return undefined;
  }

  return (tcgValue + 4 * ocgValue).toString();
}

export function parseForbiddenValue(value: string | undefined): [number, number] {
  if (value === undefined) {
    return [3, 3];
  }
  const parsed = parseInt(value);
  return [parsed % 4, Math.floor(parsed / 4)];
}

// class CardSet {
//   public readonly setName: string;
//   public readonly setCode: string;
//   public readonly setRarity: string;
//   public readonly setRarityCode: string;
//
//   constructor(json: Object) {
//
//   }
// }
