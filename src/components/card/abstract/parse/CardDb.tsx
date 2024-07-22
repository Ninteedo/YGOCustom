import {ReactNode, useEffect, useState} from "react";
import {LoadingSpinner} from "../../LoadingSpinner.tsx";
import {cardDbContext, fetchCardDb} from "./cardDbUtility.ts";
import BaseDbCard from "../BaseDbCard.tsx";

export const CardDbProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<BaseDbCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalSize, setTotalSize] = useState<number | null>(null);
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

  let loadingDiv;

  if (totalSize !== null) {
    const percent = Math.round((progress / totalSize) * 100) || 0;
    loadingDiv = <div>Downloaded {Math.round(progress/1000)} of {Math.round(totalSize/1000)} KB ({percent}%)</div>;
  } else {
    loadingDiv = <div>Downloaded {Math.round(progress/1000)} KB...</div>;
  }
  if (loading) {
    return (
      <>
        <LoadingSpinner/>
        {loadingDiv}
      </>
    );
  }

  return (
    <cardDbContext.Provider value={cards}>
      {children}
    </cardDbContext.Provider>
  )
}
