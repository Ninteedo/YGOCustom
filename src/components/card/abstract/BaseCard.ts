import {ReactNode} from "react";

export interface BaseCard {
  id: string;
  name: string;
  art: string;

  toCardDetail(): ReactNode;
}
