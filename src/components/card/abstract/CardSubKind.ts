import {CardKind} from "./CardKind.ts";
import QuickPlayIcon from "../../../assets/images/properties/Quick-Play.svg";
import ContinuousIcon from "../../../assets/images/properties/Continuous.svg";
import EquipIcon from "../../../assets/images/properties/Equip.svg";
import FieldIcon from "../../../assets/images/properties/Field.svg";
import CounterIcon from "../../../assets/images/properties/Counter.svg";
import RitualIcon from "../../../assets/images/properties/Ritual.svg";

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

export function readCardSubKind(kind: CardKind, race: string, frameType: string | undefined): CardSubKind {
  race = race.toLowerCase();
  if (frameType) {
    frameType = frameType.toLowerCase();
  }

  if (kind === CardKind.TOKEN) {
    return CardSubKind.TOKEN;
  } else if (kind == CardKind.MONSTER && frameType) {
    if (race.includes("link")) {
      return CardSubKind.LINK;
    } else if (race.includes("xyz")) {
      return CardSubKind.XYZ;
    } else if (race.includes("synchro")) {
      return CardSubKind.SYNCHRO;
    } else if (race.includes("fusion")) {
      return CardSubKind.FUSION;
    } else if (race.includes("ritual")) {
      return CardSubKind.RITUAL;
    } else if (race.includes("normal")) {
      return CardSubKind.NORMAL;
    } else {
      return CardSubKind.EFFECT;
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
  throw new Error(`Unknown card sub kind: ${race}`);
}

export function isExtraDeck(subKind: CardSubKind): boolean {
  return subKind === CardSubKind.FUSION || subKind === CardSubKind.SYNCHRO || subKind === CardSubKind.XYZ || subKind === CardSubKind.LINK;
}

export function isContinuousLike(subKind: CardSubKind): boolean {
  return subKind === CardSubKind.CONTINUOUS || subKind === CardSubKind.FIELD || subKind === CardSubKind.EQUIP;
}

export function getSpellTrapPropertyIconPath(subKind: CardSubKind): string | undefined {
  switch (subKind) {
    case CardSubKind.QUICK_PLAY:
      return QuickPlayIcon;
    case CardSubKind.CONTINUOUS:
      return ContinuousIcon;
    case CardSubKind.EQUIP:
      return EquipIcon;
    case CardSubKind.FIELD:
      return FieldIcon;
    case CardSubKind.COUNTER:
      return CounterIcon;
    case CardSubKind.RITUAL:
      return RitualIcon;
    default:
      return undefined;
  }
}
