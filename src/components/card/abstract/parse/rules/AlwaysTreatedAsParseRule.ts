import {EffectParseProps, EffectParseRule} from "./EffectParseRule.ts";
import Effect from "../../effect/Effect.tsx";
import AlwaysTreatedAs from "../../effect/AlwaysTreatedAs.tsx";

export default class AlwaysTreatedAsParseRule implements EffectParseRule {
  match({sentence, isFirstSentence}: EffectParseProps): boolean {
    return (
      isFirstSentence
      && !!(
        sentence.match(/This card('s name)? is (always)? treated as /)
        || sentence.match(/This card's name becomes /)
      )
    );
  }

  parse({sentence}: EffectParseProps): Effect {
    if (sentence.startsWith("(") || sentence.endsWith(")")) {
      return new AlwaysTreatedAs(sentence.substring(1, sentence.length - 1));
    } else {
      return new AlwaysTreatedAs(sentence);
    }
  }
}