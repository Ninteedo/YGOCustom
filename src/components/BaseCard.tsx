import { ReactNode } from 'react';
import '../Card.scss';

export interface BaseCardProps {
  id: string;
  name: string;
  art: string;
  effectRestrictions?: ReactNode;
  effects: ReactNode[];
}
