import Effect from "../effect/Effect.tsx";
import {parseEffects} from "./parseEffects.ts";

export function parsePendulumText(text: string): {
  materials: string | undefined,
  pendulumEffects: Effect[],
  monsterEffects: Effect[]
} {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  let materials: string | undefined = undefined;

  const pendulumEffectText = lines.slice(1, lines.indexOf("[ Monster Effect ]")).join("\n").trim();
  const monsterEffectText = lines.slice(lines.indexOf("[ Monster Effect ]") + 1).join("\n").trim();

  const pendulumEffectData = parseEffects({text: pendulumEffectText});
  const monsterEffectData = parseEffects({text: monsterEffectText});

  return {
    materials,
    pendulumEffects: pendulumEffectData.effects,
    monsterEffects: monsterEffectData.effects,
  };
}
