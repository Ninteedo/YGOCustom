import {ReactNode} from "react";
import ClauseEffect from "./ClauseEffect.ts";

export default class ContinuousEffect extends ClauseEffect {
  public render(): ReactNode {
    return (
      <>
        {/*<AttributeIcon src={ContinuousIcon} alt={"Continuous Icon"} title={"Continuous Effect"}/>*/}
        <span className={"continuous-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }
}
