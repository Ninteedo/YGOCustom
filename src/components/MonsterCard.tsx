import '../style/Card.scss';
import {ReactNode} from "react";
import {CardArt} from "./CardArt.tsx";
import {Link} from "react-router-dom";
import {BaseCardProps} from "./BaseCard.tsx";

export interface MonsterCardProps extends BaseCardProps {
  id: string;
  name: string;
  level: number;
  attribute: string;
  type: string;
  art: string;
  categories: string[];
  effectRestrictions: ReactNode;
  effects: ReactNode[];
  atk: number;
  def: number;
}

const MonsterCard: React.FC<MonsterCardProps> =
  ({
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
     def
   }) => {
    let extendedCategories = [type];
    extendedCategories.push(...categories);
    return (
      <div className="card">
        <h3 className="card-name"><Link to={`/card/custom/${id}`}>{name}</Link></h3>
        <h4>Level {level} {attribute} Monster</h4>
        <CardArt src={art} alt={`Art for ${name}`}/>
        <h5 className="categories">[{extendedCategories.map(category => `${category}`).join(' / ')}]</h5>
        <hr/>
        <div className="effect-block">
          <p>{effectRestrictions}</p>
          <ol className="effect-list">
            {effects.map((effect, index) => <li key={index}>{effect}</li>)}
          </ol>
        </div>
        <div className="statline">
          <span><b>ATK</b>/{atk} <b>DEF</b>/{def}</span>
        </div>
      </div>
    );
  };


export {MonsterCard}
