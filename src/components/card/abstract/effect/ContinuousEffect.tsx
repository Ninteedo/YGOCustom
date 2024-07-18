import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import ContinuousIcon from "../../../../assets/images/properties/Continuous.svg";
import EffectClause from "./clause/EffectClause.ts";

export default class ContinuousEffect extends Effect {
  public readonly clause: EffectClause;

  constructor(clause: EffectClause) {
    super();
    this.clause = clause;
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
