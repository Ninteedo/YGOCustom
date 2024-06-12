import {BaseCard} from "../BaseCard.ts";
import {ReactNode, useEffect, useState} from "react";
import {LoadingSpinner} from "../../LoadingSpinner.tsx";
import {cardDbContext, fetchCardDb} from "./cardDbUtility.ts";

export const CardDbProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await fetchCardDb("en", (loaded, total) => {
        setTotalSize(total);
        setProgress(loaded);
      });
      setCards(data);
      setLoading(false);
    }

    fetchCards();
  }, []);

  const percent = Math.round((progress / totalSize) * 100) || 0;

  if (loading) {
    return (
      <>
        <LoadingSpinner/>
        <div>Downloaded {Math.round(progress/1000)} of {Math.round(totalSize/1000)} KB ({percent}%)</div>
      </>
    );
  }

  return (
    <cardDbContext.Provider value={cards}>
      {children}
    </cardDbContext.Provider>
  )
}
