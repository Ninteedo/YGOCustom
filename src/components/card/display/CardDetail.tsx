import {ReactNode} from "react";
import BaseDbCard from "../abstract/BaseDbCard.ts";

export default function CardDetail({card}: { card: BaseDbCard }): ReactNode {
  return (
    <div>
      {card?.toCardDetail()}
    </div>
  )
}
