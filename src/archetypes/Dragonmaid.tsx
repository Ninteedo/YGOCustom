import DragonmaidMarcheb, {DragonmaidMarchebNotes} from "../cards/custom/DragonmaidMarcheb.tsx";
import DragonmaidNudyarl from "../cards/custom/DragonmaidNudyarl.tsx";
import DragonmaidLorpar from "../cards/custom/DragonmaidLorpar.tsx";
import {CardAndNotes} from "../components/CardAndNotes.tsx";
import {YugipediaLink} from "../components/YugipediaLink.tsx";
import {Link} from "react-router-dom";
import HouseDragonmaid from "../cards/custom/HouseDragonmaid.tsx";

export default function DragonmaidArchetype() {
  return (
    <div>
      <h1>Dragonmaids Updated</h1>
      <p>
        Dragonmaid is a Fusion archetype that can be played as a midrange or control deck. It is characterised by
        its series of low-level maid-form monsters that provide great utility and resource generation, who can transform
        into their high-level dragon-form counterparts by returning themselves to the hand.&nbsp;
        {<YugipediaLink page={"Dragonmaid"} text={"Wiki page"} />}
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
      <CardAndNotes card={<DragonmaidMarcheb/>} notes={<DragonmaidMarchebNotes/>} />
      <h3>Revised Cards</h3>
      <CardAndNotes card={<><DragonmaidNudyarl/><DragonmaidLorpar/></>} notes={<QuickEffectBigDragonNotes/>} />
      <CardAndNotes card={<HouseDragonmaid/>} notes={<HouseDragonmaidNotes/>} />

    </div>
  )
}

function QuickEffectBigDragonNotes() {
  const lorparRulingUrl = "https://www.db.yugioh-card.com/yugiohdb/faq_search.action?ope=5&fid=22769&request_locale=ja"

  return (
    <>
      <p>
        Both Nudyarl and Lorpar have decent discard effects, but their usefulness is sorely limited by their
        sluggishness. With the game's recent emphasis on interacting with your opponent from the hand, particularly
        while going second on your opponent's first turn, it makes sense to transform these cards into handtraps.
      </p>
      <p>
        Nudyarl's effect to shuffle a card from the GY into the Deck is similar to D.D. Crow, and arguably even better,
        since some cards can have effects or be accessed more easily when banished rather than being face-down in the
        Deck.
      </p>
      <p>
        Lorpar's effect prevents the targeted monster from activating its effects for the rest of the turn after it
        resolves. This is generally worse than negating a monster's effects, since it has to be used preemptively and
        is not useful against quick effects or effects that have already triggered, such as on-summon effects. As an
        upside, since it affects players, it can prevent unaffected monsters from activating their effects
        (<Link to={lorparRulingUrl}>ruling</Link>).
      </p>
      <p>
        To prevent these from being used as handtraps in every other deck, an additional restriction where the player
        cannot activate the effects of non-Dragonmaid monsters from the hand was added. This prevents players from using
        these cards in conjunction with other popular handtraps such as Ash Blossom or Effect Veiler.
      </p>
    </>
  );
}

function HouseDragonmaidNotes() {
  return (
    <p>The change is simply replacing the "when" condition in the (2) effect with an "if" condition, so that it doesn't
    miss timing when using Dragonmaid Tidying.</p>
  )
}
