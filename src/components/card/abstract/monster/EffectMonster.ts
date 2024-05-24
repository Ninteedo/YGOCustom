import {BaseMonsterCard} from "./BaseMonsterCard.ts";
import {EffectCard} from "../effect/EffectCard.ts";

export interface EffectMonster extends BaseMonsterCard, EffectCard {
}
