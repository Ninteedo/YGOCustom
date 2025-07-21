import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {CardKind} from "../card/abstract/CardKind.ts";
import {CardSubKind} from "../card/abstract/CardSubKind.ts";
import {MonsterType} from "../card/abstract/monster/MonsterType.ts";
import {CardAttribute} from "../card/abstract/monster/CardAttribute.tsx";
import * as P from "parsimmon";

export interface AdvancedFilter {
  /**
   * Checks if the card fails the advanced filter.
   * @param card the card to check against the filter
   * @return true if the card passes the filter, false if it fails
   */
  passes(card: BaseDbCard): boolean;
}

export class NameMatchFilter implements AdvancedFilter {
  public readonly name: string;

  constructor(name: string) {
    this.name = name.toLowerCase();
  }

  public passes(card: BaseDbCard): boolean {
    return card.name.toLowerCase() === this.name;
  }
}

export class ArchetypeFilter implements AdvancedFilter {
  public readonly archetype: string;

  constructor(archetype: string) {
    this.archetype = archetype.toLowerCase();
  }

  public passes(card: BaseDbCard): boolean {
    // const matches = advQuery.matchAll(/"([^"]+)"/g)
    // const archetypes: string[] = [];
    // for (const match of matches) {
    //   if (match[1]) {
    //     archetypes.push(match[1]);
    //   }
    // }

    return card.name.toLowerCase().includes(this.archetype);
  }
}

export class MentionsFilter implements AdvancedFilter {
  public readonly shouldMention: string;

  constructor(shouldMention: string) {
    this.shouldMention = shouldMention.toLowerCase();
  }

  public passes(card: BaseDbCard): boolean {
    return card.getEffectText().toLowerCase().includes(`"${this.shouldMention}"`);
  }
}

export class AtkDefFilter implements AdvancedFilter {
  public readonly test: (atk: number | undefined, def: number | undefined) => boolean;

  constructor(test: (atk: number | undefined, def: number | undefined) => boolean) {
    this.test = test;
  }

  public passes(card: BaseDbCard): boolean {
    // const matches = advQuery.matchAll(/(\d+) (or (more|less) )?(atk|def)/ig);
    // for (const match of matches) {
    //   if (!card.isMonster()) return true;
    //
    //   const value = parseInt(match[1], 10);
    //   const condition = match[2] && match[2].toLowerCase();
    //   const statName = match[4].toLowerCase();
    //
    //   const statValue = statName === "atk" ? card.getAtk() : card.getDef();
    //   if (statValue === undefined || statValue === -1) return true;
    //   if (!condition && statValue !== value) {
    //     return true; // If no condition is specified, the stat must match exactly
    //   }
    //   if (condition === "more" && statValue < value) {
    //     return true;
    //   } else if (condition === "less" && statValue > value) {
    //     return true;
    //   }
    // }
    //
    // return false;

    return (card.isMonster() && this.test(card.getAtk(), card.getDef()));
  }
}

export class CardKindFilter implements AdvancedFilter {
  public readonly cardKind: CardKind;

  constructor(cardKind: CardKind) {
    this.cardKind = cardKind;
  }

  public passes(card: BaseDbCard): boolean {
    // const matches = advQuery.match(/(monster|spell\/trap|spell|trap|s\/t)/i);
    // if (!matches) return null; // No specific card kind filter applied
    //
    // const kind = matches[0].toLowerCase();
    // if (kind === "monster" && card.kind !== CardKind.MONSTER) return true;
    // if (kind === "spell" && card.kind !== CardKind.SPELL) return true;
    // if (kind === "trap" && card.kind !== CardKind.TRAP) return true;
    // if ((kind === "spell/trap" || kind === "s/t") && card.kind !== CardKind.SPELL && card.kind !== CardKind.TRAP) return true;
    //
    // return false; // Card passes the filter

    return card.kind === this.cardKind;
  }
}

export class CardSubKindFilter implements AdvancedFilter {
  public readonly cardSubKind: CardSubKind;

  constructor(cardSubKind: CardSubKind) {
    this.cardSubKind = cardSubKind;
  }

