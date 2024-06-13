import {useSearchCards} from "./useSearchCards.tsx";
import {useCallback, useRef} from "react";
import {SearchResult} from "./SearchResult.tsx";
import {LoadingSpinner} from "../card/LoadingSpinner.tsx";

interface SearchResultsProps {
  searchTerm: string;
  toggleSearch: () => void;
  cardsPerRow: number;
}

/**
 * Display search results in a scrollable container
 * <p>Dynamically loads more results as the user scrolls to the bottom</p>
 * @param results The search results to display
 * @param toggleSearch Function to close the search box
 * @param displayRowsLimit The number of rows to display
 * @param setDisplayRowsLimit Function to set the number of rows to display
 * @param cardsPerRow The number of cards to display per row
 * @param isLoading Whether the search results are still loading
 * @constructor Create element
 */
export function SearchResults({
  searchTerm,
  toggleSearch,
}: SearchResultsProps) {
  const [results, isLoading, loadMore] = useSearchCards(searchTerm);
  const observer = useRef<IntersectionObserver | null>(null);
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

  return (
    <div className={"results"}>
      {results.map((result, index) => {
        if (results.length === index + 1) {
          return (
            <div ref={lastElementRef} key={index}>
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
  );
}
