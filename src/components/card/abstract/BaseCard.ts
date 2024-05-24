import {ReactNode} from "react";

export interface BaseCard {
  id: string;
  name: string;
  art: string;

  toCardElement(): ReactNode;

  toCardDetail(): ReactNode;
}
