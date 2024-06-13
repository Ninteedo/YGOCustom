import {ReactNode} from "react";

export abstract class BaseCard {
  public readonly id: string;
  public readonly name: string;
  public readonly art: string;
  public readonly kind: string;
  public readonly subKind: string;

  protected constructor(id: string, name: string, art: string, kind: string, subKind: string) {
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
