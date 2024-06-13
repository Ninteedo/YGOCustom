import {BaseCard} from "../card/abstract/BaseCard.ts";
import {useCallback, useEffect, useState} from "react";
import {useCardDbContext} from "../card/abstract/parse/cardDbUtility.ts";
import cardManifest from "../../cardManifest.json";
import {loadCard} from "../card/abstract/parse/cardLoader.ts";

export function useSearchCards(searchTerm: string): [BaseCard[], boolean, () => void] {
  const [results, setResults] = useState<BaseCard[]>([]);
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
    setResults([]);
    setPage(1);
    setHasMore(true);
    setFetchedPages(new Set());
  }, [searchTerm]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!hasMore || fetchedPages.has(page)) return;
      setLoading(true);

      const newResults: BaseCard[] = [];

      // Fetch from card database
      const dbResults: BaseCard[] = cardDb.filter((c) =>
        c.toText().toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Fetch from manifest
      const manifestEntries = cardManifest.entries.filter((entry: string) =>
        entry.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const manifestResults = await Promise.all(
        manifestEntries.slice((page - 1) * pageLength, page * pageLength).map((entry) => loadCard(entry))
      );

      if (manifestResults === null) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      newResults.push(...dbResults.slice((page - 1) * pageLength, page * pageLength), ...manifestResults.filter(Boolean));

      if (newResults.length < pageLength) {
        setHasMore(false);
      }

      setResults((prevResults) => [...prevResults, ...newResults]);
      setFetchedPages((prevPages) => new Set(prevPages).add(page));
      setLoading(false);
    };

    fetchResults();
  }, [searchTerm, page, cardDb, hasMore, fetchedPages]);

  return [results, loading, loadMore];
}
