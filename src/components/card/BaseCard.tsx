import '../../style/Card.scss';
import EffectRestriction from "./abstract/effect/EffectRestriction.tsx";
import Effect from "./abstract/effect/Effect.tsx";

export interface BaseCardProps {
  id: string;
  name: string;
  art: string;
  effectRestrictions?: EffectRestriction[];
  effects: Effect[];
}
