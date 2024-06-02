import {CardArt} from "../CardArt.tsx";
import "../../../style/CardSmall.scss";

interface CardSmallProps {
  id: string;
  name: string;
  art: string;
  cardKind: string;
  cardSubKind: string;
  clickAction?: () => void;
}

export default function CardSmall({id, name, art, cardKind, cardSubKind, clickAction}: CardSmallProps) {
  const handleClick = () => {
    if (clickAction) {
      clickAction();
    }
  }

  let rootClasses = ["card", "card-small", `card-${cardKind}`, `card-${cardSubKind}`];
  if (clickAction) {
    rootClasses.push("has-click-action");
  }

  return (
    <div className={rootClasses.join(" ")} data-card-id={id} onClick={handleClick}>
      <div className={"card-content"}>
        <SmallCardName name={name}/>
        <SmallCardArt name={name} art={art}/>
      </div>
    </div>
  )
}

function SmallCardName({name}: { name: string }) {
  return (
    <div className={"card-name"}>
      {name}
    </div>
  )
}

function SmallCardArt({name, art}: { name: string, art: string }) {
  return <CardArt src={art} alt={`Art for ${name}`}/>
}
