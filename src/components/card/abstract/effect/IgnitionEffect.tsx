import {ReactNode} from "react";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";
import IgnitionIcon from "../../../../assets/images/properties/Ignition.svg";
import ClauseEffect from "./ClauseEffect.ts";

export default class IgnitionEffect extends ClauseEffect {
  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={IgnitionIcon} alt={"Ignition Icon"} title={"Ignition Effect"}/>
        <span className={"ignition-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }
}
