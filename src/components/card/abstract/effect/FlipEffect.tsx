import TriggerEffect from "./TriggerEffect.tsx";
import EffectClause from "./clause/EffectClause.ts";
import {ReactNode} from "react";

export default class FlipEffect extends TriggerEffect {
  constructor(clauses: EffectClause[]) {
    super(clauses);
  }

  public render(): ReactNode {
    return (
      <>
        {super.render()}
      </>
    )
  }
}
