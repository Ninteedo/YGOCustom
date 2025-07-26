import {describe, expect, test} from "@jest/globals";
import {
  AdvancedFilter,
  ArchetypeFilter,
  CardKindFilter,
  CardSubKindFilter,
  ConjunctiveFilter,
  DisjunctiveFilter,
  MonsterAttributeFilter,
  MonsterTypeFilter,
  NameMatchFilter,
  queryToFilter,
} from "../AdvancedFilter.ts";
import {CardKind} from "../../card/abstract/CardKind.ts";
import {CardSubKind} from "../../card/abstract/CardSubKind.ts";
import {MonsterType} from "../../card/abstract/monster/MonsterType.ts";
import {CardAttribute} from "../../card/abstract/monster/CardAttribute.tsx";

describe("queryToFilter", () => {
  function testParseQuery(advQuery: string, expected: AdvancedFilter): void {
    const result = queryToFilter(advQuery);
    expect(result).toEqual(expected);
  }

  test(`"Branded Fusion"`, () => {
    testParseQuery(`"Branded Fusion"`, new NameMatchFilter("Branded Fusion"));
  });

  test("Normal Spell", () => {
    testParseQuery("Normal Spell", new ConjunctiveFilter(
      new CardSubKindFilter(CardSubKind.NORMAL),
      new CardKindFilter(CardKind.SPELL)
    ));
  });

  test(`"Branded" Spell/Trap`, () => {
    testParseQuery(`"Branded" Spell/Trap`, new ConjunctiveFilter(
      new ArchetypeFilter("Branded"),
      new DisjunctiveFilter(
        new CardKindFilter(CardKind.SPELL),
        new CardKindFilter(CardKind.TRAP),
      ),
    ));
  });

  test(`"Branded" Continuous Spell`, () => {
    testParseQuery(`"Branded" Continuous Spell`, new ConjunctiveFilter(
      new ArchetypeFilter("Branded"),
      new ConjunctiveFilter(
        new CardSubKindFilter(CardSubKind.CONTINUOUS),
        new CardKindFilter(CardKind.SPELL),
      ),
    ));
  });

  test("Wyrm monster", () => {
    testParseQuery("Wyrm monster", new ConjunctiveFilter(
      new MonsterTypeFilter(MonsterType.Wyrm),
      new CardKindFilter(CardKind.MONSTER)
    ));
  });

  test("EARTH monster", () => {
    testParseQuery("EARTH monster", new ConjunctiveFilter(
      new MonsterAttributeFilter(CardAttribute.EARTH),
      new CardKindFilter(CardKind.MONSTER)
    ));
  });

  test("DARK Dragon monster", () => {
    testParseQuery("DARK Dragon monster", new ConjunctiveFilter(
      new MonsterAttributeFilter(CardAttribute.DARK),
      new MonsterTypeFilter(MonsterType.Dragon),
      new CardKindFilter(CardKind.MONSTER)
    ));
  });

  test("LIGHT or DARK Dragon monster", () => {
    testParseQuery("LIGHT or DARK Dragon monster", new ConjunctiveFilter(
      new DisjunctiveFilter(
        new MonsterAttributeFilter(CardAttribute.LIGHT),
        new MonsterAttributeFilter(CardAttribute.DARK)
      ),
      new MonsterTypeFilter(MonsterType.Dragon),
      new CardKindFilter(CardKind.MONSTER)
    ));
  });

  test("Beast, Beast-Warrior, or Winged Beast monster", () => {
    testParseQuery("Beast, Beast-Warrior, or Winged Beast monster", new ConjunctiveFilter(
      new DisjunctiveFilter(
        new MonsterTypeFilter(MonsterType.Beast),
        new MonsterTypeFilter(MonsterType.BeastWarrior),
        new MonsterTypeFilter(MonsterType.WingedBeast)
      ),
      new CardKindFilter(CardKind.MONSTER)
    ));
  });
})
