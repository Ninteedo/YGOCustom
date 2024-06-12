import {createContext, useContext} from "react";
import {BaseCard} from "../BaseCard.ts";
import BaseDbCard from "../BaseDbCard.tsx";

export const cardDbContext = createContext<BaseCard[]>([]);

export function useCardDbContext() {
  return useContext(cardDbContext)
}

export async function fetchCardDb(language: string, onProgress: (loaded: number, total: number) => void) {
  const dbLocation = `/db/cards.${language}.json`;
  const response = await fetch(dbLocation);

  // Check if response is null or status is not 200
  if (!response || response.status !== 200 || !response.body || !response.headers) {
    console.error("Failed to fetch card database");
    return {data: []}; // return an empty array or any default value
  }

  const contentLength = response.headers.get("Content-Length");
  const totalSize: number = (contentLength && parseInt(contentLength)) || 0;

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

    // Update progress here
    onProgress(loaded, totalSize);

    // Call the function again to read the next chunk
    return readStream();
  }

  await readStream();

  const cardDbJson = JSON.parse(chunks.join(""));
  console.log("Aggregate card data loaded.");

  return {data: loadCardDb(cardDbJson)};
}

function loadCardDb(json: any): BaseCard[] {
  return json.map((card: any) => parseDbCard(card));
}

function parseDbCard(json: any): BaseCard {
  return new BaseDbCard(json);
}
