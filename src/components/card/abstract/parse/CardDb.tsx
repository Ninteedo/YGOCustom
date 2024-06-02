import {BaseCard} from "../BaseCard.ts";
import BaseDbCard from "../BaseDbCard.tsx";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

export async function fetchCardDb(language: string) {
  const dbLocation = `/db/cards.${language}.json`;
  const cardDbJson = await fetch(dbLocation)
    .then(response => response.json())
    .then(data => {
      console.log('Aggregate card data loaded.');
      return data;
    });

  return loadCardDb(cardDbJson);
}

function loadCardDb(json: any): BaseCard[] {
  return json.map((card: any) => parseDbCard(card));
}

function parseDbCard(json: any): BaseCard {
  return new BaseDbCard(json);
}

const cardDbContext = createContext<BaseCard[]>([]);

export function useCardDbContext() {
  return useContext(cardDbContext)
}

export const CardDbProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const cards = await fetchCardDb("en");
      setCards(cards);
      setLoading(false);
    }

    fetchCards();
  }, []);

  return (
    <cardDbContext.Provider value={cards}>
      {children}
    </cardDbContext.Provider>
  )
}
