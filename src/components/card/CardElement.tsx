import {BaseCard} from "./abstract/BaseCard.ts";
import {useEffect, useState} from "react";
import {loadCard, MissingCard} from "./abstract/CardLoader.tsx";

interface CardElementProps {
  id: string;
}

export default function CardElement({id}: CardElementProps) {
  const [card, setCard] = useState<BaseCard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedCard = await loadCard(id);
        if (loadedCard) {
          setCard(loadedCard);
        } else {
          setError(`Card "${id}" not found`);
        }
      } catch (error) {
        setError(`Error loading card ${id}: ${error}`);
      } finally {
      setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!card) {
    return <MissingCard id={id}/>;
  }

  return card.toCardElement();
}
