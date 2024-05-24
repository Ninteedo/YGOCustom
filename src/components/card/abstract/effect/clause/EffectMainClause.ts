import EffectClause from "./EffectClause.ts";
import {EffectMain} from "../../../EffectText.tsx";
import {ReactNode} from "react";

export default class EffectMainClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return EffectMain(this.contents)
  }
}
