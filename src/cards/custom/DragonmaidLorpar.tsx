import {MonsterCard} from "../../components/MonsterCard.tsx";
import {ContinuousEffect, EffectCondition, EffectCost, EffectMain, EffectText} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/DragonmaidLorpar.png";

const DragonmaidLorpar: React.FC = () => {
  const cardData = {
    id: "DragonmaidLorpar",
    name: "Dragonmaid Lorpar",
    level: 8,
    attribute: "WIND",
    type: "Dragon",
    art: CardArt,
    categories: ["Effect"],
    effectRestrictions: <>You can only use the (2) and (3) effects of this card's name once per turn.</>,
    effects: [
      ContinuousEffect(<>Cannot be destroyed by card effects while you control a Fusion Monster.</>),
      EffectText(
        <>
          {EffectCondition(<>Quick Effect</>)}
          {EffectCost(<>You can discard this card</>)}
          {EffectMain(<>target 1 face-up monster on the field; players cannot activate that target's effects on the
            field this turn.</>)}
        </>
      ),
      EffectText(
        <>
          {EffectCondition(<>At the end of the Battle Phase</>)}
          {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 3 "Dragonmaid"
            monster from your hand.</>)}
        </>
      )
    ],
    atk: 2700,
    def: 1700,
  };

  return <MonsterCard {...cardData} />;
}

export default DragonmaidLorpar
