import {MonsterCard} from "../../components/MonsterCard.tsx";
import {EffectCondition, EffectMain, EffectText} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/Mayakashi/OboroGurumaTheWheeledMayakashi.webp";
import {MonsterAttribute} from "../../components/CardEnums.ts";

const OboroGurumaTheWheeledMayakashi: React.FC = () => {
  const cardData = {
    id: "OboroGurumaTheWheeledMayakashi",
    name: "Oboro-Guruma, the Wheeled Mayakashi",
    level: 3,
    attribute: MonsterAttribute.EARTH,
    type: "Zombie",
    art: CardArt,
    categories: ["Synchro", "Effect"],
    effectRestrictions: <>You can only control 1 card with this name.
      You can only use the (1) and (2) effects of this card's name once per turn.</>,
    effects: [
      EffectText(<>
        {EffectCondition(<>If a Synchro Monster you control whose original Level is 5 is destroyed by battle
          or an opponent's card effect while this card is in the GY</>)}
        {EffectMain(<>You can banish 1 other Zombie monster from your GY, and if you do, Special Summon this card.</>)}
      </>),
      EffectText(<>
          {EffectCondition(<>If this card is Special Summoned from the GY</>)}
          {EffectMain(<>You can draw 2 cards, then discard 1 card, then, if that discarded card was a "Mayakashi" card
            you can apply this effect:
            <ul>
              <li>Your monsters cannot be destroyed by battle for the rest of this turn.</li>
            </ul>
          </>)}
        </>,
      ),
    ],
    atk: 800,
    def: 2100,
  };

  return <MonsterCard {...cardData} />;
}
export default OboroGurumaTheWheeledMayakashi
