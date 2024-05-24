import {MonsterCard} from "../../components/card/MonsterCard.tsx";
import {
  ContinuousEffect,
  EffectCondition,
  EffectCost,
  EffectMain,
  QuickEffect,
  TriggerEffect,
} from "../../components/card/EffectText.tsx";

import CardArt from "../../assets/images/Dragonmaid/DragonmaidLorpar.webp";
import {MonsterAttribute} from "../../components/card/CardEnums.ts";

const DragonmaidLorpar: React.FC = () => {
  const cardData = {
    id: "DragonmaidLorpar",
    name: "Dragonmaid Lorpar",
    level: 8,
    attribute: MonsterAttribute.WIND,
    type: "Dragon",
    art: CardArt,
    categories: ["Effect"],
    effectRestrictions: <>You can only use the (2) and (3) effects of this card's name once per turn.
      You cannot activate the effects of monsters from the hand, except "Dragonmaid" monsters, the turn you activate
      the (2) effect of this card.</>,
    effects: [
      ContinuousEffect(<>Cannot be destroyed by card effects while you control a Fusion Monster.</>),
      QuickEffect(
        <>
          {EffectCondition(<>(Quick Effect)</>)}
          {EffectCost(<>You can discard this card, then target 1 face-up monster on the field</>)}
          {EffectMain(<>players cannot activate that target's effects on the
            field this turn.</>)}
        </>,
      ),
      TriggerEffect(
        <>
          {EffectCondition(<>At the end of the Battle Phase</>)}
          {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 3 "Dragonmaid"
            monster from your hand.</>)}
        </>,
      ),
    ],
    atk: 2700,
    def: 1700,
  };

  return <MonsterCard {...cardData} />;
}

export default DragonmaidLorpar
