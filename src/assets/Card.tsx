import '../Card.scss';
import {ReactNode} from "react";
import {CardArt} from "./CardArt.tsx";

function MonsterCard(name: string, level: number, attribute: string, type: string, art: string, categories: string[],
                     effectRestrictions: ReactNode, effects: ReactNode[], atk: number, def: number) {
  categories.unshift(type);
  return (
    <div className={"card"}>
      <h3 className={"card-name"}>{name}</h3>
      <h4>Level {level} {attribute} Monster</h4>
      <CardArt src={art} alt={`Art for ${name}`} />
      <h5 className={"categories"}>[{categories.map(category => `${category}`).join(" / ")}]</h5>
      <hr />
      <div className={"effect-block"}>
        <p>{effectRestrictions}</p>
        <ol className={"effect-list"}>
          {effects.map((effect, index) => <li key={index}>{effect}</li>)}
        </ol>
      </div>
      <div className={"statline"}>
        <span><b>ATK</b>/{atk} <b>DEF</b>/{def}</span>
      </div>
    </div>
  );
}


export { MonsterCard }
