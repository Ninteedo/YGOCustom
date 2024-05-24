import { ReactNode } from 'react';
import '../../style/Card.scss';

export interface BaseCardProps {
  id: string;
  name: string;
  art: string;
  effectRestrictions?: ReactNode;
  effects: ReactNode[];
}
