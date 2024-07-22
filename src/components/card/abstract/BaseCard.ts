import {ReactNode} from "react";
import {CardSubKind} from "./CardSubKind.ts";
import {CardKind} from "./CardKind.ts";
import SearchProps from "../../search/SearchProps.ts";

export abstract class BaseCard {
  public readonly id: string;
  public readonly name: string;
  public readonly art: string;
  public readonly kind: CardKind;
  public readonly subKind: CardSubKind;
  public readonly isPendulum: boolean;

  protected constructor(id: string, name: string, art: string, kind: CardKind, subKind: CardSubKind, isPendulum: boolean) {
    this.id = id;
    this.name = name;
    this.art = art;
    this.kind = kind;
    this.subKind = subKind;
    this.isPendulum = isPendulum;
  }

  abstract toCardElement(): ReactNode;

  abstract toCardDetail(): ReactNode;

  abstract toText(): string;

  abstract getLinkUrl(): string;

  /**
   * Returns a number representing how well this card matches the search query.
   *
   * @param search the search query
   * @returns a positive number representing how well this card matches the search query, higher is better, 0 is no match
   */
  abstract matchesSearch(search: SearchProps): number;
}
