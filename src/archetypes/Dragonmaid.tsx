import {CardAndNotes} from "../components/card/CardAndNotes.tsx";
import {YugipediaLink} from "../components/YugipediaLink.tsx";
import {Link} from "react-router-dom";
import CardElement from "../components/card/CardElement.tsx";

export default function DragonmaidArchetype() {
  return (
    <div>
      <h1>Dragonmaids Updated</h1>
      <p>
        Dragonmaid is a Fusion archetype that can be played as a midrange or control deck. It is characterised by
        its series of low-level maid-form monsters that provide great utility and resource generation, who can transform
        into their high-level dragon-form counterparts by returning themselves to the hand.&nbsp;
        {<YugipediaLink page={"Dragonmaid"} text={"Wiki page"}/>}
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
          is easily interrupted by most popular handtraps.
        </li>
        <li>Difficult to survive the first few turns, resource game is too long-term in the modern game.</li>
      </ul>
      <h2>Changes</h2>
      <h3>New Cards</h3>
      <CardAndNotes card={<CardElement id={"DragonmaidMarcheb"}/>} notes={<MarchebNotes/>}/>
      <h3>Revised Cards</h3>
      <CardAndNotes
        card={<>{<CardElement id={"DragonmaidNudyarl"}/>}{<CardElement id={"DragonmaidLorpar"}/>}</>}
        notes={<QuickEffectBigDragonNotes/>}/>
      <CardAndNotes card={<CardElement id={"HouseDragonmaid"}/>} notes={<HouseDragonmaidNotes/>}/>

    </div>
  )
}

function MarchebNotes() {
  return (
    <>
      <p>Chamber Dragonmaid is the only one of the maids to lack a dragon form. This is quite surprising, considering
        how glaring the omission is, and how the maid-form was released in 2020.</p>,
      <p>This card follows the same pattern as the other Dragon forms, with a continuous protection effect while you
        control a Fusion Monster, a discard effect, and an effect that returns itself to hand to summon a maid from the
        hand.</p>,
      <p>The highest level maid should have the highest level dragon form, and so be the most powerful. This card has
        enhanced effects compared to the other Dragon forms. The protection effect also gives it battle destruction
        immunity. The return to hand summon can summon any maid, not just Chamber, similar to how Chamber can summon any
        dragon form.</p>,
      <p>The discard effect is the one with the widest range of possible effects. It could be a search effect, something
        the archetype would greatly benefit from, and other players have suggested this. I opted for an additional way
        to Fusion Summon, as the deck relies heavily on Dragonmaid Changeover - a card that is not always accessible if
        the opponent disrupts the normal summon of a maid. As a quick effect, it could also be used to dodge targeting
        effects such as Infinite Impermanence. This has the potential to summon Dragonmaid Sheou on turn 1 while going
        second, which is a powerful play, but requires 3 specific cards in hand, so should not be too problematic.</p>
    </>
  );
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
