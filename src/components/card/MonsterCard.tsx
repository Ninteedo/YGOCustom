import "../../style/Card.scss";
import {ReactNode} from "react";
import {Link} from "react-router-dom";
import {CardArt} from "./CardArt.tsx";
import {BaseCardProps} from "./BaseCard.tsx";
import {MonsterAttribute, MonsterAttributeImage} from "./abstract/monster/MonsterAttribute.ts";
import {MonsterType} from "./abstract/monster/MonsterType.ts";
import {MonsterCategory} from "./abstract/monster/MonsterCategory.ts";
import EffectRestriction from "./abstract/effect/EffectRestriction.ts";
import Effect from "./abstract/effect/Effect.tsx";

export interface MonsterCardProps extends BaseCardProps {
  id: string;
  name: string;
  level: number;
  attribute: MonsterAttribute;
  monsterType: MonsterType[];
  art: string;
  categories: MonsterCategory[];
  effectRestrictions: EffectRestriction[];
  effects: Effect[];
  atk: number;
  def: number;
}

function CardName({name, id, link}: { name: string, id: string, link: boolean }): ReactNode {
  const inner = link ? <Link to={`/card/custom/${id}`}>{name}</Link> : name;
  return <h3 className="card-name">{inner}</h3>;
}

function MonsterInfo({level, attribute}: { level: number, attribute: MonsterAttribute }): ReactNode {
  const attributeIcon = MonsterAttributeImage(attribute);
  const attributeIconElement = <img className={"attribute-icon"} src={attributeIcon} alt={attribute + " icon"}/>;
  return <h4 className={"monster-info"}>Level {level} {attributeIconElement} {attribute} Monster</h4>;
}

function CategoriesList({categories}: { categories: string[] }): ReactNode {
  return (
    <h5 className="categories">[{categories.map(category => `${category}`).join(" / ")}]</h5>
  );
}

function EffectBlock({effectRestrictions, effects, cardId}: {
  effectRestrictions: EffectRestriction[],
  effects: Effect[],
  cardId: string,
}): ReactNode {
  return (
    <div className="effect-block">
      <p>{effectRestrictions.map(r => r.toString())}</p>
      <ol className="effect-list">
        {effects.map((effect, index) => <li key={effectKey(cardId, index)}>{effect.render()}</li>)}
      </ol>
    </div>
  );
}

function effectKey(cardId: string, index: number): string {
  return `${cardId}-effect-${index}`;
}

function StatLine({atk, def}: { atk: number, def: number }): ReactNode {
  return (
    <div className="statline">
      <span><span><b>ATK</b>/{atk}</span>&nbsp;<span><b>DEF</b>/{def}</span></span>
    </div>
  );
}

export function MonsterCard({
  id,
  name,
  level,
  attribute,
  monsterType,
  art,
  categories,
  effectRestrictions,
  effects,
  atk,
  def,
}: MonsterCardProps) {
  const extendedCategories = monsterType.map(type => type.toString());
  extendedCategories.push(...categories.map(category => category.toString()));
  return (
    <div className="card">
      <CardName name={name} id={id} link={true}/>
      <MonsterInfo level={level} attribute={attribute}/>
      <CardArt src={art} alt={`Art for ${name}`}/>
      <CategoriesList categories={extendedCategories}/>
      <hr/>
      <EffectBlock effectRestrictions={effectRestrictions} effects={effects} cardId={id}/>
      <hr/>
      <StatLine atk={atk} def={def}/>
    </div>
  );
}
