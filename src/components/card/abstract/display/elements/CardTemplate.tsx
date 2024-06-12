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
  overrideArtSrc?: boolean
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
  overrideArtSrc
}: CardTemplateProps) {
  return (
    <div className={["card", "card-" + cardKind, "card-" + cardSubKind].join(" ")} data-card-id={id}>
      <div className={"card-content"}>
        <div className={"card-header"}>
          <CardName name={name} id={id} link={true}/>
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
