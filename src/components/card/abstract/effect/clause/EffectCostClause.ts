import EffectClause from "./EffectClause.ts";
import {ReactNode} from "react";
import {EffectCost} from "../../../EffectText.tsx";

export default class EffectCostClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return EffectCost(this.contents)
  }

  public toText(): string {
    return this.contents + ";";
  }
}
