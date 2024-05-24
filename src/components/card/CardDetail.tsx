import {ReactNode} from "react";
import {BaseCard} from "./abstract/BaseCard.ts";

export function CardDetail({card}: { card: BaseCard }): ReactNode {
  return (
    <div>
      Here is the card:
      <br/>
      {card?.name}
      <br/>
      {card?.toString()}
    </div>
  )
}
