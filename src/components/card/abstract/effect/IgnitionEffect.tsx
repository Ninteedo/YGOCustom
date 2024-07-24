import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import EffectClause from "./clause/EffectClause.ts";

export default class IgnitionEffect extends Effect {
  public readonly clauses: EffectClause[];

  constructor(clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  public render(): ReactNode {
    return (
      <>
        <span className={"ignition-effect"}>{this.renderClauses(this.clauses)}</span>
      </>
    )
  }

  public addSubEffect(clauses: EffectClause[]): void {
    this.clauses.push(...clauses);
  }
}
