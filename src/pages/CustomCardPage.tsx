import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const CustomCardPage: React.FC = () => {
  const {cardName} = useParams<{ cardName: string }>();
  const [CardComponent, setCardComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    import(`../cards/custom/${cardName}.tsx`)
      .then(module => {
        setCardComponent(module.default);
      })
      .catch(() => {
        setCardComponent(<div>Card not found</div>);
      });
  })

  return (
    <div>
      {CardComponent}
    </div>
  )
}

export {CustomCardPage}
