import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BaseCard} from "../components/card/abstract/BaseCard.ts";
import {useCardDbContext} from "../components/card/abstract/parse/CardDb.tsx";

const CardPage: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  let card = useGetOfficialCard(cardName);

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

function useGetOfficialCard(id: string | undefined): BaseCard | undefined {
  const cardDb = useCardDbContext();
  if (id === undefined) {
    return undefined;
  }
  return cardDb.find(card => card.id == id);
}

export {CardPage}
