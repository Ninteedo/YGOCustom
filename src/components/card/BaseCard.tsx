import '../../style/Card.scss';

export interface BaseCardProps {
  id: string;
  name: string;
  art: string;
  effectRestrictions?: EffectRestriction[];
  effects: Effect[];
}
