import {useSearchCards} from "./useSearchCards.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {SearchResult} from "./SearchResult.tsx";
import {LoadingSpinner} from "../card/LoadingSpinner.tsx";
import {SearchOption} from "./SearchOptions.ts";
import {MultiValue} from "react-select";

interface SearchResultsProps {
  searchTerm: string;
  toggleSearch: () => void;
  filterOptions: MultiValue<SearchOption>;
  fuzzySearch: boolean;
}

/**
 * Display search results in a scrollable container
 * <p>Dynamically loads more results as the user scrolls to the bottom</p>
 * @param results The search results to display
 * @param toggleSearch Function to close the search box
 */
export function SearchResults({
  searchTerm,
  toggleSearch,
  filterOptions,
  fuzzySearch,
}: SearchResultsProps) {
  const {results, hits, isLoading} = useSearchCards(searchTerm, filterOptions, fuzzySearch);
  const observer = useRef<IntersectionObserver | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);

  const pageLength = 10;

  const loadMore = useCallback(() => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMore],
  );

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
      setPage(1);
    }
  }, [searchTerm, filterOptions]);

  return (
    <>
      <p className={"hit-count"}>Hits: {hits}</p>
      <div className={"results"} ref={resultsRef}>
        {results.slice(0, page * pageLength).map((result, index) => {
          if (index + 1 === page * pageLength) {
            return (
              <div ref={lastElementRef} key={index} className={"last-ref"}>
                <SearchResult card={result} toggleSearch={toggleSearch}/>
              </div>
            );
          } else {
            return (
              <SearchResult key={index} card={result} toggleSearch={toggleSearch}/>
            );
          }
        })}
        {isLoading && <LoadingSpinner/>}
      </div>
    </>
  );
}
