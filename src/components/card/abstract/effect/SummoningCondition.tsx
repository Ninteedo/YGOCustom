import Effect from "./Effect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import {ReactNode} from "react";

export default class SummoningCondition extends Effect {
  public readonly clause: EffectClause;

  constructor(clause: EffectClause) {
    super();
    this.clause = clause;
  }

  public render(): ReactNode {
    return (
      <>
        {/*<img className={"inline-logo"} src={ContinuousIcon} alt={"Continuous Icon"} title={"Continuous Effect"}/>*/}
        <span className={"summoning-condition"}>{this.clause.render()}</span>
      </>
    )
  }
}
