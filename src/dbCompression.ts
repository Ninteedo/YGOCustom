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
    this.race = getMappingSafe(json, "race", isCompressed);
    this.attribute = getMappingSafe(json, "attribute", isCompressed);
    this.archetype = getMappingSafe(json, "archetype", isCompressed);
    this.level = getMappingSafe(json, "level", isCompressed);
    this.linkval = getMappingSafe(json, "linkval", isCompressed);

    if (isCompressed) {
      this.imageId = getMapping(json, "imageId", isCompressed);
    } else {
      this.imageId = json["card_images"][0]["id"];
    }
    // this.cardSets = (json[getMapping("card_sets", isCompressed)]; as Object[]).map(setJson => new CardSet(setJson));
  }

  public toCompressed(): any {
    const compressed: any = {};

    for (const [key, compressedKey] of mappings) {
      // @ts-ignore
      compressed[compressedKey] = this[key];
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
