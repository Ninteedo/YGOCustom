import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGetOfficialCard} from "../components/card/abstract/parse/CardLoader.tsx";

const CardPage: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  const card = useGetOfficialCard(cardName);

  useEffect(() => {
    if (card === undefined) {
      setCardComponent(<div>Card "{cardName}" not found</div>);
    } else {
      setCardComponent(card.toCardDetail());
    }
  }, [card, cardName]);

  useEffect(() => {
    document.title = `${cardName}`;
  }, [cardName])

  return (
    <div>
      {CardComponent}
    </div>
  )
}

export {CardPage}
