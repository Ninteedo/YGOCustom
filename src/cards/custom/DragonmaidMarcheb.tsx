import {MonsterCard} from "../../components/MonsterCard.tsx";
import {ContinuousEffect, EffectCondition, EffectCost, EffectMain, EffectText} from "../../components/EffectText.tsx";

import DragonmaidMarchebArt from "../../assets/images/DragonmaidMarcheb.png";


const DragonmaidMarcheb: React.FC = () => {
  const cardData = {
    id: "DragonmaidMarcheb",
    name: "Dragonmaid Marcheb",
    level: 9,
    attribute: "DARK",
    type: "Dragon",
    art: DragonmaidMarchebArt,
    categories: ["Effect"],
    effectRestrictions: <>You can only use the (2) and (3) effects of this card's name once per turn.</>,
    effects: [
      ContinuousEffect(<>Cannot be destroyed by battle or card effects while you control a Fusion Monster.</>),
      EffectText(
        <>
          {EffectCondition(<>Quick Effect</>)}
          {EffectCost(<>You can discard this card</>)}
          {EffectMain(<>Fusion Summon 1 Dragon Fusion Monster from your Extra Deck using monsters from your hand or field as material.</>)}
        </>
      ),
      EffectText(
        <>
          {EffectCondition(<>At the end of the Battle Phase</>)}
          {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 4 or lower "Dragonmaid" monster from your hand.</>)}
        </>
      )
    ],
    atk: 2800,
    def: 1800,
  };

  return <MonsterCard {...cardData} />;
};

export default DragonmaidMarcheb
