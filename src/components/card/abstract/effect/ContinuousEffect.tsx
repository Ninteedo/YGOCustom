import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import ContinuousIcon from "../../../../assets/images/properties/Continuous.svg";
import EffectClause from "./clause/EffectClause.ts";

export default class ContinuousEffect extends Effect {
  public readonly clause: EffectClause;

  constructor(clauses: EffectClause[]) {
    super();
    this.clause = clauses[0];
  }

  public render(): ReactNode {
    return (
      <>
        <img className={"inline-logo"} src={ContinuousIcon} alt={"Continuous Icon"} title={"Continuous Effect"}/>
        <span className={"continuous-effect"}>{this.clause.render()}</span>
      </>
    )
  }
}
