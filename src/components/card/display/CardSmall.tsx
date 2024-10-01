import {CardArt} from "../CardArt.tsx";
import "../../../style/CardSmall.scss";
import BaseDbCard from "../abstract/BaseDbCard.ts";
import React, {useState} from "react";
import CardHoverPreview from "./CardHoverPreview.tsx";
import {CardKind} from "../abstract/CardKind.ts";
import {monsterAttributeImagePath} from "../abstract/monster/CardAttribute.tsx";
import {CardSubKind, getSpellTrapPropertyIconPath} from "../abstract/CardSubKind.ts";
import {AttributeIcon} from "./AttributeIcon.tsx";
import {LinkArrow} from "./link/LinkArrow.ts";

interface CardSmallProps {
  card: BaseDbCard;
  clickAction?: () => void;
  isPendulum?: boolean;
}

export default function CardSmall({card, clickAction}: CardSmallProps) {
  const [isHovering, setIsHovering] = useState(false);
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
  if (card.isPendulum) {
    rootClasses.push("card-pendulum");
  }

  let attrIcon;
  if (card.kind === CardKind.MONSTER) {
    const attribute = card.getAttribute();
    if (attribute) {
      attrIcon = monsterAttributeImagePath(attribute);
    }
  } else {
    if (card.subKind !== CardSubKind.NORMAL) {
      attrIcon = getSpellTrapPropertyIconPath(card.subKind);
    }
  }

  return (
    <>
      <div
        className={rootClasses.join(" ")}
        data-card-id={id}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={"card-content"}>
          <div className={"card-header"}>
            <SmallCardName name={name}/>
            {attrIcon && <AttributeIcon src={attrIcon}/>}
          </div>
          <SmallCardArt name={name} art={art} linkArrows={card.linkArrows}/>
        </div>
      </div>
      {(isHovering) && (
        <CardHoverPreview card={card} mousePos={mousePos} />
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

function SmallCardArt({name, art, linkArrows}: { name: string, art: string, linkArrows?: LinkArrow[] }) {
  return <CardArt src={art} alt={`Art for ${name}`} linkArrows={linkArrows}/>
}
