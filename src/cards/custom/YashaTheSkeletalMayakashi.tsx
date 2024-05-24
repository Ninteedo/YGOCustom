import {MonsterCard} from "../../components/card/MonsterCard.tsx";
import {
  ContinuousEffect,
  EffectCondition,
  EffectCost,
  EffectMain,
  IgnitionEffect,
  TriggerEffect,
} from "../../components/card/EffectText.tsx";

import CardArt from "../../assets/images/Mayakashi/YaskaTheSkeletalMayakashi.webp";
import {MonsterAttribute} from "../../components/card/abstract/monster/MonsterAttribute.ts";

const YashaTheSkeletalMayakashi: React.FC = () => {
  const cardData = {
    id: "YashaTheSkeletalMayakashi",
    name: "Yasha, the Skeletal Mayakashi",
    level: 5,
    attribute: MonsterAttribute.DARK,
    type: "Zombie",
    art: CardArt,
    categories: ["Effect"],
    effectRestrictions: <>You can only use the (2) and (3) effects of this card's name once per turn.</>,
    effects: [
      ContinuousEffect(<>You cannot Special Summon monsters from the Extra Deck, except "Mayakashi" monsters.</>),
      IgnitionEffect(<>
        {EffectCost(<>You can discard 1 other card</>)}
        {EffectMain(<>Special Summon this card from your hand or GY, then if you discarded a "Mayakashi" card to
          activate this effect, you can draw 1 card.</>)}
      </>),
      TriggerEffect(<>
          {EffectCondition(<>If this card is Normal or Special Summoned</>)}
          {EffectMain(<>You can send 1 "Mayakashi" monster from your Deck to the GY, or if your opponent controls a
            monster, you can add it to your hand instead.</>)}
        </>,
      ),
    ],
    atk: 2000,
    def: 0,
  };

  return <MonsterCard {...cardData} />;
}
export default YashaTheSkeletalMayakashi
