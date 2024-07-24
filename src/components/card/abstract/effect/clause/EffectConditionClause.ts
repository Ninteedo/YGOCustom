import {ReactNode} from "react";
import {EffectCondition} from "../../../EffectText.tsx";
import EffectClause from "./EffectClause.ts";

export default class EffectConditionClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return EffectCondition(this.contents)
  }

  public toText(): string {
    return this.contents + ":";
  }
}
