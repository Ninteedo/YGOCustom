import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import ContinuousIcon from "../../../../assets/images/properties/Continuous.svg";
import EffectClause from "./clause/EffectClause.ts";

export default class ContinuousEffect extends Effect {
  public readonly clauses: EffectClause[];

  constructor(...clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  public render(): ReactNode {
    return (
      <>
        <img className={"inline-logo"} src={ContinuousIcon} alt={"Continuous Icon"} title={"Continuous Effect"}/>
        <span className={"continuous-effect"}>{this.renderClauses(this.clauses)}</span>
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
