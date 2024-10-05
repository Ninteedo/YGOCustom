import {ReactNode} from "react";
import QuickIcon from "../../../../assets/images/properties/Quick-Play.svg";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";
import ClauseEffect from "./ClauseEffect.ts";

export default class QuickEffect extends ClauseEffect {
  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={QuickIcon} alt={"Quick Icon"} title={"Quick Effect"}/>
        <span className={"quick-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }
}
