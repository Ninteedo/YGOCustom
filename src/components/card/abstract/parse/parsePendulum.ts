import Effect from "../effect/Effect.tsx";
import {parseEffects} from "./parseEffects.ts";
import NormalEffectLore from "../effect/NormalEffectLore.tsx";
import {readMaterialsText, readNonMaterialsText} from "./parseMaterials.ts";

export function splitPendulumText(text: string, isExtraDeck: boolean): {
  materials: string | undefined,
  pendulumText: string,
  monsterText: string
} {
  let materials: string | undefined = undefined;
  let pendulumText: string = "";
  let monsterText: string = "";

  const pendulumDelimiter = "[ Pendulum Effect ]";
  const monsterDelimiter = "[ Monster Effect ]";

  const pendulumIndex = text.indexOf(pendulumDelimiter);
  const monsterIndex = text.indexOf(monsterDelimiter);

  if (pendulumIndex > -1) {
    pendulumText = text.slice(pendulumIndex + pendulumDelimiter.length, monsterIndex > -1 ? monsterIndex : text.length);
  }

  if (monsterIndex > -1) {
    monsterText = text.slice(monsterIndex + monsterDelimiter.length);

    if (isExtraDeck) {
      const materialsRes = readMaterialsText(monsterText);
      if (materialsRes) {
        materials = materialsRes;
        monsterText = readNonMaterialsText(monsterText);
      }
    }
  }

  return {
    materials,
    pendulumText,
    monsterText,
  }
}

export function parsePendulumText(text: string, isNormalMonster: boolean, isExtraDeck: boolean): {
  materials: string | undefined,
  pendulumEffects: Effect[],
  monsterEffects: Effect[] | NormalEffectLore
} {
  let materials: string | undefined = undefined;

  let pendulumEffectData: Effect[] | undefined = undefined;
  let monsterEffectData: Effect[] | NormalEffectLore | undefined = undefined;

  const pendulumDelimiter = "[ Pendulum Effect ]";
  const monsterDelimiter = "[ Monster Effect ]";
  const pendulumIndex = text.indexOf(pendulumDelimiter);
  const monsterIndex = text.indexOf(monsterDelimiter);

  if (pendulumIndex > -1) {
    const endIndex = monsterIndex > -1 ? monsterIndex : text.length;
    const pendulumEffectText = text.slice(pendulumIndex + pendulumDelimiter.length, endIndex);
    pendulumEffectData = parseEffects({text: pendulumEffectText});
  } if (monsterIndex > -1) {
    if (isNormalMonster) {
      monsterEffectData = new NormalEffectLore(text.slice(monsterIndex + monsterDelimiter.length));
    } else {
      let monsterEffectText = text.slice(monsterIndex + monsterDelimiter.length).trim();
      if (isExtraDeck) {
        const materialsRes = readMaterialsText(monsterEffectText);
        if (materialsRes) {
          materials = materialsRes;
          monsterEffectText = readNonMaterialsText(monsterEffectText);
        }
      }
      monsterEffectData = parseEffects({text: monsterEffectText});
    }
  }

  return {
    materials,
    pendulumEffects: pendulumEffectData ? pendulumEffectData : [],
    monsterEffects: monsterEffectData ? monsterEffectData : []
  };
}
