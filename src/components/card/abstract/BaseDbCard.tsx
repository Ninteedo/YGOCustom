import {BaseCard} from "./BaseCard.ts";
import React, {Fragment, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";
import EffectBlock from "./display/elements/EffectBlock.tsx";
import {parseEffects} from "./parse/parseEffects.ts";

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  private readonly json: any;

  constructor(json: any) {
    const id = json.id;
    const name = json.name;
    const artSrc = getBucketImageLink(json["card_images"][0]["id"]);
    const cardKind = getDbCardKind(json);
    const subKind = getDbCardSubKind(json);

    super(id, name, artSrc, cardKind, subKind);

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
      case "monster":
        return <p>{getLevelName(this.subKind.toLowerCase(), this.json)} {this.json.attribute} Monster</p>
      case "spell":
        return <p>{this.subKind} Spell</p>
      case "trap":
        return <p>{this.subKind} Trap</p>
      default:
        return <p>Unknown</p>
    }
  }

  protected getCategoryLine(): ReactNode {
    if (this.kind === "monster") {
      return <p>[{this.json.race}]</p>;
    } else {
      return undefined;
    }
  }

  protected getStatLine(): ReactNode {
    if (this.kind === "monster") {
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
      />
    );
  }

  protected getEffectBlock(): ReactNode {
    try {
      const materials = this.getMaterials();
      const {restrictions, effects} = parseEffects({
        text: materials ? this.text.substring(materials.length + 1).trim() : this.text,
        isFastCard: this.kind === "trap" || this.subKind === "Quick-Play",
        isSpellTrapCard: this.kind === "spell" || this.kind === "trap",
        isContinuousSpellTrapCard: (this.kind === "spell" || this.kind === "trap") && ["continuous", "field", "equip"].includes(this.subKind.toLowerCase())
      })

      return <EffectBlock materials={materials} effectRestrictions={restrictions} effects={effects} cardId={this.id}/>;
    } catch (e) {
      return <p>{this.text.split("\n").map((s, index) => <Fragment key={index}>{s}<br/></Fragment>)}</p>;
    }
  }

  protected getMaterials(): string | undefined {
    if (this.kind === "monster" && ["Fusion", "Synchro", "Xyz", "Link"].includes(this.subKind)) {
      return this.text.split("\n")[0];
    }
    return undefined;
  }
}

function getBucketImageLink(id: string): string {
  return `${process.env.IMAGE_BASE_URL}/${id}.jpg`;
}

function getDbCardKind(json: any): string {
  const typeString = json.type.toLowerCase();

  if (typeString.includes("monster")) {
    return "monster";
  } else if (typeString.includes("spell")) {
    return "spell";
  } else if (typeString.includes("trap")) {
    return "trap";
  } else {
    return "unknown";
  }
}

function getDbCardSubKind(json: any): string {
  const typeString = json.type.toLowerCase();
  const kind = getDbCardKind(json);

  if (kind == "monster") {
    if (typeString.includes("link")) {
      return "Link";
    } else if (typeString.includes("xyz")) {
      return "Xyz";
    } else if (typeString.includes("synchro")) {
      return "Synchro";
    } else if (typeString.includes("fusion")) {
      return "Fusion";
    } else if (typeString.includes("ritual")) {
      return "Ritual";
    } else if (typeString.includes("effect")) {
      return "Effect";
    } else {
      return "Normal";
    }
  } else {
    return json.race;
  }
}

function getLevelName(monsterSubKind: string, json: any): string {
  const levelNumber = json.level;
  if (monsterSubKind === "link") {
    const linkRating = json.linkval;
    return `Link-${linkRating}`;
  } else if (monsterSubKind === "xyz") {
    return `Rank ${levelNumber}`;
  } else {
    return `Level ${levelNumber}`;
  }
}
