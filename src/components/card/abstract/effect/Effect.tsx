import {ReactNode} from "react";
import EffectClause from "./clause/EffectClause.ts";
import "../../../../style/EffectRender.scss";

export default abstract class Effect {
  abstract render(): ReactNode;

  protected renderClauses(clauses: EffectClause[]): ReactNode {
    return clauses.map(((c, index) => <span key={index}>{c.render()}</span>));
  }

  public isProperEffect(): boolean {
    return true;
  }

  public addSubEffect(clauses: EffectClause[]): void {
    throw new Error(`Sub-effects are not supported by this effect. ${clauses}`);
  }
}
