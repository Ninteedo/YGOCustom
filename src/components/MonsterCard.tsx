import "../style/Card.scss";
import {ReactNode} from "react";
import {CardArt} from "./CardArt.tsx";
import {Link} from "react-router-dom";
import {BaseCardProps} from "./BaseCard.tsx";
import {MonsterAttribute, MonsterAttributeImage} from "./CardEnums.ts";

export interface MonsterCardProps extends BaseCardProps {
  id: string;
  name: string;
  level: number;
  attribute: MonsterAttribute;
  type: string;
  art: string;
  categories: string[];
  effectRestrictions?: ReactNode;
  effects: ReactNode[];
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
  return <h4>Level {level} {attributeIconElement} {attribute} Monster</h4>;
}

function CategoriesList({categories}: { categories: string[] }): ReactNode {
  return (
    <h5 className="categories">[{categories.map(category => `${category}`).join(" / ")}]</h5>
  );
}

function EffectBlock({effectRestrictions, effects}: {
  effectRestrictions: ReactNode,
  effects: ReactNode[]
}): ReactNode {
  return (
    <div className="effect-block">
      <p>{effectRestrictions}</p>
      <ol className="effect-list">
        {effects.map((effect, index) => <li key={index}>{effect}</li>)}
      </ol>
    </div>
  );
}

function StatLine({atk, def}: { atk: number, def: number }): ReactNode {
  return (
    <div className="statline">
      <span><b>ATK</b>/{atk} <b>DEF</b>/{def}</span>
    </div>
  );
}

export function MonsterCard({
  id,
  name,
  level,
  attribute,
  type,
  art,
  categories,
  effectRestrictions,
  effects,
  atk,
  def,
}: MonsterCardProps) {
  const extendedCategories = [type];
  extendedCategories.push(...categories);
  return (
    <div className="card">
      <CardName name={name} id={id} link={true}/>
      <MonsterInfo level={level} attribute={attribute}/>
      <CardArt src={art} alt={`Art for ${name}`}/>
      <CategoriesList categories={extendedCategories}/>
      <hr/>
      <EffectBlock effectRestrictions={effectRestrictions} effects={effects}/>
      <StatLine atk={atk} def={def}/>
    </div>
  );
}
