import {ReactNode} from "react";
import {CardSubKind} from "./CardSubKind.ts";
import {CardKind} from "./CardKind.ts";

export abstract class BaseCard {
  public readonly id: string;
  public readonly name: string;
  public readonly art: string;
  public readonly kind: CardKind;
  public readonly subKind: CardSubKind;

  protected constructor(id: string, name: string, art: string, kind: CardKind, subKind: CardSubKind) {
    this.id = id;
    this.name = name;
    this.art = art;
    this.kind = kind;
    this.subKind = subKind;
  }

  abstract toCardElement(): ReactNode;

  abstract toCardDetail(): ReactNode;

  abstract toText(): string;

  abstract getLinkUrl(): string;
}
