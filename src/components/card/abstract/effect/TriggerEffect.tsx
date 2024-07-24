import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import TriggerIcon from "../../../../assets/images/properties/Trigger.svg";
import EffectClause from "./clause/EffectClause.ts";

export default class TriggerEffect extends Effect {
  public readonly clauses: EffectClause[];

  constructor(clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  public render(): ReactNode {
    return (
      <>
        <img className={"inline-logo"} src={TriggerIcon} alt={"Trigger Icon"} title={"Trigger Effect"}/>
        <span className={"trigger-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }

  public addSubEffect(clauses: EffectClause[]): void {
    this.clauses.push(...clauses);
  }

  public toText(): string {
    return `${this.clauses.map(c => c.toText()).join(" ")}`;
  }
}
