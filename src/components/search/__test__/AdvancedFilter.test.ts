import {describe, expect, test} from "@jest/globals";
import {
  AdvancedFilter,
  ArchetypeFilter,
  CardKindFilter,
  ConjunctiveFilter,
  DisjunctiveFilter,
  queryToFilter,
} from "../AdvancedFilter.ts";
import {CardKind} from "../../card/abstract/CardKind.ts";

describe("queryToFilter", () => {
  function testParseQuery(advQuery: string, expected: AdvancedFilter): void {
    const result = queryToFilter(advQuery);
    expect(result).toEqual(expected);
  }

  test("\"Branded\" Spell/Trap", () => {
    testParseQuery("\"Branded\" Spell/Trap", new ConjunctiveFilter(
      new ArchetypeFilter("Branded"),
      new DisjunctiveFilter(
        new CardKindFilter(CardKind.SPELL),
        new CardKindFilter(CardKind.TRAP),
      ),
    ));
  })
})
