import BaseDbCard from "../card/abstract/BaseDbCard.ts";
import {useNavigate} from "react-router-dom";
import CardSmall from "../card/display/CardSmall.tsx";

export function SearchResult({card, toggleSearch}: { card: BaseDbCard, toggleSearch: () => void }) {
  const navigate = useNavigate();

  const clickAction = () => {
    navigate(card.getLinkUrl());
    toggleSearch();
  }

  return <CardSmall
    card={card}
    clickAction={clickAction}
  />
}
