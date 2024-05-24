import LightSvg from "../../assets/images/attributes/LIGHT.svg";
import DarkSvg from "../../assets/images/attributes/DARK.svg";
import EarthSvg from "../../assets/images/attributes/EARTH.svg";
import FireSvg from "../../assets/images/attributes/FIRE.svg";
import WaterSvg from "../../assets/images/attributes/WATER.svg";
import WindSvg from "../../assets/images/attributes/WIND.svg";
import DivineSvg from "../../assets/images/attributes/DIVINE.svg";

export enum MonsterAttribute {
  LIGHT = "LIGHT",
  DARK = "DARK",
  EARTH = "EARTH",
  FIRE = "FIRE",
  WATER = "WATER",
  WIND = "WIND",
  DIVINE = "DIVINE"
}

/**
 * Returns the image path for the given attribute, pointing to the appropriate SVG file.
 *
 * SVG files are stored in src/assets/images/attributes, and are named after the attribute they represent.
 * @param attribute The attribute to get the image for.
 * @returns The path to the image for the given attribute.
 */
export function MonsterAttributeImage(attribute: MonsterAttribute): string {
  switch (attribute) {
    case MonsterAttribute.LIGHT:
      return LightSvg;
    case MonsterAttribute.DARK:
      return DarkSvg;
    case MonsterAttribute.EARTH:
      return EarthSvg;
    case MonsterAttribute.FIRE:
      return FireSvg;
    case MonsterAttribute.WATER:
      return WaterSvg;
    case MonsterAttribute.WIND:
      return WindSvg;
    case MonsterAttribute.DIVINE:
      return DivineSvg;
  }
}
