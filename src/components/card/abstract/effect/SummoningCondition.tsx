import {ReactNode} from "react";
import SpecialSummonIcon from "../../../../assets/images/properties/SpecialSummon.svg";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";
import ClauseEffect from "./ClauseEffect.ts";

export default class SummoningCondition extends ClauseEffect {
  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={SpecialSummonIcon} alt={"Special Summon Icon"} title={"Special Summon"}/>
        <span className={"summoning-condition"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }

  public isProperEffect(): boolean {
    return false;
  }
}
