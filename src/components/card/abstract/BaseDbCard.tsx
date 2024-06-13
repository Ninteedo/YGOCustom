import {BaseCard} from "./BaseCard.ts";
import React, {Fragment, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  private readonly json: any;

  constructor(json: any) {
    const id = json.id;
    const name = json.name;
    const artSrc = getLocalImageLink(json["card_images"][0]["id"]);
    const cardKind = getDbCardKind(json);
    const subKind = getDbCardSubKind(json).toLowerCase();

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
        const levelName = getLevelName(this.subKind, this.json);
        const attribute = this.json.attribute;
        return <p>{levelName} {attribute} Monster</p>
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
        effectBlock={<p>{this.text.split("\n").map((s, index) => <Fragment key={index}>{s}<br/></Fragment>)}</p>}
        cardKind={this.kind}
        cardSubKind={this.subKind}
        overrideArtSrc={false}
        statLine={this.getStatLine()}
        categoryLine={this.getCategoryLine()}
      />
    );
  }
}

function getLocalImageLink(id: string): string {
  return `official/${id}.jpg`;
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
      return "link";
    } else if (typeString.includes("xyz")) {
      return "xyz";
    } else if (typeString.includes("synchro")) {
      return "synchro";
    } else if (typeString.includes("fusion")) {
      return "fusion";
    } else if (typeString.includes("ritual")) {
      return "ritual";
    } else if (typeString.includes("effect")) {
      return "effect";
    } else {
      return "normal";
    }
  } else {
    return json.race.toLowerCase();
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
