import {MonsterCard} from "../../components/MonsterCard.tsx";
import {EffectCondition, EffectMain, EffectText} from "../../components/EffectText.tsx";

import CardArt from "../../assets/images/Mayakashi/GashadokuroTheSkeletalMayakashi.webp";
import {MonsterAttribute} from "../../components/CardEnums.ts";

const GashadokuroTheSkeletalMayakashi: React.FC = () => {
  const cardData = {
    id: "GashadokuroTheSkeletalMayakashi",
    name: "Gashadokuro, the Skeletal Mayakashi",
    level: 11,
    attribute: MonsterAttribute.DARK,
    type: "Zombie",
    art: CardArt,
    categories: ["Synchro", "Effect"],
    effectRestrictions: <>You can only control 1 card with this name.
      You can only use the (1) and (2) effects of this card's name once per turn.</>,
    effects: [
      EffectText(<>
        {EffectCondition(<>If a Link Monster you control is destroyed by battle
          or an opponent's card effect while this card is in the GY</>)}
        {EffectMain(<>You can banish 1 other Zombie monster from your GY, and if you do, Special Summon this card.</>)}
      </>),
      EffectText(<>
          {EffectMain(<>For the rest of the turn after this card is Special Summoned from the GY, this face-up card
          is unaffected by other cards' effects and can make a second attack on monsters during each Battle Phase.</>)}
        </>,
      ),
    ],
    atk: 3300,
    def: 2600,
  };

  return <MonsterCard {...cardData} />;
}
export default GashadokuroTheSkeletalMayakashi
