import {ReactNode} from "react";
import TriggerIcon from "../../../../assets/images/properties/Trigger.svg";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";
import ClauseEffect from "./ClauseEffect.ts";

export default class TriggerEffect extends ClauseEffect {
  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={TriggerIcon} alt={"Trigger Icon"} title={"Trigger Effect"}/>
        <span className={"trigger-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }
}
