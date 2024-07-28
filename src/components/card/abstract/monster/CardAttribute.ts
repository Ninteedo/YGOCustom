import LightSvg from "../../../../assets/images/attributes/LIGHT.svg";
import DarkSvg from "../../../../assets/images/attributes/DARK.svg";
import EarthSvg from "../../../../assets/images/attributes/EARTH.svg";
import FireSvg from "../../../../assets/images/attributes/FIRE.svg";
import WaterSvg from "../../../../assets/images/attributes/WATER.svg";
import WindSvg from "../../../../assets/images/attributes/WIND.svg";
import DivineSvg from "../../../../assets/images/attributes/DIVINE.svg";

export enum CardAttribute {
  LIGHT = "LIGHT",
  DARK = "DARK",
  EARTH = "EARTH",
  FIRE = "FIRE",
  WATER = "WATER",
  WIND = "WIND",
  DIVINE = "DIVINE",
  SPELL = "SPELL",
  TRAP = "TRAP",
}

export function monsterAttributeFromString(attribute: string): CardAttribute {
  switch (attribute.toUpperCase()) {
    case "SPELL":
      return CardAttribute.SPELL;
    case "TRAP":
      return CardAttribute.TRAP;
    case "LIGHT":
      return CardAttribute.LIGHT;
    case "DARK":
      return CardAttribute.DARK;
    case "EARTH":
      return CardAttribute.EARTH;
    case "FIRE":
      return CardAttribute.FIRE;
    case "WATER":
      return CardAttribute.WATER;
    case "WIND":
      return CardAttribute.WIND;
    case "DIVINE":
      return CardAttribute.DIVINE;
    default:
      throw new Error(`Unknown attribute: ${attribute}`);
  }
}

/**
 * Returns the image path for the given attribute, pointing to the appropriate SVG file.
 *
 * SVG files are stored in src/assets/images/attributes, and are named after the attribute they represent.
 * @param attribute The attribute to get the image for.
 * @returns The path to the image for the given attribute.
 */
export function MonsterAttributeImage(attribute: CardAttribute): string {
  switch (attribute) {
    case CardAttribute.LIGHT:
      return LightSvg;
    case CardAttribute.DARK:
      return DarkSvg;
    case CardAttribute.EARTH:
      return EarthSvg;
    case CardAttribute.FIRE:
      return FireSvg;
    case CardAttribute.WATER:
      return WaterSvg;
    case CardAttribute.WIND:
      return WindSvg;
    case CardAttribute.DIVINE:
      return DivineSvg;
    default:
      throw new Error(`Unknown attribute: ${attribute}`);
  }
}