  public passes(card: BaseDbCard): boolean {
    // for (const subKind of cardSubKindList) {
    //   const regex = new RegExp(`\\b${subKind}\\b`, 'i');
    //   if (advQuery.match(regex)) {
    //     return card.subKind !== subKind;
    //   }
    // }
    // for (const [alias, subKind] of Object.entries(cardSubKindAliases)) {
    //   const regex = new RegExp(`\\b${alias}\\b`, 'i');
    //   if (advQuery.match(regex)) {
    //     return card.subKind !== subKind;
    //   }
    // }
    // return null;

    return card.subKind === this.cardSubKind;
  }
}

export class MonsterAttributeFilter implements AdvancedFilter {
  public readonly attribute: CardAttribute;

  constructor(attribute: CardAttribute) {
    this.attribute = attribute;
  }

  public passes(card: BaseDbCard): boolean {
    return card.getAttribute() === this.attribute;
  }
}

export class MonsterTypeFilter implements AdvancedFilter {
  public readonly monsterType: MonsterType;

  constructor(monsterType: MonsterType) {
    this.monsterType = monsterType;
  }

  public passes(card: BaseDbCard): boolean {
    return card.getMonsterType() === this.monsterType;
  }
}

// export class CombinedMonsterFilter implements AdvancedFilter {
//   public passes(advQuery: string, card: BaseDbCard): boolean {
//     const lowerQuery = advQuery.toLowerCase();
//
//     if (!lowerQuery.endsWith("monster")) return null;
//     if (!card.isMonster()) return true;  // not a monster, fails the filter
//
//     // monster type
//     const monsterTypes = monsterTypeList.filter(name => lowerQuery.includes(name.toLowerCase()));
//     if (monsterTypes.length > 0) {
//       if (!monsterTypes.includes(card.getMonsterType()!)) {
//         return true;  // card's monster type does not match
//       }
//     }
//
//     // monster attribute
//     const attributes = MONSTER_ATTRIBUTES.filter(name => lowerQuery.includes(name.toLowerCase()));
//     if (attributes.length > 0) {
//       if (!attributes.includes(card.getAttribute()!)) {
//         return true;  // card's attribute does not match
//       }
//     }
//
//     return false;
//   }
// }

export class DisjunctiveFilter implements AdvancedFilter {
  public readonly filters: AdvancedFilter[];

  constructor(...filters: AdvancedFilter[]) {
    this.filters = filters;
  }

  public passes(card: BaseDbCard): boolean {
    return this.filters.some(filter => filter.passes(card));
  }
}

export class ConjunctiveFilter implements AdvancedFilter {
  public readonly filters: AdvancedFilter[];

  constructor(...filters: AdvancedFilter[]) {
    this.filters = filters;
  }

  public passes(card: BaseDbCard): boolean {
    return this.filters.every(filter => filter.passes(card));
  }
}

export class NegativeFilter implements AdvancedFilter {
  public readonly filter: AdvancedFilter;

  constructor(filter: AdvancedFilter) {
    this.filter = filter;
  }

  public passes(card: BaseDbCard): boolean {
    return !this.filter.passes(card);
  }
}

export class TautologicalFilter implements AdvancedFilter {
  public passes(_card: BaseDbCard): boolean {
    return true;
  }
}

function cardFilterParser(): P.Parser<AdvancedFilter> {
  return P.alt(
    namedCardParser(),
    archetypeMentionsExceptParser()
  );
}

function archetypeMentionsExceptParser(): P.Parser<AdvancedFilter> {
  return P.seq(archetypeParser().atMost(1), P.optWhitespace, cardCoreParser(), mentionsCardParser().atMost(1), exceptCardParser().atMost(1))
    .map(([archetype, , kindAndSubKind, mentions, except]) => {
        const filters: AdvancedFilter[] = [];
        if (archetype) {filters.push(archetype[0]);}
        filters.push(kindAndSubKind);
        if (mentions) {filters.push(mentions[0]);}
        if (except) {filters.push(except[0]);}
        return new ConjunctiveFilter(...filters);
      });
}

function cardCoreParser(): P.Parser<AdvancedFilter> {
  return P.alt(
    cardKindAndSubKindParser(),
    monsterCoreParser()
  )
}

function monsterCoreParser(): P.Parser<AdvancedFilter> {
  return P.seq(
    monsterAttributesParser().atMost(1),
    P.optWhitespace,
    monsterTypesParser().atMost(1),
    P.optWhitespace,
    archetypeParser().atMost(1),
    P.optWhitespace,
    cardKindAndSubKindParser(),
  ).map(([attributes, , types, , archetype, , kindAndSubKind]) => {
    const filters: AdvancedFilter[] = [];
    if (attributes) {filters.push(attributes[0]);}
    if (types) {filters.push(types[0]);}
    if (archetype) {filters.push(archetype[0]);}
    filters.push(kindAndSubKind);
    return new ConjunctiveFilter(...filters);
  });
}

