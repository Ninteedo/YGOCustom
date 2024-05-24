import EffectRestriction from "../../effect/EffectRestriction.tsx";
import Effect from "../../effect/Effect.tsx";
import {ReactNode} from "react";

export default function EffectBlock({effectRestrictions, effects, cardId}: {
  effectRestrictions: EffectRestriction[],
  effects: Effect[],
  cardId: string,
}): ReactNode {
  return (
    <div className="effect-block">
      <p>{effectRestrictions.map(((r, index) => r.render(index, cardId)))}</p>
      <ol className="effect-list">
        {effects.map((effect, index) => <li key={index} data-effect-index={index + 1}>{effect.render()}</li>)}
      </ol>
    </div>
  );
}
