import EffectClause from "./EffectClause.ts";
import {ReactNode} from "react";
import {EffectExtra} from "../../../EffectText.tsx";

export default class EffectExtraClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return EffectExtra(this.contents);
  }

  public toText(): string {
    return this.contents;
  }
}
