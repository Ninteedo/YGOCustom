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

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  private readonly json: any;

  constructor(json: any) {
    const id = json.id;
    const name = json.name;
    const artSrc = getBucketImageLink(json["card_images"][0]["id"]);
    const cardKind = getDbCardKind(json);
    const subKind = getDbCardSubKind(json);

    const isPendulum = json.type.toLowerCase().includes("pendulum");

    super(id, name, artSrc, cardKind, subKind, isPendulum);

    this.text = json.desc;
    this.json = json;
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
      return <p>[{this.json.race} / {this.subKind}]</p>;
    } else {
      return undefined;
    }
  }

  protected getStatLine(): ReactNode {
    if (this.kind === CardKind.MONSTER) {
      const atk = this.json.atk;
      let def = 0;
      if (this.json.def) {
        def = this.json.def;
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
      const {restrictions, effects} = parseEffects({
        text: materials ? this.text.substring(materials.length + 1).trim() : this.text,
        isFastCard: this.kind === CardKind.TRAP || this.subKind === CardSubKind.QUICK_PLAY,
        isSpellTrapCard: isSpellTrapCard(this.kind),
        isContinuousSpellTrapCard: (
          isSpellTrapCard(this.kind)
          && isContinuousLike(this.subKind)
        )
      })

      return <EffectBlock materials={materials} effectRestrictions={restrictions} effects={effects} cardId={this.id}/>;
    } catch (e) {
      return <p>{this.text.split("\n").map((s, index) => <Fragment key={index}>{s}<br/></Fragment>)}</p>;
    }
  }

  protected getMaterials(): string | undefined {
    if (this.kind === CardKind.MONSTER && isExtraDeck(this.subKind)) {
      return this.text.split("\n")[0];
    }
    return undefined;
  }
}

function getBucketImageLink(id: string): string {
  return `${process.env.IMAGE_BASE_URL}/${id}.jpg`;
}

function getDbCardKind(json: any): CardKind {
  return readCardKind(json.type.toLowerCase());
}

function getDbCardSubKind(json: any): CardSubKind {
  const typeString = json.type.toLowerCase();
  const kind = getDbCardKind(json);
  const frameType = json.frameType || undefined;

  return readCardSubKind(kind, typeString, json.race, frameType);
}

function getLevelName(monsterSubKind: CardSubKind, json: any): string {
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
