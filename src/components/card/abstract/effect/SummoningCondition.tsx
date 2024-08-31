import Effect from "./Effect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import {ReactNode} from "react";
import SpecialSummonIcon from "../../../../assets/images/properties/SpecialSummon.svg";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";

export default class SummoningCondition extends Effect {
  public readonly clauses: EffectClause[];

  constructor(...clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

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

  public toText(): string {
    return `${this.clauses.map(c => c.toText()).join(" ")}`;
  }
}
