import "../../../../style/Card.scss";
import {CardArt} from "../../CardArt.tsx";
import {BaseCardProps} from "../../BaseCard.tsx";
import {MonsterAttribute} from "./MonsterAttribute.ts";
import {MonsterType} from "./MonsterType.ts";
import {MonsterCategory} from "./MonsterCategory.ts";
import EffectRestriction from "../effect/EffectRestriction.tsx";
import Effect from "../effect/Effect.tsx";
import CardName from "./elements/CardName.tsx";
import MonsterInfo from "./elements/MonsterInfo.tsx";
import StatLine from "./elements/StatLine.tsx";
import EffectBlock from "./elements/EffectBlock.tsx";
import CategoriesList from "./elements/CategoriesList.tsx";

export interface MonsterCardProps extends BaseCardProps {
  id: string;
  name: string;
  level: number;
  attribute: MonsterAttribute;
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
  effectRestrictions,
  effects,
  atk,
  def,
}: MonsterCardProps, cardKind: string, cardSubKind: string) {
  const extendedCategories = monsterType.map(type => type.toString());
  extendedCategories.push(...categories.map(category => category.toString()));
  return (
    <div className={["card", "card-" + cardKind, "card-" + cardSubKind].join(" ")} data-card-id={id}>
      <div className={"card-content"}>
        <div className={"card-header"}>
          <CardName name={name} id={id} link={true}/>
          <MonsterInfo level={level} attribute={attribute}/>
          <CardArt src={art} alt={`Art for ${name}`}/>
          <CategoriesList categories={extendedCategories}/>
        </div>
        <EffectBlock materials={materials} effectRestrictions={effectRestrictions} effects={effects} cardId={id}/>
        <StatLine atk={atk} def={def}/>
      </div>
    </div>
  );
}
