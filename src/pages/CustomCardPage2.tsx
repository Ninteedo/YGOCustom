import {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CardDetail from "../components/card/display/CardDetail.tsx";
import {loadCard} from "../components/card/abstract/CardLoader.tsx";

export function CustomCardPage2() {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      const loadedCard = await loadCard(cardName);
      if (loadedCard === null) {
        setCardComponent(<div>Card "{cardName}" not found</div>);
      } else {
        setCardComponent(<CardDetail card={loadedCard}/>);
      }
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
