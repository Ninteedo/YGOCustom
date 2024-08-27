import Effect from "../../effect/Effect.tsx";
import {ReactNode} from "react";
import EffectBlock from "./EffectBlock.tsx";
import NormalEffectLore from "../../effect/NormalEffectLore.tsx";

export default function PendulumEffectBlock({materials, pendulumEffects, monsterEffects, cardId}: {
  materials?: string,
  pendulumEffects: Effect[] | string,
  monsterEffects: Effect[] | string | NormalEffectLore,
  cardId: string,
}): ReactNode {
  return (
    <div className={"pendulum-block"}>
      <EffectBlock effects={pendulumEffects} cardId={cardId} isPendulum={true} />
      <EffectBlock materials={materials} effects={monsterEffects} cardId={cardId} />
    </div>
  );
}
