import {ReactNode} from "react";

export default interface EffectClause {
  render(): ReactNode;

  toText(): string;
}
