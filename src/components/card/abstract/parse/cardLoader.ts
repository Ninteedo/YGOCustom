import {BaseCard} from "../BaseCard.ts";
import {BaseMonsterCard} from "../monster/BaseMonsterCard.ts";
import {RegularEffectMonster} from "../monster/subkinds/RegularEffectMonster.tsx";
import {FusionMonster} from "../monster/subkinds/FusionMonster.tsx";
import YAML from "yaml";
import {SynchroMonster} from "../monster/subkinds/SynchroMonster.tsx";
import {NormalMonster} from "../monster/subkinds/NormalMonster.tsx";
import {RitualMonster} from "../monster/subkinds/RitualMonster.tsx";
// import Effect from "../effect/Effect.tsx";
// import EffectRestriction from "../effect/EffectRestriction.tsx";
// import EffectClause from "../effect/clause/EffectClause.ts";
// import EffectCostClause from "../effect/clause/EffectCostClause.ts";
// import EffectConditionClause from "../effect/clause/EffectConditionClause.ts";
// import EffectMainClause from "../effect/clause/EffectMainClause.ts";
import {useEffect, useState} from "react";
import {useCardDbContext} from "./cardDbUtility.ts";

const CARD_DIR = "cards"

export async function loadCard(id: string | undefined): Promise<BaseCard | null> {
  // Load card JSON from file, then create an appropriate card object, based on the card type
  return fetch(`${CARD_DIR}/${id}.yaml`)
    .then((response) => response.text())
    .then((response) => YAML.parse(response))
    .then((yaml) => {
      const cardType: string = yaml.cardType.toLowerCase();
      switch (cardType) {
        case "monster":
          return parseMonsterCard(yaml);
        // case "spell":
        //   return SpellCard.fromJson(json);
        // case "trap":
        //   return TrapCard.fromJson(json);
        default:
          throw new Error(`Unknown card type: ${cardType}`);
      }
    })
}

function parseMonsterCard(json: { kind: string }): BaseMonsterCard {
  if (json.kind === undefined || json.kind.length === 0) {
    return RegularEffectMonster.fromJson(json);
  }

  const monsterKind: string = json.kind.toLowerCase();
  switch (monsterKind) {
    case "regular":
      return RegularEffectMonster.fromJson(json);
    case "normal":
      return NormalMonster.fromJson(json);
    case "ritual":
      return RitualMonster.fromJson(json);
    case "fusion":
      return FusionMonster.fromJson(json);
    case "synchro":
      return SynchroMonster.fromJson(json);
    // case "xyz":
    //   return parseXyzMonster(json);
    // case "link":
    //   return parseLinkMonster(json);
    default:
      throw new Error(`Unknown monster kind: ${monsterKind}`);
  }
}

// interface EffectData {
//   restrictions: EffectRestriction[];
//   effects: Effect[];
// }

// export function parseEffects(text: string): EffectData {
//   const sentences = (text + " ").split(". ").map((sentence) => sentence.trim());
//   const effects: Effect[] = [];
//   const restrictions: EffectRestriction[] = [];
//
//   // for (const sentence of sentences) {
//   //   if (sentence.startsWith("You can only ")) {
//   //     restrictions.push(new EffectRestriction(sentence));
//   //   } else if (sentence.includes("(Quick Effect):") || sentence.toLowerCase().includes("during either player's turn")) {
//   //     effects.push(new QuickEffect(parseEffectClauses(sentence)))
//   //   } else if (sentence.includes())
//   // }
//
//   // temporary
//   restrictions.push(new EffectRestriction(text));
//   return {restrictions, effects};
// }

// function parseEffectClauses(text: string): EffectClause[] {
//   const clauses: EffectClause[] = [];
//   let remainingText = text;
//
//   if (text.split(":").length === 2) {
//     const [conditionText, effectText] = remainingText.split(":");
//
//     clauses.push(new EffectConditionClause(conditionText));
//     remainingText = effectText;
//   }
//   if (remainingText.split(";").length === 2) {
//     const [costText, effectText] = remainingText.split(";");
//
//     clauses.push(new EffectCostClause(costText));
//     remainingText = effectText;
//   }
//   clauses.push(new EffectMainClause(remainingText));
//
//   return clauses;
// }

export function useGetOfficialCard(id: string | undefined): [BaseCard | undefined, boolean] {
  const [result, setResult] = useState<BaseCard | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const cardDb = useCardDbContext();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      const found = cardDb.find(c => c.id == id);

      setResult(found);
      setLoading(false);
    }

    fetchResults();
  }, [id, cardDb]);

  return [result, loading];
}
