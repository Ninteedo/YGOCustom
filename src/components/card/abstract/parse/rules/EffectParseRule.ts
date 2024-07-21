import Effect from "../../effect/Effect.tsx";

export interface EffectParseProps {
  text: string;
  sentence: string;
  isSpellTrap: boolean;
  isFastCard: boolean;
  isContinuous: boolean;
  isFirstSentence: boolean;
}

export interface EffectParseRule {
  match: (props: EffectParseProps) => boolean;
  parse: (props: EffectParseProps) => Effect;
}
