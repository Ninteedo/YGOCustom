import {BaseCard} from "../card/abstract/BaseCard.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {useCardDbContext} from "../card/abstract/parse/cardDbUtility.ts";
import {loadCard} from "../card/abstract/parse/cardLoader.ts";
import {FuseResult} from "fuse.js";
import {CardJsonEntry} from "../../dbCompression.ts";
import BaseDbCard from "../card/abstract/BaseDbCard.tsx";

const workerUrl = new URL('./searchWorker.ts', import.meta.url);

export function useSearchCards(searchTerm: string): [BaseCard[], number, boolean, () => void] {
  const [results, setResults] = useState<BaseCard[]>([]);
  const [filteredResults, setFilteredResults] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const cardDb = useCardDbContext();
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set());
  const workerRef = useRef<Worker | null>(null);

  const pageLength = 10;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    setLoading(true);

    if (!workerRef.current) {
      workerRef.current = new Worker(workerUrl, { type: 'module' });
    }

    const worker = workerRef.current;

    worker.onmessage = (e) => {
      let dbResults: BaseDbCard[];
      if (searchTerm) {
        const fuseResults: FuseResult<CardJsonEntry>[] = e.data;
        dbResults = fuseResults.map(({item}) => new BaseDbCard(item));
      } else {
        dbResults = cardDb as BaseDbCard[];
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
    };

    const options = {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'text', weight: 0.3 },
        { name: 'searchableLevel', weight: 0.1 },
        { name: 'kind', weight: 0.05 },
        { name: 'attributes', weight: 0.05 },
        { name: 'type', weight: 0.05 },
      ],
      includeScore: false,
      threshold: 0.3
    };

    // @ts-ignore
    worker.postMessage({ cardDb: cardDb.map(card => card.json), searchTerm, options });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
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
