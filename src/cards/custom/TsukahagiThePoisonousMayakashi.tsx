import {MonsterCard} from "../../components/MonsterCard.tsx";
import {EffectCondition, EffectCost, EffectMain, EffectText} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/Mayakashi/TsukahagiThePoisonousMayakashi.webp";
import {MonsterAttribute} from "../../components/CardEnums.ts";

const TsukahagiThePoisonousMayakashi: React.FC = () => {
  const cardData = {
    id: "TsukahagiThePoisonousMayakashi",
    name: "Tsukahagi, the Poisonous Mayakashi",
    level: 2,
    attribute: MonsterAttribute.EARTH,
    type: "Zombie",
    art: CardArt,
    categories: ["Tuner", "Effect"],
    effectRestrictions: <>You can only control 1 card with this card's name.
      You can only use one of the (1), (2), or (3) effects of this card's name per turn, and only once that turn.</>,
    effects: [
      EffectText(<>
        {EffectCost(<>You can discard this card</>)}
        {EffectMain(<>take 1 "Mayakashi" Spell/Trap from your Deck, and either add it to your hand or send it to the GY.</>)}
      </>),
      EffectText(<>
        {EffectCondition(<>If a face-up "Mayakashi" Synchro or Link Monster you control leaves the field due to your
          opponent's card, and is not in the GY</>)}
        {EffectMain(<>You can Special Summon both this card and 1 "Mayakashi" Synchro or Link Monster from your GY,
          but banish this card when it leaves the field.</>)}
      </>),
      EffectText(<>
        {EffectCondition(<>If this card is banished</>)}
        {EffectMain(<>You can return 1 banished "Mayakashi" card to the GY, except "Tsukahagi, the Poisonous Mayakashi",
          then draw 1 card.</>)}
      </>),
    ],
    atk: 0,
    def: 2000,
  };

  return <MonsterCard {...cardData} />;
}
export default TsukahagiThePoisonousMayakashi
