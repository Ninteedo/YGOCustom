import EffectRestriction from "../../effect/EffectRestriction.tsx";
import Effect from "../../effect/Effect.tsx";
import {ReactNode} from "react";

export default function EffectBlock({materials, effects, isPendulum}: {
  materials?: string,
  effects: Effect[] | string,
  cardId: string,
  isPendulum?: boolean,
}): ReactNode {
  let effectContents;
  if (typeof effects === "string") {
    effectContents = <p>{effects.trim()}</p>;
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
