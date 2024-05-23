import {MonsterCard} from "../../components/MonsterCard.tsx";
import {EffectCondition, EffectCost, EffectMain, EffectText} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/Dragonmaid/HouseDragonmaid.webp";
import {MonsterAttribute} from "../../components/CardEnums.ts";

const HouseDragonmaid: React.FC = () => {
  const cardData = {
    id: "HouseDragonmaid",
    name: "House Dragonmaid",
    level: 9,
    attribute: MonsterAttribute.LIGHT,
    type: "Dragon",
    art: CardArt,
    categories: ["Fusion", "Effect"],
    effects: [
      EffectText(
        <>
          {EffectCondition(<>Once per turn, during the Standy Phase</>)}
          {EffectCost(<>You can target 1 other "Dragonmaid" monster you control</>)}
          {EffectMain(<>Special Summon 1 "Dragonmaid" monster from your hand or GY in Defense Position,
            whose Level is 1 higher or 1 lower than it.</>)}
        </>
      ),
      EffectText(
        <>
          {EffectCondition(<>If another face-up Dragon monster(s) you control returns to your hand
          (except during the Damage Step)</>)}
          {EffectCost(<>You can target 1 monster your opponent controls</>)}
          {EffectMain(<>destroy it.</>)}
        </>
      )
    ],
    atk: 3000,
    def: 2000,
  };

  return <MonsterCard {...cardData} />;
}

export default HouseDragonmaid
