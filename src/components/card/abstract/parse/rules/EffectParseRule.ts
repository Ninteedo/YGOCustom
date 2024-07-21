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
  lastEffect: Effect | null;
}

export abstract class EffectParseRule {
  public abstract match(props: EffectParseProps): boolean;
  public abstract parse(props: EffectParseProps): Effect | null;

  /**
   * Check if the sentence starts with "During your Main Phase".
   * @param sentence the sentence to check
   */
  protected duringMainPhase(sentence: string): boolean {
    return sentence.startsWith("During your Main Phase, ");
  }

  /**
   * Check if the sentence mentions during a phase other than the Main Phase.
   * @param sentence the sentence to check
   */
  protected duringOtherPhase(sentence: string): boolean {
    return !!(
      sentence.match(/during (each|the|your|your opponent's) (?!Main) phase/i)
      || sentence.match(/^At the (start|end) of the (?!Main)/)
    );
  }

  /**
   * Check if the sentence has a timed condition.
   *
   * A timed condition is a condition that starts includes "If", "When", or "Each time".
   *
   * This may match some sentences that are not actually timed conditions.
   * @param sentence the sentence to check
   */
  protected hasTimedCondition(sentence: string): boolean {
    const condition = this.getCondition(sentence);
    return !!condition.match(/(if|when|each time)/i);
  }

  /**
   * Check if the sentence has an activation window mention.
   *
   * An activation window mention is a phrase that indicates that an effect can be activated.
   * This is very broad.
   * @param sentence the sentence to check
   * @protected
   */
  protected hasActivationWindowMention(sentence: string): boolean {
    const condition = this.getCondition(sentence);
    const cost = this.getCost(sentence);
    return condition.startsWith("Once per turn")
      || condition.startsWith("During your Main Phase")
      || condition.startsWith("You can ")
      || condition.startsWith("Once per Chain")
      || cost.toLowerCase().startsWith("you can ");
  }

  /**
   * Check if the sentence is a slow condition.
   *
   * A slow condition is not a timed condition.
   * This is for when an effect includes a condition that mentions "if" but is actually something like "if you control".
   * @param sentence
   * @protected
   */
  protected isSlowCondition(sentence: string): boolean {
    return sentence.startsWith("If you control ");
  }

  protected getTriggerOrIgnition(sentence: string, isTrigger: boolean): Effect {
    const clauses = parseEffectClauses(sentence);
    if (isTrigger) {
      return new IgnitionEffect(clauses);
    } else {
      return new TriggerEffect(clauses);
    }
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
    const condition = this.getCondition(sentence);
    const startIndex = condition.length > 0 ? condition.length + 2 : 0;
    const remaining = sentence.substring(startIndex);
    return remaining.split("; ")[0];
  }

  protected hasCondition(sentence: string): boolean {
    return sentence.includes(": ");
  }

  protected hasCost(sentence: string): boolean {
    return sentence.includes("; ");
  }
}
