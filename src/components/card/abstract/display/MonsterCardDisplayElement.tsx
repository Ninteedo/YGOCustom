import "../../../../style/Card.scss";
import {BaseCardProps} from "../../BaseCard.tsx";
import {CardAttribute} from "../monster/CardAttribute.ts";
import {MonsterType} from "../monster/MonsterType.ts";
import {MonsterCategory} from "../monster/MonsterCategory.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import Effect from "../effect/Effect.tsx";
import MonsterInfo from "./elements/MonsterInfo.tsx";
import StatLine from "./elements/StatLine.tsx";
import EffectBlock from "./elements/EffectBlock.tsx";
import CategoriesList from "./elements/CategoriesList.tsx";
import CardTemplate from "./elements/CardTemplate.tsx";

export interface MonsterCardProps extends BaseCardProps {
  id: string;
  name: string;
  level: number;
  attribute: CardAttribute;
  monsterType: MonsterType[];
  art: string;
  categories: MonsterCategory[];
  materials?: string;
  effectRestrictions: EffectRestriction[];
  effects: Effect[];
  atk: number;
  def: number;
}

export function MonsterCard({
  id,
  name,
  level,
  attribute,
  monsterType,
  art,
  categories,
  materials,
  effects,
  atk,
  def,
}: MonsterCardProps, cardKind: string, cardSubKind: string) {
  const extendedCategories = monsterType.map(type => type.toString());
  extendedCategories.push(...categories.map(category => category.toString()));

  const infoLine = <MonsterInfo level={level} attribute={attribute}/>;
  const categoriesLine = <CategoriesList categories={extendedCategories}/>;
  const effectBlock = <EffectBlock materials={materials} effects={effects}
                                   cardId={id}/>;
  const statLine = <StatLine atk={atk} def={def}/>;
  return <CardTemplate id={id} name={name} artSrc={art} infoLine={infoLine} effectBlock={effectBlock}
                       cardKind={cardKind} cardSubKind={cardSubKind} categoryLine={categoriesLine}
                       statLine={statLine}/>;
}
