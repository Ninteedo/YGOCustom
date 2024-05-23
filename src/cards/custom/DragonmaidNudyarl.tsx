import {MonsterCard} from "../../components/MonsterCard.tsx";
import {
  ContinuousEffect,
  EffectCondition,
  EffectCost,
  EffectMain,
  QuickEffect,
  TriggerEffect,
} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/Dragonmaid/DragonmaidNudyarl.webp";
import {MonsterAttribute} from "../../components/CardEnums.ts";

const DragonmaidNudyarl: React.FC = () => {
  const cardData = {
    id: "DragonmaidNudyarl",
    name: "Dragonmaid Nudyarl",
    level: 7,
    attribute: MonsterAttribute.WATER,
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
          {EffectCost(<>You can discard this card, then target 1 monster in either GY</>)}
          {EffectMain(<>shuffle it into the Deck.</>)}
        </>,
      ),
      TriggerEffect(
        <>
          {EffectCondition(<>At the end of the Battle Phase</>)}
          {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 2 "Dragonmaid"
            monster from your hand.</>)}
        </>,
      ),
    ],
    atk: 2600,
    def: 1600,
  };

  return <MonsterCard {...cardData} />;
}

export default DragonmaidNudyarl
