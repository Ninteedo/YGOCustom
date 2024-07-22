import {createContext, useContext} from "react";
import BaseDbCard from "../BaseDbCard.tsx";
import {CardJsonEntry} from "../../../../dbCompression.ts";

export const cardDbContext = createContext<BaseDbCard[]>([]);

export function useCardDbContext() {
  return useContext(cardDbContext)
}

export async function fetchCardDb(language: string, onProgress: (loaded: number, total: number | null) => void) {
  const dbLocation = `/db/cards.${language}.json`;
  const response = await fetch(dbLocation);

  // Check if response is null or status is not 200
  if (!response || response.status !== 200 || !response.body || !response.headers) {
    console.error("Failed to fetch card database");
    return {data: []}; // return an empty array or any default value
  }

  const contentLength = response.headers.get("Content-Length");
  const totalSize: number | null = (contentLength && parseInt(contentLength)) || null;

  const reader = response.body.getReader();
  let loaded = 0;
  const chunks: string[] = [];

  const readStream = async (): Promise<undefined> => {
    const {done, value} = await reader.read();

    if (done) {
      return;
    }

    loaded += value.length;
    chunks.push(new TextDecoder("utf-8").decode(value));

    onProgress(loaded, totalSize);
    return readStream();
  }

  await readStream();

  const cardDbJson = JSON.parse(chunks.join(""));
  console.log("Aggregate card data loaded.");

  return {data: loadCardDb(cardDbJson)};
}

function loadCardDb(json: any): BaseDbCard[] {
  return json.map((card: any) => parseDbCard(card)).filter((card: BaseDbCard | null) => card !== null);
}

function parseDbCard(json: any): BaseDbCard | null {
  try {
    const cardEntry = new CardJsonEntry(json, true);
    return new BaseDbCard(cardEntry);
  } catch (e) {
    console.error(`Failed to parse card ${json.id} "${json.name}"`, e);
    return null;
  }
}
