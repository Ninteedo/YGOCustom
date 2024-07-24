import EffectClause from "./EffectClause.ts";
import {ReactNode} from "react";

export default class SubEffectClause implements EffectClause {
  public readonly subClauses: EffectClause[];

  constructor(subClauses: EffectClause[]) {
    this.subClauses = subClauses;
  }

  public render(): ReactNode {
    return <span><br/>● {this.subClauses.map((subClauses, index) =>
      <span key={index}>{subClauses.render()}</span>)}</span>;
  }
}
