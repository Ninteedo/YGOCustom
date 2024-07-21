import Effect from "./Effect.tsx";
import {ReactNode} from "react";

export default class AlwaysTreatedAs extends Effect {
  private readonly content: string;

  constructor(content: string) {
    super();
    this.content = content;
  }

  render(): ReactNode {
    return <span className="always-treated-as">({this.content})</span>;
  }

  public isProperEffect(): boolean {
    return false;
  }
}
