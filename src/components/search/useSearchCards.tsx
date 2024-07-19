import {BaseCard} from "../card/abstract/BaseCard.ts";
import {useCallback, useEffect, useState} from "react";
import {useCardDbContext} from "../card/abstract/parse/cardDbUtility.ts";
import cardManifest from "../../cardManifest.json";
import {loadCard} from "../card/abstract/parse/cardLoader.ts";

export function useSearchCards(searchTerm: string): [BaseCard[], number, boolean, () => void] {
  const [results, setResults] = useState<BaseCard[]>([]);
  const [filteredResults, setFilteredResults] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const cardDb = useCardDbContext();
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set());

  const pageLength = 10;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    setLoading(true);
    let dbResults: BaseCard[] = [];
    if (searchTerm === '') {
      dbResults = cardDb;
    } else {
      dbResults = cardDb.filter((c) =>
        c.toText().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const manifestEntries = cardManifest.entries.filter((entry: string) =>
      entry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    Promise.all(manifestEntries.map((entry) => loadCard(entry)))
      .then((manifestResults) => {
        const filtered: BaseCard[] = manifestResults.filter(card => card !== null) as BaseCard[];
        const combinedResults = Array.from(new Set([...dbResults, ...filtered]));
        setFilteredResults(combinedResults);
        setResults(combinedResults.slice(0, page * pageLength)); // Update to display initial results
        setHasMore(combinedResults.length > page * pageLength);
        setLoading(false);
      });
  }, [searchTerm, cardDb, page]);

  useEffect(() => {
    if (!hasMore || fetchedPages.has(page)) return;

    setResults((prevResults) => [
      ...prevResults,
      ...filteredResults.slice((page - 1) * pageLength, page * pageLength)
    ]);
    setFetchedPages((prevPages) => new Set(prevPages).add(page));
    setHasMore(filteredResults.length > page * pageLength);
    setLoading(false);
  }, [page, hasMore, fetchedPages, filteredResults]);

  return [results, filteredResults.length, loading, loadMore];
}
