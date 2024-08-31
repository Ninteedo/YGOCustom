import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import EffectClause from "./clause/EffectClause.ts";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";
import IgnitionIcon from "../../../../assets/images/properties/Ignition.svg";

export default class IgnitionEffect extends Effect {
  public readonly clauses: EffectClause[];

  constructor(clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={IgnitionIcon} alt={"Ignition Icon"} title={"Ignition Effect"}/>
        <span className={"ignition-effect"}>{this.renderClauses(this.clauses)}</span>
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
