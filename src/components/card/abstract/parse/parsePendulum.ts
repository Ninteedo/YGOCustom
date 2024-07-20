import Effect from "../effect/Effect.tsx";
import {parseEffects} from "./parseEffects.ts";
import NormalEffectLore from "../effect/NormalEffectLore.tsx";

export function parsePendulumText(text: string, isNormalMonster: boolean): {
  materials: string | undefined,
  pendulumEffects: Effect[],
  monsterEffects: Effect[]
} {
  let materials: string | undefined = undefined;

  let pendulumEffectData: {effects: Effect[]} | undefined = undefined;
  let monsterEffectData: {effects: Effect[]} | undefined = undefined;

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
      monsterEffectData = {effects: [new NormalEffectLore(text.slice(monsterIndex + monsterDelimiter.length))]};
    } else {
      const monsterEffectText = text.slice(monsterIndex + monsterDelimiter.length);
      monsterEffectData = parseEffects({text: monsterEffectText});
    }
  }


  return {
    materials,
    pendulumEffects: pendulumEffectData ? pendulumEffectData.effects : [],
    monsterEffects: monsterEffectData ? monsterEffectData.effects : []
  };
}
