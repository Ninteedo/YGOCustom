import EffectClause from "./EffectClause.ts";
import {ReactNode} from "react";

export default class SubEffectClause implements EffectClause {
  public readonly subClauses: EffectClause[];

  constructor(subClauses: EffectClause[]) {
    this.subClauses = subClauses;
  }

  public render(): ReactNode {
    return <span>{this.subClauses.map((c, index) => <span key={index}>{c.render()}</span>)}</span>;
  }

  public toText(): string {
    return `${this.subClauses.map(c => c.toText()).join(" ")}`;
  }
}
