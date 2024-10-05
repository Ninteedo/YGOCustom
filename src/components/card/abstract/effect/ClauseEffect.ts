import Effect from "./Effect.tsx";
import EffectClause from "./clause/EffectClause.ts";

/**
 * Intermediate class for effects that consist of multiple clauses.
 */
export default abstract class ClauseEffect extends Effect {
  public readonly clauses: EffectClause[];

  /**
   * Constructor.
   * @param clauses - clauses that make up the effect
   */
  constructor(clauses: EffectClause[]) {
    super();
    this.clauses = clauses;
  }

  /**
   * Append clauses to the end of the effect.
   * @param clauses - clauses to append
   */
  public addSubEffect(clauses: EffectClause[]): void {
    this.clauses.push(...clauses);
  }

  /**
   * Convert the effect to text.
   * Joins the clauses together with spaces.
   */
  public toText(): string {
    return `${this.clauses.map(c => c.toText()).join(" ")}`;
  }
}
