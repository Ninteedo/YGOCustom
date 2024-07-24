import {ReactNode} from "react";
import EffectClause from "./clause/EffectClause.ts";
import "../../../../style/EffectRender.scss";
import SubEffectClause from "./clause/SubEffectClause.tsx";

export default abstract class Effect {
  abstract render(): ReactNode;

  protected renderClauses(clauses: EffectClause[]): ReactNode {
    const renderedClauses: ReactNode[] = [];
    let subEffectClauses: ReactNode[] = [];

    for (let i = 0; i < clauses.length; i++) {
      const clause = clauses[i];

      if (clause instanceof SubEffectClause) {
        subEffectClauses.push(<li key={i}>{clause.render()}</li>);
      } else {
        if (subEffectClauses.length > 0) {
          renderedClauses.push(<ul key={`sub-${i}`}>{subEffectClauses}</ul>);
          subEffectClauses = [];
        }
        renderedClauses.push(<span key={i}>{clause.render()}</span>);
      }
    }

    if (subEffectClauses.length > 0) {
      renderedClauses.push(<ul key={`sub-end`}>{subEffectClauses}</ul>);
    }

    return <>{renderedClauses}</>;
  }

  public isProperEffect(): boolean {
    return true;
  }

  public addSubEffect(clauses: EffectClause[]): void {
    throw new Error(`Sub-effects are not supported by this effect. ${clauses}`);
  }

  abstract toText(): string;
}