function namedCardParser(): P.Parser<NameMatchFilter> {
  return quotedTextParser().map(name => new NameMatchFilter(name.toLowerCase()));
}

function quotedTextParser(): P.Parser<string> {
  return P.regexp(/"([^"]+)"/, 1).map(match => match);
}

function archetypeParser(): P.Parser<ArchetypeFilter> {
  return quotedTextParser().map(archetype => new ArchetypeFilter(archetype));
}

function mentionsCardParser(): P.Parser<MentionsFilter> {
  return P.regexp(/,? that mentions/)
    .then(quotedTextParser()).map(mentions => new MentionsFilter(mentions));
}

function exceptCardParser(): P.Parser<NegativeFilter> {
  return P.regexp(/,? except /).chain(() => cardFilterParser().map(filter => new NegativeFilter(filter)));
}

function cardKindAndSubKindParser(): P.Parser<AdvancedFilter> {
  return P.seq(cardSubKindParser().atMost(1), P.optWhitespace, cardKindParser())
    .map(([subKindFilter, , kindFilter]) => {
      if (subKindFilter) {
        return new ConjunctiveFilter(subKindFilter[0], kindFilter);
      } else {
        return kindFilter;
      }
    });
}

function monsterAttributeParser(): P.Parser<MonsterAttributeFilter> {
  return P.alt(
    P.string("dark").result(new MonsterAttributeFilter(CardAttribute.DARK)),
    P.string("earth").result(new MonsterAttributeFilter(CardAttribute.EARTH)),
    P.string("fire").result(new MonsterAttributeFilter(CardAttribute.FIRE)),
    P.string("light").result(new MonsterAttributeFilter(CardAttribute.LIGHT)),
    P.string("water").result(new MonsterAttributeFilter(CardAttribute.WATER)),
    P.string("wind").result(new MonsterAttributeFilter(CardAttribute.WIND)),
    P.string("divine").result(new MonsterAttributeFilter(CardAttribute.DIVINE))
  );
}

function anySeparatorParser(): P.Parser<string> {
  return P.alt(
    P.string(", "),
    P.string(" or "),
    P.string(", or "),
    P.string(" and "),
    P.string(", and ")
  );
}

function monsterAttributesParser(): P.Parser<AdvancedFilter> {
  return P.sepBy(monsterAttributeParser(), anySeparatorParser())
    .map(filters =>
      filters.length === 1 ? filters[0] : new DisjunctiveFilter(...filters)
    );
}

function monsterTypeParser(): P.Parser<MonsterTypeFilter> {
  return P.alt(
    P.string("warrior").result(new MonsterTypeFilter(MonsterType.Warrior)),
    P.string("spellcaster").result(new MonsterTypeFilter(MonsterType.Spellcaster)),
    P.string("dragon").result(new MonsterTypeFilter(MonsterType.Dragon)),
    P.string("fiend").result(new MonsterTypeFilter(MonsterType.Fiend)),
    P.string("fairy").result(new MonsterTypeFilter(MonsterType.Fairy)),
    P.string("machine").result(new MonsterTypeFilter(MonsterType.Machine)),
    P.string("aqua").result(new MonsterTypeFilter(MonsterType.Aqua)),
    P.string("beast").result(new MonsterTypeFilter(MonsterType.Beast)),
    P.string("beast-warrior").result(new MonsterTypeFilter(MonsterType.BeastWarrior)),
    P.string("dinosaur").result(new MonsterTypeFilter(MonsterType.Dinosaur)),
    P.string("divine-beast").result(new MonsterTypeFilter(MonsterType.DivineBeast)),
    P.string("fish").result(new MonsterTypeFilter(MonsterType.Fish)),
    P.string("insect").result(new MonsterTypeFilter(MonsterType.Insect)),
    P.string("plant").result(new MonsterTypeFilter(MonsterType.Plant)),
    P.string("psychic").result(new MonsterTypeFilter(MonsterType.Psychic)),
    P.string("pyro").result(new MonsterTypeFilter(MonsterType.Pyro)),
    P.string("reptile").result(new MonsterTypeFilter(MonsterType.Reptile)),
    P.string("rock").result(new MonsterTypeFilter(MonsterType.Rock)),
    P.string("sea-serpent").result(new MonsterTypeFilter(MonsterType.SeaSerpent)),
    P.string("thunder").result(new MonsterTypeFilter(MonsterType.Thunder)),
    P.string("wyrm").result(new MonsterTypeFilter(MonsterType.Wyrm)),
    P.string("zombie").result(new MonsterTypeFilter(MonsterType.Zombie)),
    P.string("illusion").result(new MonsterTypeFilter(MonsterType.Illusion)),
  );
}

