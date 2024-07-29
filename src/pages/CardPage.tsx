import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGetOfficialCard} from "../components/card/abstract/parse/cardLoader.ts";
import {LoadingSpinner} from "../components/card/LoadingSpinner.tsx";

const CardPage: React.FC = () => {
  const {cardId} = useParams<{ cardId: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  const [card, loading] = useGetOfficialCard(cardId);

  useEffect(() => {
    if (loading) {
      setCardComponent(<LoadingSpinner />);
      return;
    }

    if (card === undefined) {
      setCardComponent(<div>Card "{cardId}" not found</div>);
      console.log("loading=" + loading + ", card=" + card + ", cardName=" + cardId)
    } else {
      setCardComponent(card.toCardDetail());
      document.title = card.name;
    }
  }, [card, cardId, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {CardComponent}
    </div>
  )
}

export {CardPage}
