import Effect from "./Effect.tsx";
import {ReactNode} from "react";

export default class NormalEffectLore extends Effect {
  private readonly lore: string;

  constructor(lore: string) {
    super();
    this.lore = lore.trim();
  }

  render(): ReactNode {
    return <p className={"normal-lore"}>{this.lore}</p>;
  }

  public isProperEffect(): boolean {
    return false;
  }

  public toText(): string {
    return this.lore;
  }
}