function monsterTypesParser(): P.Parser<AdvancedFilter> {
  return P.sepBy(monsterTypeParser(), anySeparatorParser())
      .map(filters =>
        filters.length === 1 ? filters[0] : new DisjunctiveFilter(...filters)
      );
}

function cardSubKindParser(): P.Parser<CardSubKindFilter> {
  return P.alt(
    P.string("normal").result(new CardSubKindFilter(CardSubKind.NORMAL)),
    P.string("effect").result(new CardSubKindFilter(CardSubKind.EFFECT)),
    P.string("fusion").result(new CardSubKindFilter(CardSubKind.FUSION)),
    P.string("ritual").result(new CardSubKindFilter(CardSubKind.RITUAL)),
    P.string("synchro").result(new CardSubKindFilter(CardSubKind.SYNCHRO)),
    P.string("xyz").result(new CardSubKindFilter(CardSubKind.XYZ)),
    P.string("link").result(new CardSubKindFilter(CardSubKind.LINK)),
    P.string("quick-play").result(new CardSubKindFilter(CardSubKind.QUICK_PLAY)),
    P.string("continuous").result(new CardSubKindFilter(CardSubKind.CONTINUOUS)),
    P.string("equip").result(new CardSubKindFilter(CardSubKind.EQUIP)),
    P.string("field").result(new CardSubKindFilter(CardSubKind.FIELD)),
    P.string("counter").result(new CardSubKindFilter(CardSubKind.COUNTER))
  );
}

function cardKindParser(): P.Parser<AdvancedFilter> {
  return P.alt(
    P.string("monster").result(new CardKindFilter(CardKind.MONSTER)),
    P.string("spell").result(new CardKindFilter(CardKind.SPELL)),
    P.string("trap").result(new CardKindFilter(CardKind.TRAP)),
    P.string("spell/trap").result(new DisjunctiveFilter(new CardKindFilter(CardKind.SPELL), new CardKindFilter(CardKind.TRAP))),
    P.string("spells/traps").result(new DisjunctiveFilter(new CardKindFilter(CardKind.SPELL), new CardKindFilter(CardKind.TRAP))),
    P.string("s/t").result(new DisjunctiveFilter(new CardKindFilter(CardKind.SPELL), new CardKindFilter(CardKind.TRAP))),
    P.string("card").result(new TautologicalFilter())
  )
}

export function queryToFilter(advQuery: string): AdvancedFilter | null {
  // examples
  // Add 1 Level 4 or lower Warrior monster from your Deck to your hand.
  // You can add from your Deck to your hand, 1 "Fallen of Albaz", or 1 monster that mentions it, except "Tri-Brigade Mercourier".
  // You can send 1 "Bystial" monster or 1 "Branded" Spell/Trap from your Deck to the GY, except "Bystial Saronir".
  // add 1 "Bystial" monster from your Deck to your hand, except "The Bystial Lubellion".
  // You can place 1 "Branded" Continuous Spell/Trap from your Deck face-up on your field.
  // Fusion Summon 1 Level 8 or lower Fusion Monster from your Extra Deck, except "Lubellion the Searing Dragon", ...
  // You can add 1 "Purrely" card from your Deck to your hand, except a Quick-Play Spell.
  // You can Special Summon 1 monster with 800 ATK/1000 DEF from your Deck in Defense Position, except "Edea the Heavenly Squire", ...

  const res = cardFilterParser().parse(advQuery);
  if (res.status) {
    console.log(`Parsed advanced query: ${advQuery}`);
    console.log(res.value);
    return res.value;
  } else {
    console.error(`Failed to parse advanced query: ${advQuery}`);
    console.error(res);
    return null;
  }
}
