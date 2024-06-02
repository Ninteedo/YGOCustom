import {BaseCard} from "./BaseCard.ts";
import React, {Fragment} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";

export default class BaseDbCard extends BaseCard {
  public readonly text: string;

  constructor(json: any) {
    const id = json.konami_id;
    const name = json.name;
    const artSrc = getYgoProDeckImageLink(json.password);
    const card_type = json.card_type;
    const sub_kind = "not implemented yet";

    super(id, name, artSrc, card_type, sub_kind);

    console.log(json.text);
    this.text = json.text;
  }

  toCardDetail(): React.ReactNode {
    return (
      <CardTemplate
        id={this.id}
        name={this.name}
        artSrc={this.art}
        infoLine={<p>Not implemented</p>}
        effectBlock={<p>{this.text.split("\n").map(s => <Fragment>{s}<br/></Fragment>)}</p>}
        cardKind={this.kind}
        cardSubKind={this.subKind}
        overrideArtSrc={true}
      />
    );
  }

  toCardElement(): React.ReactNode {
    return (
      <CardTemplate
        id={this.id}
        name={this.name}
        artSrc={this.art}
        infoLine={<p>Not implemented</p>}
        effectBlock={<p>{this.text}</p>}
        cardKind={this.kind}
        cardSubKind={this.subKind}
        overrideArtSrc={true}
      />
    );
  }

  toText(): string {
    return `${this.id}\n${this.name}\n${this.text}`
  }

  getLinkUrl(): string {
    return `/card/official/${this.id}`
  }
}

function getYugipediaLink(fileName: string): string {
  return `https://yugipedia.com/wiki/Special:Redirect/file/${fileName}?utm_source=rghdev`
}

function getYgoProDeckImageLink(passcode: string): string {
  return `https://images.ygoprodeck.com/images/cards_cropped/${passcode}.jpg?utm_source=rghdev`
}
