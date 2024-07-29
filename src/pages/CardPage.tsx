import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useGetOfficialCard} from "../components/card/abstract/parse/cardLoader.ts";
import {LoadingSpinner} from "../components/card/LoadingSpinner.tsx";
import { Helmet } from 'react-helmet';

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
      <Helmet>
        <meta property={"og:title"} content={card?.name} />
        <meta property={"og:type"} content={"website"} />
        <meta property={"og:image"} content={card?.getLinkUrl()} />
        <meta property={"og:url"} content={window.location.href} />
        <meta property={"og:description"} content={card?.text} />
        <meta property={"og:site_name"} content={"rgh.dev"} />
      </Helmet>
      {CardComponent}
    </div>
  )
}

export {CardPage}
