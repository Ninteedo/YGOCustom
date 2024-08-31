import Effect from "./Effect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import {ReactNode} from "react";
import SpecialSummonIcon from "../../../../assets/images/properties/SpecialSummon.svg";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";

export default class SummoningCondition extends Effect {
  public readonly clause: EffectClause;

  constructor(clause: EffectClause) {
    super();
    this.clause = clause;
  }

  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={SpecialSummonIcon} alt={"Special Summon Icon"} title={"Special Summon"}/>
        <span className={"summoning-condition"}>{this.clause.render()}</span>
      </>
    )
  }

  public isProperEffect(): boolean {
    return false;
  }

  public toText(): string {
    return this.clause.toText();
  }
}
