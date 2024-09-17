export function compressDbCardJson(cardJson: Object): CompressedCardEntry {
  const yamlYugiEntry = new YamlYugiEntry(cardJson);
  return CompressedCardEntry.fromYamlYugiEntry(yamlYugiEntry);
}

export function decompressDbCardJson(compressedCardJson: Object): CompressedCardEntry {
  return CompressedCardEntry.fromCompressedJson(compressedCardJson);
}

function readShortMapping(mappings: [string, number][], key: string): number {
  const found = mappings.find(([name, _]) => name === key);
  if (found) {
    return found[1];
  }
  throw new Error(`${key} not found`);
}

function readOriginalMapping(mappings: [string, number][], key: number): string {
  const found = mappings.find(([_, number]) => number === key);
  if (found) {
    return found[0];
  }
  throw new Error(`${key} not found`);
}

// const raceMappings: [string, number][] = [
//   ["Normal", 7],
//   ["Quick-Play", 1],
//   ["Continuous", 2],
//   ["Counter", 3],
//   ["Ritual", 4],
//   ["Equip", 5],
//   ["Field", 6],
//   ["Pyro", 8],
//   ["Rock", 9],
//   ["Winged Beast", 10],
//   ["Plant", 11],
//   ["Insect", 12],
//   ["Thunder", 13],
//   ["Dragon", 14],
//   ["Beast", 15],
//   ["Beast-Warrior", 16],
//   ["Dinosaur", 17],
//   ["Fish", 18],
//   ["Sea Serpent", 19],
//   ["Reptile", 20],
//   ["Psychic", 21],
//   ["Divine-Beast", 22],
//   ["Creator-God", 23],
//   ["Creator God", 23],
//   ["Wyrm", 24],
//   ["Cyberse", 25],
//   ["Illusion", 26],
//   ["Warrior", 27],
//   ["Spellcaster", 28],
//   ["Fairy", 29],
//   ["Fiend", 30],
//   ["Zombie", 31],
//   ["Machine", 32],
//   ["Aqua", 33],
// ];
//
// function raceNameToNumber(raceName: string): number {
//   const found = raceMappings.find(([name, _]) => name === raceName);
//   if (found) {
//     return found[1];
//   }
//   throw new Error(`Race ${raceName} not found`);
// }
//
// function raceNumberToName(raceNumber: number): string {
//   const found = raceMappings.find(([_, number]) => number === raceNumber);
//   if (found) {
//     return found[0];
//   }
//   throw new Error(`Race number ${raceNumber} not found`);
// }

const attributeMappings: [string, number][] = [
  ["DARK", 1],
  ["LIGHT", 2],
  ["WATER", 3],
  ["FIRE", 4],
  ["EARTH", 5],
  ["WIND", 6],
  ["DIVINE", 7],
]

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

// const typeMappings: [string, string][] = [
//   ["Card", "C"],
//   ["Monster", "M"],
//   ["Spell", "S"],
//   ["Trap", "T"],
//   ["Normal", "N"],
//   ["Effect", "E"],
//   ["Fusion", "F"],
//   ["Ritual", "R"],
//   ["Synchro", "Y"],
//   ["XYZ", "X"],
//   ["Link", "L"],
//   ["Pendulum", "P"],
//   ["Token", "t"],
//   ["Flip", "f"],
//   ["Union", "u"],
//   ["Spirit", "s"],
//   ["Toon", "o"],
//   ["Tuner", "n"],
//   ["Gemini", "g"],
// ];

const cardSuperTypeMappings: [string, number][] = [
  ["Monster", 1],
  ["Spell", 2],
  ["Trap", 3],
];

const monsterKindMappings: [string, number][] = [
  ["Fusion", 1],
  ["Ritual", 2],
  ["Synchro", 3],
  ["Xyz", 4],
  ["Link", 5],
  ["Normal", 6],
  ["Effect", 7],
];

