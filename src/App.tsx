import './App.css'
import {MonsterCard} from "./assets/Card.tsx";
import {ContinuousEffect, EffectCondition, EffectCost, EffectMain, EffectText} from "./assets/EffectText.tsx";
import DragonmaidMarchebArt from "./assets/images/comm0124.png";

function DragonmaidMarcheb() {
  return MonsterCard(
    "Dragonmaid Marcheb", 9, "DARK", "Dragon", DragonmaidMarchebArt,
    ["Effect"], "You can only use the (2) and (3) effects of this card's name once per turn.",
    [
      ContinuousEffect(<p>Cannot be destroyed by battle or card effects while you control a Fusion Monster.</p>),
      EffectText(<>
        {EffectCondition(<>(Quick Effect)</>)}
        {EffectCost(<>You can discard this card</>)}
        {EffectMain(<>Fusion Summon 1 Dragon Fusion Monster from your Extra Deck using monsters from your hand or field as material.</>)}</>),
      EffectText(<>{EffectCondition(<>At the end of the Battle Phase</>)}
        {EffectMain(<>You can return this card to the hand, and if you do, Special Summon 1 Level 4 or lower "Dragonmaid" monster from your hand.</>)}</>)
    ], 2800, 1800);
}

function App() {
  return (
    <>
      <DragonmaidMarcheb />
    </>
  )
}

export default App
