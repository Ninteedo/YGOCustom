import EffectRestriction from "../../effect/EffectRestriction.tsx";
import Effect from "../../effect/Effect.tsx";
import {ReactNode} from "react";
import NormalEffectLore from "../../effect/NormalEffectLore.tsx";

export default function EffectBlock({materials, effects, isPendulum}: {
  materials?: string,
  effects: Effect[] | string | NormalEffectLore,
  cardId: string,
  isPendulum?: boolean,
}): ReactNode {
  let effectContents;
  if (typeof effects === "string") {
    effectContents = <p>{effects.trim()}</p>;
  } else if (effects instanceof NormalEffectLore) {
    effectContents = effects.render();
  } else {
    effectContents = (
      <ol className="effect-list">
        {effects.map((effect, index) => {
          const isRestriction = effect instanceof EffectRestriction;
          return <li key={index} data-effect-index={index + 1} className={isRestriction ? "restriction" : ""}>
            <div>{effect.render()}</div>
          </li>;
        })}
      </ol>
    )
  }

  return (
    <div className={"effect-block" + (isPendulum ? " pendulum-effect-block" : "")}>
      {materials && <p className={"card-materials"}>{materials}</p>}
      {effectContents}
    </div>
  );
}
