import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGetOfficialCard} from "../components/card/abstract/parse/cardLoader.ts";
import {LoadingSpinner} from "../components/card/LoadingSpinner.tsx";

const CardPage: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  const [card, loading] = useGetOfficialCard(cardName);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (card === undefined) {
      setCardComponent(<div>Card "{cardName}" not found</div>);
      console.log("loading=" + loading + ", card=" + card + ", cardName=" + cardName)
    } else {
      setCardComponent(card.toCardDetail());
    }
  }, [card, cardName, loading]);

  useEffect(() => {
    document.title = `${cardName}`;
  }, [cardName])

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
