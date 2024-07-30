import {useSearchCards} from "./useSearchCards.tsx";
import {useCallback, useEffect, useRef} from "react";
import {SearchResult} from "./SearchResult.tsx";
import {LoadingSpinner} from "../card/LoadingSpinner.tsx";
import {SearchOption} from "./SearchOptions.ts";
import {MultiValue} from "react-select";

interface SearchResultsProps {
  searchTerm: string;
  toggleSearch: () => void;
  filterOptions: MultiValue<SearchOption>;
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
}: SearchResultsProps) {
  const {results, hits, isLoading, loadMore, resetPagination} = useSearchCards(searchTerm, filterOptions);
  const observer = useRef<IntersectionObserver | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

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
      resetPagination();
    }
  }, [searchTerm, filterOptions, resetPagination]);

  return (
    <>
      <p>Hits: {hits}</p>
      <div className={"results"} ref={resultsRef}>
        {results.map((result, index) => {
          if (results.length === index + 1) {
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
