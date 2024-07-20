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
  cardKind: string;
  cardSubKind: string;
  overrideArtSrc?: boolean;
  isPendulum?: boolean;
}

export default function CardTemplate({
  id,
  name,
  artSrc,
  infoLine,
  categoryLine,
  effectBlock,
  statLine,
  cardKind,
  cardSubKind,
  overrideArtSrc,
  isPendulum
}: CardTemplateProps) {
  const classes = ["card", "card-" + cardKind.toLowerCase(), "card-" + cardSubKind.toLowerCase()];
  if (isPendulum) {
    classes.push("card-pendulum");
  }
  return (
    <div className={classes.join(" ")} data-card-id={id}>
      <div className={"card-content"}>
        <div className={"card-header"}>
          <CardName name={name} id={id} link={false}/>
          {infoLine}
          <CardArt src={artSrc} alt={`Art for ${name}`} overrideLink={overrideArtSrc} canExpand={true}/>
          {categoryLine}
        </div>
        {effectBlock}
        {statLine}
      </div>
    </div>
  );
}
