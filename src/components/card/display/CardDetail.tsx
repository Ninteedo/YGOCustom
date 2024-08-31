import {ReactNode} from "react";
import BaseDbCard from "../abstract/BaseDbCard.ts";
import CardTemplate from "../abstract/display/elements/CardTemplate.tsx";
import {useGetSettingsContext} from "../../settings/SettingsProvider.tsx";
import CardDetailNoFormatting from "./CardDetailNoFormatting.tsx";
import LimitedStatus from "./LimitedStatus.tsx";
import {CardKind} from "../abstract/CardKind.ts";
import {monsterAttributeImagePath} from "../abstract/monster/CardAttribute.tsx";
import {CardSubKind, getSpellTrapPropertyIconPath} from "../abstract/CardSubKind.ts";

export default function CardDetail({card}: { card: BaseDbCard }): ReactNode {
  const { settings } = useGetSettingsContext();

  if (settings.disableCardFormatting) {
    return CardDetailNoFormatting({card});
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

  return <div>
    <CardTemplate
      id={card.id}
      name={card.name}
      artSrc={card.art}
      infoLine={card.getInfoLine()}
      effectBlock={card.getEffectBlock()}
      cardKind={card.kind}
      cardSubKind={card.subKind}
      overrideArtSrc={true}
      statLine={card.getStatLine()}
      limitedStatus={LimitedStatus({card})}
      categoryLine={card.getCategoryLine()}
      isPendulum={card.isPendulum}
      copyTextDiscord={card.getCopyTextDiscordBasic()}
      attrIcon={attrIcon}
    />
  </div>
}
