import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {CardDetail} from "../components/card/CardDetail.tsx";
import {loadCard} from "../components/card/abstract/CardLoader.ts";

const CustomCardPage2: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      const loadedCard = await loadCard(cardName);
      setCardComponent(<CardDetail card={loadedCard}/>);
    };
    fetchCard();
  }, [cardName])

  useEffect(() => {
    document.title = `${cardName}`;
  }, [cardName])

  return (
    <div>
      {CardComponent}
    </div>
  )
}

export {CustomCardPage2}
