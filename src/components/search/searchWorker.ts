import Fuse, {IFuseOptions} from "fuse.js";
import {CardJsonEntry} from "../../dbCompression.ts";

interface SearchWorkerData {
  cardDb: CardJsonEntry[];
  searchTerm: string;
  options: IFuseOptions<CardJsonEntry>;
}

self.onmessage = function (e: MessageEvent<SearchWorkerData>): void {
  const { cardDb, searchTerm, options } = e.data;

  const fuse = new Fuse(cardDb, options);
  const results = fuse.search(searchTerm);

  self.postMessage(results);
};

export {};
