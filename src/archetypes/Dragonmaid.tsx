import React from "react";
import DragonmaidMarcheb from "../cards/custom/DragonmaidMarcheb.tsx";
import DragonmaidNudyarl from "../cards/custom/DragonmaidNudyarl.tsx";
import DragonmaidLorpar from "../cards/custom/DragonmaidLorpar.tsx";

const DragonmaidArchetype: React.FC = () => {
  return (
    <div>
      <h1>Dragonmaids Updated</h1>
      <p>
        Dragonmaid is a Fusion archetype that can be played as a midrange or control deck. It is characterised by
        its series of low-level maid-form monsters that provide great utility and resource generation, who can transform
        into their high-level dragon-form counterparts by returning themselves to the hand.
      </p>
      <h2>Background</h2>
      <h3>Themes</h3>
      <ul>
        <li>Maid-form monsters with Dragon-form counterparts.</li>
        <li>Return cards (both own and the opponent's) to the hand.</li>
        <li>Strong resource recursion from the graveyard.</li>
        <li>Fusion Summoning.</li>
      </ul>
      <h3>Limitations</h3>
      <ul>
        <li>Only has a single relevant Fusion Monster to summon - Dragonmaid Sheou.</li>
        <li>Only one Fusion Spell, and reliant on opening the materials required. Access to Dragonmaid Changeover
        is easily interrupted by most popular handtraps.</li>
        <li>Difficult to survive the first few turns, resource game is too long-term in the modern game.</li>
      </ul>
      <h2>Changes</h2>
      <h3>New Cards</h3>
      <DragonmaidMarcheb />
      <h3>Revised Cards</h3>
      <DragonmaidNudyarl />
      <DragonmaidLorpar />
    </div>
  )
}

export default DragonmaidArchetype
