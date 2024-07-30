import {BaseCard} from "../card/abstract/BaseCard.ts";
import {useCallback, useEffect, useState} from "react";
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
  loadMore: () => void;
  resetPagination: () => void;
}

export function useSearchCards(searchTerm: string, filterOptions: MultiValue<SearchOption>): SearchResultsResponse {
  const [results, setResults] = useState<BaseCard[]>([]);
  const [filteredResults, setFilteredResults] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const cardDb = useCardDbContext();

  const pageLength = 10;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

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
        setResults(combinedResults.slice(0, page * pageLength)); // Update to display initial results
        setHasMore(combinedResults.length > page * pageLength);
        setLoading(false);
      });
  }, [searchTerm, cardDb, page, filterOptions]);

  useEffect(() => {
    if (!hasMore) return;

    setResults((prevResults) => [
      ...prevResults,
      ...filteredResults.slice((page - 1) * pageLength, page * pageLength)
    ]);
    setHasMore(filteredResults.length > page * pageLength);
    setLoading(false);
  }, [page, hasMore, filteredResults]);

  return {results, hits: filteredResults.length, isLoading: loading, loadMore, resetPagination};
}
