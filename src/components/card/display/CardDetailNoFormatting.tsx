import {ReactNode} from "react";
import BaseDbCard from "../abstract/BaseDbCard.ts";
import CardTemplate from "../abstract/display/elements/CardTemplate.tsx";

export default function CardDetailNoFormatting({card, attrIcon}: { card: BaseDbCard, attrIcon?: string }): ReactNode {
  return (
    <div>
      <CardTemplate
        id={card.id}
        name={card.name}
        artSrc={card.art}
        infoLine={card.getInfoLine()}
        effectBlock={card.getEffectBlockNoFormatting()}
        cardKind={card.kind}
        cardSubKind={card.subKind}
        overrideArtSrc={true}
        statLine={card.getStatLine()}
        categoryLine={card.getCategoryLine()}
        isPendulum={card.isPendulum}
        copyTextDiscord={card.getCopyTextDiscordBasic()}
        attrIcon={attrIcon}
        linkArrows={card.linkArrows}
      />
    </div>
  )
}
