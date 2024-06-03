import {BaseCard} from "./BaseCard.ts";
import React, {Fragment, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  private readonly json: any;

  constructor(json: any) {
    const id = json.konami_id;
    const name = json.name;
    const artSrc = getYgoProDeckImageLink(json.password);
    const cardKind = json.card_type.toLowerCase();
    const subKind = getDbCardSubKind(json).toLowerCase();

    super(id, name, artSrc, cardKind, subKind);

    this.text = json.text;
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
      return <p>[{this.json.monster_type_line}]</p>;
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
        overrideArtSrc={true}
        statLine={this.getStatLine()}
        categoryLine={this.getCategoryLine()}
      />
    );
  }
}

function getYugipediaLink(fileName: string): string {
  return `https://yugipedia.com/wiki/Special:Redirect/file/${fileName}?utm_source=rghdev`
}

function getYgoProDeckImageLink(passcode: string): string {
  // return `https://images.ygoprodeck.com/images/cards_cropped/${passcode}.jpg?utm_source=rghdev`
  return "not implemented";
}

function getDbCardSubKind(json: any): string {
  switch (json.card_type.toLowerCase()) {
    case "monster":
      const monsterTypeLine = json.monster_type_line;
      if (monsterTypeLine.includes("Fusion")) {
        return "Fusion";
      } else if (monsterTypeLine.includes("Synchro")) {
        return "Synchro";
      } else if (monsterTypeLine.includes("Xyz")) {
        return "Xyz";
      } else if (monsterTypeLine.includes("Link")) {
        return "Link";
      } else if (monsterTypeLine.includes("Ritual")) {
        return "Ritual";
      } else if (monsterTypeLine.includes("Effect")) {
        return "Regular";
      } else {
        return "Normal";
      }
    case "spell":
      return json.property.toLowerCase();
    case "trap":
      return json.property.toLowerCase();
    default:
      return "Unknown";
  }
}

function getLevelName(monsterSubKind: string, json: any): string {
  if (monsterSubKind === "link") {
    const linkArrows = json.link_arrows;
    const linkRating = linkArrows.length;
    return `Link-${linkRating}`;
  } else if (monsterSubKind === "xyz") {
    return `Rank ${json.rank}`;
  } else {
    return `Level ${json.level}`;
  }
}
