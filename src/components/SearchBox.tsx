import React, {ReactNode, useEffect, useRef, useState} from "react";
import "../style/SearchBox.scss";
import {BaseCard} from "./card/abstract/BaseCard.ts";
import CardSmall from "./card/display/CardSmall.tsx";
import cardManifest from "../cardManifest.json";
import {loadCard} from "./card/abstract/parse/CardLoader.tsx";
import {useNavigate} from "react-router-dom";
import {useCardDbContext} from "./card/abstract/parse/CardDb.tsx";
import {LoadingSpinner} from "./card/LoadingSpinner.tsx";

interface SearchBoxProps {
  toggleSearch: () => void;
}

export default function SearchBox({toggleSearch}: SearchBoxProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayRowsLimit, setDisplayRowsLimit] = useState(3);
  const [searchResults, loading] = useSearchCards(searchTerm);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <>
      <div className={"search-box"}>
        <div>
          <input type="text" name={"search-term"} className={"search-term"} placeholder={"Search"}
                 onInput={handleInput}/>
          <button className={"close-button"} onClick={toggleSearch}>x</button>
        </div>
        <SearchResults
          results={searchResults}
          toggleSearch={toggleSearch}
          displayRowsLimit={displayRowsLimit}
          setDisplayRowsLimit={setDisplayRowsLimit}
          cardsPerRow={4}
          isLoading={loading}
        />
      </div>
    </>
  )
}

interface SearchResultsProps {
  results: BaseCard[];
  toggleSearch: () => void;
  displayRowsLimit: number;
  setDisplayRowsLimit: (rows: number) => void;
  cardsPerRow: number;
  isLoading: boolean;
}

function SearchResults({
  results,
  toggleSearch,
  displayRowsLimit,
  setDisplayRowsLimit,
  cardsPerRow,
  isLoading
}: SearchResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (resultsRef.current) {
        const bottom = Math.abs(resultsRef.current.scrollHeight - (resultsRef.current.scrollTop + resultsRef.current.clientHeight)) <= 1;
        if (bottom) {
          setDisplayRowsLimit(displayRowsLimit + 1);
        }
      }
    };

    if (resultsRef.current) {
      resultsRef.current.addEventListener("scroll", handleScroll);
    }
    const resultsRefInner = resultsRef.current;

    return () => {
      if (resultsRefInner) {
        resultsRefInner.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setDisplayRowsLimit, displayRowsLimit]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const limitedResults = results.slice(0, displayRowsLimit * cardsPerRow);

  return (
    <div className={"results"} ref={resultsRef}>
      {limitedResults.map((result, index) => {
        return <SearchResult key={index} card={result} toggleSearch={toggleSearch} />;
      })}
    </div>
  );
}

function SearchResult({card, toggleSearch}: { card: BaseCard, toggleSearch: () => void }) {
  const navigate = useNavigate();

  const clickAction = () => {
    navigate(card.getLinkUrl());
    toggleSearch();
  }

  return <CardSmall id={card.id} name={card.name} art={card.art} cardKind={card.kind} cardSubKind={card.subKind}
                    clickAction={clickAction}/>
}

function useSearchCards(searchTerm: string): [BaseCard[], boolean] {
  const [results, setResults] = useState<BaseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const cardDb = useCardDbContext();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const hitsCustom: string[] = cardManifest.entries.filter((entry: string) => {
        return entry.toLowerCase().includes(searchTerm.toLowerCase());
      });
      const results: BaseCard[] = [];

      const hitsBase: BaseCard[] = cardDb.filter(c => c.toText().toLowerCase().includes(searchTerm.toLowerCase()));
      results.push(...hitsBase);

      for (const hit of hitsCustom) {
        const card = await loadCard(hit);
        if (card) {
          results.push(card);
        }
      }

      setResults(results);
      setLoading(false);
    };

    fetchResults();
  }, [searchTerm, cardDb]);

  return [results, loading];
}
