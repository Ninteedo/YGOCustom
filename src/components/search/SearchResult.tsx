import BaseDbCard from "../card/abstract/BaseDbCard.ts";
import {Link} from "react-router-dom";
import CardSmall from "../card/display/CardSmall.tsx";

export function SearchResult({card, toggleSearch}: { card: BaseDbCard, toggleSearch: () => void }) {
  const clickAction = () => {
    toggleSearch();
  }

  return <div>
    <Link to={card.getLinkUrl()}>
      <CardSmall
        card={card}
        clickAction={clickAction}
      />
    </Link>
  </div>;
}
