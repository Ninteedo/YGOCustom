import TriggerEffect from "./TriggerEffect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import {ReactNode} from "react";
import EffectConditionClause from "./clause/EffectConditionClause.ts";

export default class FlipEffect extends TriggerEffect {
  constructor(clauses: EffectClause[]) {
    super([new EffectConditionClause("FLIP"), ...clauses]);
  }

  public render(): ReactNode {
    return super.render();
  }

  public addSubEffect(clauses: EffectClause[]): void {
    this.clauses.push(...clauses);
  }
}