function getForbiddenValue(tcg: string | undefined, ocg: string | undefined): string | undefined {
  function parseValue(value: string | undefined): number {
    if (value === undefined) {
      return 3;
    }
    switch (value && value.toLowerCase()) {
      case "forbidden":
        return 0;
      case "limited":
        return 1;
      case "semi-limited":
        return 2;
      case "unlimited":
        return 3;
      case "not yet released":
        return 4;
      case null:
        return 5;
      default:
        throw new Error(`Unknown forbidden value ${value}`);
    }
  }

  const tcgValue = parseValue(tcg);
  const ocgValue = parseValue(ocg);

  if (tcgValue === 3 && ocgValue === 3) {
    return undefined;
  }

  return (tcgValue + 6 * ocgValue).toString();
}

export function parseForbiddenValue(value: string | undefined): [number, number] {
  if (value === undefined) {
    return [3, 3];
  }
  const parsed = parseInt(value);
  return [parsed % 6, Math.floor(parsed / 6)];
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

class YamlYugiEntry {
  public readonly konamiId: number;
  public readonly password: number;
  public readonly name: { [key: string]: string };  // language -> name
  public readonly text: { [key: string]: string };  // language -> text
  public readonly cardType: string;  // Monster, Spell, Trap
  public readonly property: string | undefined;  // for Spell and Trap cards, e.g. Continuous, Equip
  public readonly monsterTypeLine: string | undefined;  // for Monster cards, e.g. "Warrior / Effect"
  public readonly attribute: string | undefined;  // for Monster cards, e.g. DARK, FIRE
  public readonly level: number | undefined;  // for Monster cards, except Xyz and Link
  public readonly rank: number | undefined;  // for Xyz Monster cards
  public readonly linkarrows: string[] | undefined;  // for Link Monster cards
  public readonly atk: string | undefined;  // for Monster cards
  public readonly def: string | undefined;  // for Monster cards
  public readonly sets: { [key: string]: {set_number: string, set_name: string, rarities: string[]}[] }
  public readonly images: { index: number, image: string}[];
  public readonly ygoProDeckImages: { id: number, image_url: string, image_url_small: string, image_url_cropped: string }[]
  public readonly limitRegulation: { tcg: string, ocg: string };
  public readonly yugipediaPageId: number;
  public readonly masterDuelRarity: string | undefined;
  public readonly pendulumScale: number | undefined;  // for Pendulum Monster cards
  public readonly pendulumEffect: { [key: string]: string } | undefined;  // for Pendulum Monster cards
  public readonly series: string[] | undefined;  // archetypes
  public readonly isEffect: boolean;

  constructor(json: any) {
    this.konamiId = json["konami_id"];
    this.password = json["password"] || json["id_alt"];
    this.name = json["name"];
    this.text = json["text"];
    this.cardType = json["card_type"];
    this.property = json["property"];
    this.monsterTypeLine = json["monster_type_line"];
    this.attribute = json["attribute"];
    this.level = json["level"];
    this.rank = json["rank"];
    this.linkarrows = json["link_arrows"];
    this.atk = json["atk"];
    this.def = json["def"];
    this.sets = json["sets"];
    this.images = json["images"];
    this.limitRegulation = json["limit_regulation"];
    this.yugipediaPageId = json["yugipedia_page_id"];
    this.masterDuelRarity = json["master_duel_rarity"];
    this.pendulumScale = json["pendulum_scale"];
    this.pendulumEffect = json["pendulum_effect"];
    this.series = json["series"];
    this.ygoProDeckImages = json["card_images_new"];
    this.isEffect = json["is_effect"];
  }

  getLinkRating(): number | undefined {
    if (this.linkarrows) {
      return this.linkarrows.length;
    }
    return undefined;
  }

  getMonsterCategories(): string[] | undefined {
    if (!this.monsterTypeLine) {
      return undefined;
    }
    return this.monsterTypeLine.split(" / ");
  }
}

export class CompressedCardEntry {
  public readonly id: string | undefined;
  public readonly name: string;
  public readonly text: string;
  public readonly superType: string;
  public readonly monsterTypeLine: string[] | undefined;
  public readonly pendulumScale: number | undefined;
  public readonly pendulumText: string | undefined;
  public readonly property: string | undefined;
  public readonly attribute: string | undefined;
  public readonly level: number | undefined;
  public readonly forbidden: string | undefined;
  public readonly imageId: string | undefined;
  public readonly atk: string | undefined;
  public readonly def: string | undefined;
  public readonly isEffect: boolean | undefined;

  constructor(
    id: string | undefined,
    name: string,
    desc: string,
    superType: string,
    monsterTypeLine: string[] | undefined,
    pendulumScale: number | undefined,
    pendulumText: string | undefined,
    property: string | undefined,
    attribute: string | undefined,
    level: number | undefined,
    forbidden: string | undefined,
    imageId: string | undefined,
    atk: string | undefined,
    def: string | undefined,
    isEffect: boolean | undefined
  ) {
    this.id = id;
    this.name = name;
    this.text = desc;
    this.superType = superType;
    this.monsterTypeLine = monsterTypeLine;
    this.pendulumScale = pendulumScale;
    this.pendulumText = pendulumText;
    this.property = property;
    this.attribute = attribute;
    this.level = level;
    this.forbidden = forbidden;
    this.imageId = imageId;
    this.atk = atk;
    this.def = def;
    this.isEffect = isEffect;
  }

  static fromYamlYugiEntry(entry: YamlYugiEntry) {
    const monsterCategories = entry.getMonsterCategories();
    const password = entry.password !== undefined ? entry.password.toString() : undefined;
    return new CompressedCardEntry(
      password,  // id
      entry.name["en"],  // name
      entry.text["en"],  // desc
      entry.cardType,  // superType
      monsterCategories,  // monsterTypeLine
      entry.pendulumScale,  // pendulumScale
      entry.pendulumEffect && entry.pendulumEffect["en"],  // pendulumText
      entry.property,  // property
      entry.attribute,  // attribute
      entry.level ? entry.level : entry.rank ? entry.rank : entry.getLinkRating(),  // level
      entry.limitRegulation ? getForbiddenValue(entry.limitRegulation.tcg, entry.limitRegulation.ocg) : undefined,  // forbidden
      (entry.ygoProDeckImages && entry.ygoProDeckImages[0].id.toString()) || password,  // imageId
      entry.atk,  // atk
      entry.def,  // def
      entry.isEffect
    )
  }

  static fromCompressedJson(json: any) {
    return new CompressedCardEntry(
      json[1],  // id
      json[2],  // name
      json[3],  // desc
      readOriginalMapping(cardSuperTypeMappings, json[4]),  // superType
      json[5],  // monsterTypeLine
      json[11],  // pendulumScale
      json[12],  // pendulumText
      json[6],  // property
      json[7] ? attributeNumberToName(json[7]) : undefined,  // attribute
      json[8],  // level
      json[9],  // forbidden
      json[10],  // imageId
      json[13],  // atk
      json[14],  // def
      json[15] === 1 ? true : json[15] === 0 ? false : undefined,  // isEffect
    )
  }

  toCompressedJson(): any {
    return {
      1: this.id,
      2: this.name,
      3: this.text,
      4: readShortMapping(cardSuperTypeMappings, this.superType),
      5: this.monsterTypeLine,
      6: this.property,
      7: this.attribute && attributeNameToNumber(this.attribute),
      8: this.level,
      9: this.forbidden,
      10: this.imageId,
      11: this.pendulumScale,
      12: this.pendulumText,
      13: this.atk,
      14: this.def,
      15: this.isEffect === undefined ? 2 : this.isEffect ? 1 : 0,
    }
  }

  getMonsterType(): string | undefined {
    if (this.monsterTypeLine) {
      return this.monsterTypeLine[0];
    }
    return undefined;
  }

  getIsPendulum(): boolean {
    return this.pendulumScale !== undefined;
  }

  getMonsterKind(): string | undefined {
    if (!this.monsterTypeLine) {
      return undefined;
    }
    const res = monsterKindMappings.find(([kind, _]) => this.monsterTypeLine && this.monsterTypeLine.includes(kind));
    if (res) {
      return res[0];
    }
    return (this.isEffect || this.monsterTypeLine.includes("Effect")) ? "Effect" : "Normal";
  }
}
