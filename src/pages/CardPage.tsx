import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const CardPage: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    import(`../cards/${cardName}.tsx`)
      .then(module => {
        setCardComponent(module.default);
      })
      .catch(() => {
        setCardComponent(<div>Card not found</div>);
      });
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

export {CardPage}
