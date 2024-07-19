import {CardArt} from "../CardArt.tsx";
import "../../../style/CardSmall.scss";
import {BaseCard} from "../abstract/BaseCard.ts";
import React, {useState} from "react";
import CardHoverPreview from "./CardHoverPreview.tsx";

interface CardSmallProps {
  card: BaseCard;
  clickAction?: () => void;
}

export default function CardSmall({card, clickAction}: CardSmallProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});

  const {id, name, art, kind, subKind} = card;

  const handleClick = () => {
    if (clickAction) {
      clickAction();
    }
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePos({x: e.clientX, y: e.clientY});
    setIsHovering(true);
  };
  const handleMouseLeave = () => setIsHovering(false);

  const rootClasses = ["card", "card-small", `card-${kind.toLowerCase()}`, `card-${subKind.toLowerCase()}`];
  if (clickAction) {
    rootClasses.push("has-click-action");
  }

  return (
    <>
    <div
      className={rootClasses.join(" ")}
      data-card-id={id}
      onClick={handleClick}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
    >
      <div className={"card-content"}>
        <SmallCardName name={name}/>
        <SmallCardArt name={name} art={art}/>
      </div>
    </div>
      {(isHovering) && (
        <CardHoverPreview card={card} setIsHovering={setIsHoveringPreview} mousePos={mousePos}/>
      )}
    </>
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
