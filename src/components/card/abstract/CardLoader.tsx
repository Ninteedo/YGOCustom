import {BaseCard} from "./BaseCard.ts";
import {parseMonsterCard} from "./monster/BaseMonsterCard.ts";
import {ReactNode} from "react";

const CARD_DIR = "cards"

export async function loadCard(id: string | undefined): Promise<BaseCard | null> {
  // Load card JSON from file, then create an appropriate card object, based on the card type
  return fetch(`${CARD_DIR}/${id}.json`)
    .then((response) => response.json())
    .then((json) => {
      const cardType: string = json.cardType.toLowerCase();
      switch (cardType) {
        case "monster":
          return parseMonsterCard(json);
        // case "spell":
        //   return SpellCard.fromJson(json);
        // case "trap":
        //   return TrapCard.fromJson(json);
        default:
          throw new Error(`Unknown card type: ${cardType}`);
      }
    })
}

export function MissingCard({id}: { id: string }): ReactNode {
  return <div>Card {id} not found</div>;
}
