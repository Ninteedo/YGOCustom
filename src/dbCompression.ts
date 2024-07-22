const mappings: [string, string][] = [
  ["id", "i"],
  ["name", "n"],
  ["type", "y"],
  ["frameType", "f"],
  ["desc", "t"],
  ["atk", "a"],
  ["def", "d"],
  ["race", "r"],
  ["attribute", "b"],
  ["archetype", "h"],
  ["imageId", "u"],
  ["level", "l"],
  ["linkval", "v"],
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
  // public readonly cardSets: CardSet[];

  constructor(json: any, isCompressed: boolean) {
    this.id = getMapping(json, "id", isCompressed);
    this.name = getMapping(json, "name", isCompressed);
    this.type = getMapping(json, "type", isCompressed);
    this.frameType = getMapping(json, "frameType", isCompressed);
    this.desc = getMapping(json, "desc", isCompressed);
    this.atk = getMappingSafe(json, "atk", isCompressed);
    this.def = getMappingSafe(json, "def", isCompressed);
    this.attribute = getMappingSafe(json, "attribute", isCompressed);
    this.archetype = getMappingSafe(json, "archetype", isCompressed);
    this.level = getMappingSafe(json, "level", isCompressed);
    this.linkval = getMappingSafe(json, "linkval", isCompressed);

    if (isCompressed) {
      this.imageId = getMapping(json, "imageId", isCompressed);
      const raceNumberString = getMappingSafe(json, "race", isCompressed);
      if (raceNumberString !== undefined) {
        this.race = raceNumberToName(parseInt(raceNumberString));
      }
    } else {
      this.imageId = json["card_images"][0]["id"];
      this.race = getMappingSafe(json, "race", isCompressed);
    }
    // this.cardSets = (json[getMapping("card_sets", isCompressed)]; as Object[]).map(setJson => new CardSet(setJson));
  }

  public toCompressed(): any {
    const compressed: any = {};

    for (const [key, compressedKey] of mappings) {
      // @ts-ignore
      compressed[compressedKey] = this[key];
    }

    if (this.race) {
      compressed["r"] = raceNameToNumber(this.race);
    }

    return compressed;
  }
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
