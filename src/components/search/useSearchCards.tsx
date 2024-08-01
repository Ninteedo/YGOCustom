import {BaseCard} from "../card/abstract/BaseCard.ts";
import {useEffect, useState} from "react";
import {useCardDbContext} from "../card/abstract/parse/cardDbUtility.ts";
import {loadCard} from "../card/abstract/parse/cardLoader.ts";
import Fuse, {FuseResult} from "fuse.js";
import {CardJsonEntry} from "../../dbCompression.ts";
import BaseDbCard from "../card/abstract/BaseDbCard.tsx";
import {SearchOption, SearchOptionCategory} from "./SearchOptions.ts";
import {MultiValue} from "react-select";

export interface SearchResultsResponse {
  results: BaseCard[];
  hits: number;
  isLoading: boolean;
}

export function useSearchCards(searchTerm: string, filterOptions: MultiValue<SearchOption>): SearchResultsResponse {
  const [results, setResults] = useState<BaseCard[]>([]);
  const [filteredResults, setFilteredResults] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const cardDb = useCardDbContext();

  useEffect(() => {
    setLoading(true);

    const options = {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'desc', weight: 0.4 },
      ],
      includeScore: false,
      threshold: 0.5
    };

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
      const fuseResults: FuseResult<CardJsonEntry>[] = (() => {
        const fuse: Fuse<CardJsonEntry> = new Fuse(dbResults.map(card => card.json), options);
        return fuse.search(searchTerm);
      })();
      dbResults = fuseResults.map(({item}) => new BaseDbCard(item));
    }

    const manifestEntries: string[] = [];

    Promise.all(manifestEntries.map((entry) => loadCard(entry)))
      .then((manifestResults) => {
        const filtered: BaseCard[] = manifestResults.filter(card => card !== null) as BaseCard[];
        const combinedResults = Array.from(new Set([...dbResults, ...filtered]));
        setFilteredResults(combinedResults);
        setResults(combinedResults);  //.slice(0, page * pageLength)); // Update to display initial results
        // setHasMore(combinedResults.length > page * pageLength);
        setLoading(false);
      });
  }, [searchTerm, cardDb, filterOptions]);

  return {results, hits: filteredResults.length, isLoading: loading};
}
