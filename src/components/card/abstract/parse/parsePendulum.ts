import Effect from "../effect/Effect.tsx";
import {parseEffects} from "./parseEffects.ts";
import NormalEffectLore from "../effect/NormalEffectLore.tsx";

export function parsePendulumText(text: string, isNormalMonster: boolean, isExtraDeck: boolean): {
  materials: string | undefined,
  pendulumEffects: Effect[],
  monsterEffects: Effect[]
} {
  let materials: string | undefined = undefined;

  let pendulumEffectData: Effect[] | undefined = undefined;
  let monsterEffectData: Effect[] | undefined = undefined;

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
      monsterEffectData = [new NormalEffectLore(text.slice(monsterIndex + monsterDelimiter.length))];
    } else {
      let monsterEffectText = text.slice(monsterIndex + monsterDelimiter.length).trim();
      if (isExtraDeck) {
        const materialsRes = monsterEffectText.match(/([^\n\r/]+?)(?=(:?\r?\n| \/ ).+)/);
        if (materialsRes) {
          materials = materialsRes[0];
          monsterEffectText = monsterEffectText.substring(materials.length + 2).trimStart();
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
