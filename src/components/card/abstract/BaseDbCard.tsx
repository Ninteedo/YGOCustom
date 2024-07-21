import {BaseCard} from "./BaseCard.ts";
import React, {Fragment, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";
import EffectBlock from "./display/elements/EffectBlock.tsx";
import {parseEffects} from "./parse/parseEffects.ts";
import {CardKind, isSpellTrapCard, readCardKind} from "./CardKind.ts";
import {CardSubKind, isContinuousLike, isExtraDeck, readCardSubKind} from "./CardSubKind.ts";
import PendulumEffectBlock from "./display/elements/PendulumEffectBlock.tsx";
import {parsePendulumText} from "./parse/parsePendulum.ts";
import NormalEffectLore from "./effect/NormalEffectLore.tsx";
import {getMonsterSpecialKinds} from "./MonsterSpecialKind.ts";
import {CardJsonEntry} from "../../../dbCompression.ts";

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  private readonly json: CardJsonEntry;

  constructor(json: any) {
    const cardEntry = new CardJsonEntry(json, true);

    const id = cardEntry.id;
    const name = cardEntry.name;
    const artSrc = getBucketImageLink(cardEntry.imageId);
    const cardKind = getDbCardKind(cardEntry);
    const subKind = getDbCardSubKind(cardEntry);

    const isPendulum = cardEntry.type.toLowerCase().includes("pendulum");

    super(id, name, artSrc, cardKind, subKind, isPendulum);

    this.text = cardEntry.desc;
    this.json = cardEntry;
  }

  toCardDetail(): React.ReactNode {
    return this.toElement();
  }

  toCardElement(): React.ReactNode {
    return this.toElement();
  }

  toText(): string {
    return `${this.id}\n${this.name}\n${this.text}`
  }

  getLinkUrl(): string {
    return `/card/official/${this.id}`
  }

  protected getInfoLine(): ReactNode {
    switch (this.kind) {
      case CardKind.MONSTER:
        return <p>{getLevelName(this.subKind, this.json)} {this.json.attribute} Monster</p>
      case CardKind.SPELL:
        return <p>{this.subKind} Spell</p>
      case CardKind.TRAP:
        return <p>{this.subKind} Trap</p>
      default:
        return <p>Unknown</p>
    }
  }

  protected getCategoryLine(): ReactNode {
    if (this.kind === CardKind.MONSTER) {
      const specialKinds = getMonsterSpecialKinds(this.json.type);

      if (!this.json.race) {
        throw new Error(`Missing race for card ${this.id} "${this.name}"`);
      }

      const categories: string[] = [this.json.race.toString()].concat(specialKinds.map(k => k.toString())).concat([this.subKind]);
      return <p>[{categories.join(" / ")}]</p>;
    } else {
      return undefined;
    }
  }

  protected getStatLine(): ReactNode {
    if (this.kind === CardKind.MONSTER && this.json.atk) {
      const atk = parseInt(this.json.atk);
      let def = 0;
      if (this.json.def) {
        def = parseInt(this.json.def);
      }

      return <StatLine atk={atk} def={def}/>
    } else {
      return undefined;
    }
  }

  protected toElement(): ReactNode {
    return (
      <CardTemplate
        id={this.id}
        name={this.name}
        artSrc={this.art}
        infoLine={this.getInfoLine()}
        effectBlock={this.getEffectBlock()}
        cardKind={this.kind}
        cardSubKind={this.subKind}
        overrideArtSrc={true}
        statLine={this.getStatLine()}
        categoryLine={this.getCategoryLine()}
        isPendulum={this.isPendulum}
      />
    );
  }

  protected getEffectBlock(): ReactNode {
    try {
      if (this.kind == CardKind.MONSTER && this.isPendulum) {
        const {pendulumEffects, monsterEffects} = parsePendulumText(this.text, this.subKind === CardSubKind.NORMAL);
        return <PendulumEffectBlock pendulumEffects={pendulumEffects} monsterEffects={monsterEffects} cardId={this.id} />;
      }

      if (this.kind == CardKind.TOKEN || (this.kind == CardKind.MONSTER && this.subKind == CardSubKind.NORMAL)) {
        return new NormalEffectLore(this.text).render()
      }

      const materials = this.getMaterials();
      const effects = parseEffects({
        text: materials ? this.text.substring(materials.length + 2).trim() : this.text,
        isFastCard: this.kind === CardKind.TRAP || this.subKind === CardSubKind.QUICK_PLAY,
        isSpellTrapCard: isSpellTrapCard(this.kind),
        isContinuousSpellTrapCard: (
          isSpellTrapCard(this.kind)
          && isContinuousLike(this.subKind)
        )
      })

      return <EffectBlock materials={materials} effects={effects} cardId={this.id}/>;
    } catch (e) {
      return <p>{this.text.split("\n").map((s, index) => <Fragment key={index}>{s}<br/></Fragment>)}</p>;
    }
  }

  protected getMaterials(): string | undefined {
    if (this.kind === CardKind.MONSTER && isExtraDeck(this.subKind)) {
      const res = this.text.match(/([^\n\r/]+?)(?=(:?\r?\n| \/ ).+)/);
      if (res) {
        return res[0];
      }
    }
    return undefined;
  }
}

function getBucketImageLink(id: string): string {
  return `${process.env.IMAGE_BASE_URL}/${id}.jpg`;
}

function getDbCardKind(json: CardJsonEntry): CardKind {
  return readCardKind(json.type.toLowerCase());
}

function getDbCardSubKind(json: CardJsonEntry): CardSubKind {
  const typeString = json.type.toLowerCase();
  const kind = getDbCardKind(json);
  const frameType = json.frameType || undefined;

  if (!json.race) {
    throw new Error(`Missing race for card ${json.id} "${json.name}"`);
  }

  return readCardSubKind(kind, typeString, json.race, frameType);
}

function getLevelName(monsterSubKind: CardSubKind, json: CardJsonEntry): string {
  const levelNumber = json.level;
  if (monsterSubKind === CardSubKind.LINK) {
    const linkRating = json.linkval;
    return `Link-${linkRating}`;
  } else if (monsterSubKind === CardSubKind.XYZ) {
    return `Rank ${levelNumber}`;
  } else {
    return `Level ${levelNumber}`;
  }
}
