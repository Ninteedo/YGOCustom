import Effect from "../../effect/Effect.tsx";
import {ReactNode} from "react";
import EffectBlock from "./EffectBlock.tsx";

export default function PendulumEffectBlock({materials, pendulumEffects, monsterEffects, cardId}: {
  materials?: string,
  pendulumEffects: Effect[],
  monsterEffects: Effect[],
  cardId: string,
}): ReactNode {
  return (
    <div className={"pendulum-block"}>
      <EffectBlock effectRestrictions={[]} effects={pendulumEffects} cardId={cardId} isPendulum={true} />
      <EffectBlock materials={materials} effectRestrictions={[]} effects={monsterEffects} cardId={cardId} />
    </div>
  );
}
