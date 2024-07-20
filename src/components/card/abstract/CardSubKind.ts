import {CardKind} from "./CardKind.ts";

export enum CardSubKind {
  NORMAL = 'Normal',
  EFFECT = 'Effect',
  RITUAL = 'Ritual',
  FUSION = 'Fusion',
  SYNCHRO = 'Synchro',
  XYZ = 'Xyz',
  LINK = 'Link',
  QUICK_PLAY = 'Quick-Play',
  CONTINUOUS = 'Continuous',
  EQUIP = 'Equip',
  FIELD = 'Field',
  COUNTER = 'Counter',
  TOKEN = 'Token',
}

export function readCardSubKind(kind: CardKind, typeString: string, race: string, frameType: string | undefined): CardSubKind {
  typeString = typeString.toLowerCase();
  race = race.toLowerCase();
  if (frameType) {
    frameType = frameType.toLowerCase();
  }

  if (kind === CardKind.TOKEN) {
    return CardSubKind.TOKEN;
  } else if (kind == CardKind.MONSTER && frameType) {
    if (frameType.includes("link")) {
      return CardSubKind.LINK;
    } else if (frameType.includes("xyz")) {
      return CardSubKind.XYZ;
    } else if (frameType.includes("synchro")) {
      return CardSubKind.SYNCHRO;
    } else if (frameType.includes("fusion")) {
      return CardSubKind.FUSION;
    } else if (frameType.includes("ritual")) {
      return CardSubKind.RITUAL;
    } else if (frameType.includes("effect")) {
      return CardSubKind.EFFECT;
    } else {
      return CardSubKind.NORMAL;
    }
  } else {
    if (race.includes("normal")) {
      return CardSubKind.NORMAL;
    } else if (race.includes("quick-play")) {
      return CardSubKind.QUICK_PLAY;
    } else if (race.includes("continuous")) {
      return CardSubKind.CONTINUOUS;
    } else if (race.includes("field")) {
      return CardSubKind.FIELD;
    } else if (race.includes("equip")) {
      return CardSubKind.EQUIP;
    } else if (race.includes("counter")) {
      return CardSubKind.COUNTER;
    } else if (race.includes("ritual")) {
      return CardSubKind.RITUAL;
    }
  }
  throw new Error(`Unknown card sub kind: ${typeString} ${race}`);
}

export function isExtraDeck(subKind: CardSubKind): boolean {
  return subKind === CardSubKind.FUSION || subKind === CardSubKind.SYNCHRO || subKind === CardSubKind.XYZ || subKind === CardSubKind.LINK;
}

export function isContinuousLike(subKind: CardSubKind): boolean {
  return subKind === CardSubKind.CONTINUOUS || subKind === CardSubKind.FIELD || subKind === CardSubKind.EQUIP;
}
