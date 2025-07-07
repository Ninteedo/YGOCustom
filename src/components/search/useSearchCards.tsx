import {useEffect, useState} from "react";
import {useCardDbContext} from "../card/abstract/parse/cardDbUtility.ts";
import {loadCard} from "../card/abstract/parse/cardLoader.ts";
import Fuse, {FuseResult} from "fuse.js";
import {CompressedCardEntry} from "../../dbCompression.ts";
import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {SearchOption, SearchOptionCategory} from "./SearchOptions.ts";
import {SearchSort} from "./SearchSort.ts";

interface SearchResultsResponse {
  results: BaseDbCard[];
  hits: number;
  isLoading: boolean;
}

export function useSearchCards(
  searchTerm: string,
  filterOptions: SearchOption[],
  fuzzySearch: boolean,
  searchSort: SearchSort
): SearchResultsResponse {
  const [results, setResults] = useState<BaseDbCard[]>([]);
  const [filteredResults, setFilteredResults] = useState<BaseDbCard[]>([]);
  const [loading, setLoading] = useState(false);
  const cardDb = useCardDbContext();

  const options = {
    keys: [
      { name: 'name', weight: 0.6 },
      { name: 'text', weight: 0.4 },
    ],
    includeScore: false,
    threshold: 0.5
  };

  useEffect(() => {
    setLoading(true);

    let dbResults: BaseDbCard[] = cardDb;
    const categorisedFilterOptions: Map<SearchOptionCategory, SearchOption[]> = new Map();
    for (const option of filterOptions) {
      if (!categorisedFilterOptions.has(option.category)) {
        categorisedFilterOptions.set(option.category, []);
      }
      categorisedFilterOptions.get(option.category)?.push(option);
    }

    for (const [_, options] of categorisedFilterOptions) {
      dbResults = dbResults.filter((card) => options.some((option) => option.test(card)));
    }
    if (searchTerm) {
      if (fuzzySearch) {
        const fuseResults: FuseResult<CompressedCardEntry>[] = (() => {
          const fuse: Fuse<CompressedCardEntry> = new Fuse(dbResults.map(card => card.json), options);
          return fuse.search(searchTerm);
        })();
        dbResults = fuseResults.map(({item}) => new BaseDbCard(item));
      } else {
        dbResults = dbResults.filter((card) => {
          if (card.text === undefined || card.text === null) {
            return card.name.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return card.name.toLowerCase().includes(searchTerm.toLowerCase())
            || card.text.toLowerCase().includes(searchTerm.toLowerCase())
        });
      }
    }

    dbResults.sort(searchSort.sort);

    const manifestEntries: string[] = [];

    Promise.all(manifestEntries.map((entry) => loadCard(entry)))
      .then((manifestResults) => {
        const filtered: BaseDbCard[] = manifestResults.filter(card => card !== null) as BaseDbCard[];
        const combinedResults = Array.from(new Set([...dbResults, ...filtered]));
        setFilteredResults(combinedResults);
        setResults(combinedResults);  //.slice(0, page * pageLength)); // Update to display initial results
        // setHasMore(combinedResults.length > page * pageLength);
        setLoading(false);
      });
  }, [searchTerm, cardDb, filterOptions, fuzzySearch, searchSort]);

  return {results, hits: filteredResults.length, isLoading: loading};
}
