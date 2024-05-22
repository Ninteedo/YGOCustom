import {MonsterCard} from "../../components/MonsterCard.tsx";
import {ContinuousEffect, EffectCondition, EffectCost, EffectMain, EffectText} from "../../components/EffectText.tsx";

import DragonmaidMarchebArt from "../../assets/images/DragonmaidMarcheb.png";
import React from "react";


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
          {EffectMain(<>Fusion Summon 1 Dragon Fusion Monster from your Extra Deck using monsters from your hand or
            field as material.</>)}
        </>
      ),
      EffectText(
        <>
          {EffectCondition(<>At the end of the Battle Phase</>)}
          {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 4 or lower
            "Dragonmaid" monster from your hand.</>)}
        </>
      )
    ],
    atk: 2800,
    def: 1800,
  };

  return <MonsterCard {...cardData} />;
};

export const DragonmaidMarchebNotes = () => {
  return (
    <>
      <p>
        Chamber Dragonmaid is the only one of the maids to lack a dragon form. This is quite surprising, considering how
        glaring the omission is, and how the maid-form was released in 2020.
      </p>
      <p>
        This card follows the same pattern as the other Dragon forms, with a continuous protection effect while you
        control a Fusion Monster, a discard effect, and an effect that returns itself to hand to summon a maid from the
        hand.
      </p>
      <p>
        The highest level maid should have the highest level dragon form, and so be the most powerful. This card has
        enhanced effects compared to the other Dragon forms. The protection effect also gives it battle destruction
        immunity. The return to hand summon can summon any maid, not just Chamber, similar to how Chamber can summon any
        dragon form.
      </p>
      <p>
        The discard effect is the one with the widest range of possible effects. It could be a search effect, something
        the archetype would greatly benefit from, and other players have suggested this. I opted for an additional
        way to Fusion Summon, as the deck relies heavily on Dragonmaid Changeover - a card that is not always accessible
        if the opponent disrupts the normal summon of a maid. As a quick effect, it could also be used to dodge
        targeting effects such as Infinite Impermanence. This has the potential to summon Dragonmaid Sheou on turn 1
        while going second, which is a powerful play, but requires 3 specific cards in hand, so should not be too
        problematic.
      </p>
    </>
  );
}

export default DragonmaidMarcheb
