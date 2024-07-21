import Effect from "../../effect/Effect.tsx";
import IgnitionEffect from "../../effect/IgnitionEffect.tsx";
import TriggerEffect from "../../effect/TriggerEffect.tsx";
import {parseEffectClauses} from "../parseEffects.ts";

export interface EffectParseProps {
  text: string;
  sentence: string;
  isSpellTrap: boolean;
  isFastCard: boolean;
  isContinuous: boolean;
  isFirstSentence: boolean;
}

export abstract class EffectParseRule {
  public abstract match(props: EffectParseProps): boolean;
  public abstract parse(props: EffectParseProps): Effect;

  protected duringMainPhase(sentence: string): boolean {
    return sentence.startsWith("During your Main Phase, ");
  }

  protected duringNonMainPhase(sentence: string): boolean {
    return !!sentence.match(/during (each|the|your|your opponent's) (draw|standby|battle|end) phase/i) || !!sentence.match(/At the (start|end) of the /);
  }

  protected hasTimedCondition(sentence: string): boolean {
    const condition = this.getCondition(sentence);
    const keywords = ["if", "when", "each time"];
    return keywords.some((keyword) => condition.toLowerCase().includes(keyword + " "));
  }

  protected hasActivationWindowMention(sentence: string): boolean {
    return sentence.startsWith("Once per turn") ||
      sentence.startsWith("During your Main Phase") ||
      sentence.startsWith("You can ") ||
      sentence.startsWith("Once per Chain");
  }

  protected getTriggerOrIgnition(sentence: string, isTrigger: boolean): Effect {
    const clauses = parseEffectClauses(sentence);
    if (isTrigger) {
      return new IgnitionEffect(clauses);
    } else {
      return new TriggerEffect(clauses);
    }
  }

  protected isSlowCondition(sentence: string): boolean {
    return sentence.startsWith("If you control ");
  }

  protected getCondition(sentence: string): string {
    if (!this.hasCondition(sentence)) {
      return "";
    }
    return sentence.split(": ")[0];
  }

  protected getCost(sentence: string): string {
    if (!this.hasCost(sentence)) {
      return "";
    }
    const remaining = sentence.substring(this.getCondition(sentence).length + 2);
    return remaining.split("; ")[0];
  }

  protected hasCondition(sentence: string): boolean {
    return sentence.includes(": ");
  }

  protected hasCost(sentence: string): boolean {
    return sentence.includes("; ");
  }
}
