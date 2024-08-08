import {ReactNode, useMemo} from "react";
import {cardDbContext, getCardDb} from "./cardDbUtility.ts";

export const CardDbProvider = ({ children }: { children: ReactNode }) => {
  const cards = useMemo(() => getCardDb(), []);

  return (
    <cardDbContext.Provider value={cards}>
      {children}
    </cardDbContext.Provider>
  )
}
