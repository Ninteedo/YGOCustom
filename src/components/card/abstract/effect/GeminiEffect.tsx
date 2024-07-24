import Effect from "./Effect.tsx";
import {ReactNode} from "react";

export default class GeminiEffect extends Effect {
  public readonly effects: Effect[];

  constructor(effects: Effect[]) {
    super();
    this.effects = effects;
  }

  public render(): ReactNode {
    return (
      <>
        <span className={"gemini-effect"}>Gemini</span>
        {this.effects.map((effect, index) => (
          <div key={index} className={"gemini-effect"}>
            {effect.render()}
          </div>
        ))}
      </>
    )
  }

  public toText(): string {
    return `${this.effects.map(c => c.toText()).join(" ")}`;
  }
}
