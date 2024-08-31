import CardName from "./CardName.tsx";
import {CardArt} from "../../../CardArt.tsx";
import {ReactNode} from "react";

interface CardTemplateProps {
  id: string;
  name: string;
  artSrc: string;
  infoLine: ReactNode;
  categoryLine?: ReactNode;
  effectBlock: ReactNode;
  statLine?: ReactNode;
  limitedStatus?: ReactNode;
  cardKind: string;
  cardSubKind: string;
  overrideArtSrc?: boolean;
  isPendulum?: boolean;
  copyTextDiscord?: string;
  attrIcon?: string;
}

export default function CardTemplate({
  id,
  name,
  artSrc,
  infoLine,
  categoryLine,
  effectBlock,
  statLine,
  limitedStatus,
  cardKind,
  cardSubKind,
  overrideArtSrc,
  isPendulum,
  attrIcon,
}: CardTemplateProps) {
  const classes = ["card", "card-" + cardKind.toLowerCase(), "card-" + cardSubKind.toLowerCase()];
  if (isPendulum) {
    classes.push("card-pendulum");
  }
  return (
    <div className={classes.join(" ")} data-card-id={id}>
      <div className={"card-content"}>
        <div className={"card-header"}>
          <div className={"name-row"}>
            <CardName name={name} id={id} link={false}/>
            {attrIcon && <img src={attrIcon} className={"attribute-icon"} />}
          </div>
          {infoLine}
          <CardArt src={artSrc} alt={`Art for ${name}`} overrideLink={overrideArtSrc} canExpand={true}/>
          {categoryLine}
        </div>
        {effectBlock}
        <div className={"card-footer"}>
          {limitedStatus}
          {statLine}
        </div>
      </div>
    </div>
  );
}
