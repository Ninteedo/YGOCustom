import Effect from "./Effect.tsx";
import {ReactNode} from "react";
import QuickIcon from "../../../../assets/images/properties/Quick-Play.svg";
import EffectClause from "./clause/EffectClause.ts";
import {AttributeIcon} from "../../display/AttributeIcon.tsx";

export default class QuickEffect extends Effect {
  public readonly clauses: EffectClause[];

  constructor(clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  public render(): ReactNode {
    return (
      <>
        <AttributeIcon src={QuickIcon} alt={"Quick Icon"} title={"Quick Effect"}/>
        <span className={"quick-effect"}>{this.renderClauses(this.clauses)}</span>
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
