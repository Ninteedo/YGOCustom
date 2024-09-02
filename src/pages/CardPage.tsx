import React, {ReactNode, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useGetOfficialCard} from "../components/card/abstract/parse/cardLoader.ts";
import {LoadingSpinner} from "../components/card/LoadingSpinner.tsx";
import CardDetail from "../components/card/display/CardDetail.tsx";
import BaseDbCard from "../components/card/abstract/BaseDbCard.tsx";

export const CardPage: React.FC = () => {
  const {name} = useParams<{ name: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  const [card, loading] = useGetOfficialCard(name);

  useEffect(() => {
    if (loading) {
      setCardComponent(<LoadingSpinner />);
      return;
    }

    if (card === undefined) {
      setCardComponent(<div>Card "{name}" not found</div>);
      console.log("loading=" + loading + ", card=" + card + ", cardName=" + name)
    } else {
      setCardComponent(<CardDetail card={card} />);
      document.title = card.name;
    }
  }, [card, name, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {CardComponent}
      {card && <CardLinks card={card} />}
    </div>
  )
}

function CardLinks({ card }: { card: BaseDbCard }) {
  return (
    <div>
      <ul>
        <li><Link to={"https://yugipedia.com/wiki/" + encodeURIComponent(card.name)}>Yugipedia</Link></li>
        <li><Link to={cardmarketUrl(card.name)}>Cardmarket</Link></li>
        <li><Link to={tcgPlayerUrl(card.name)}>TCGPlayer</Link></li>
      </ul>
    </div>
  )
}

function cardmarketUrl(name: string) {
  return "https://www.cardmarket.com/en/YuGiOh/Cards/" + name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ +/g, "-");
}

function tcgPlayerUrl(name: string) {
  return "https://www.tcgplayer.com/search/yugioh/product?Language=English&productLineName=yugioh&view=grid&q=" + encodeURIComponent(name);
}
