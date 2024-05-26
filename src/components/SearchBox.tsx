import React, {ReactNode, useEffect, useState} from "react";
import "../style/SearchBox.scss";
import {BaseCard} from "./card/abstract/BaseCard.ts";
import CardSmall from "./card/display/CardSmall.tsx";
import cardManifest from "../cardManifest.json";
import {loadCard} from "./card/abstract/CardLoader.tsx";
import {useNavigate} from "react-router-dom";

interface SearchBoxProps {
  isVisible: boolean;
  toggleSearch: () => void;
}

export default function SearchBox({isVisible, toggleSearch}: SearchBoxProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BaseCard[]>([]);
  const [displayRowsLimit, setDisplayRowsLimit] = useState(3);

  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (isVisible) {
      body.classList.add("search-box-visible");
    } else {
      body.classList.remove("search-box-visible");
    }
  }, [isVisible]);

  useEffect(() => {

    // setSearchResults(searchCards(searchTerm));
    const fetchResults = async () => {
      const results = await searchCards(searchTerm);
      setSearchResults(results);
    }
    fetchResults();
  }, [searchTerm]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <>
      <div className={"search-box " + (isVisible ? "visible" : "hidden")}>
        <div>
          <input type="text" name={"search-term"} className={"search-term"} placeholder={"Search"}
                 onInput={handleInput}/>
          <button className={"close-button"} onClick={toggleSearch}>x</button>
        </div>
        <SearchResults results={searchResults} toggleSearch={toggleSearch} displayRowsLimit={displayRowsLimit}
        setDisplayRowsLimit={setDisplayRowsLimit} cardsPerRow={4}/>
      </div>
      <div className={"search-box-overlay" + (isVisible ? "" : " hidden")} onClick={toggleSearch}/>
    </>
  )
}

interface SearchResultsProps {
  results: BaseCard[];
  toggleSearch: () => void;
  displayRowsLimit: number;
  setDisplayRowsLimit: (rows: number) => void;
  cardsPerRow: number;
}

function SearchResults({
  results,
  toggleSearch,
  displayRowsLimit,
  setDisplayRowsLimit,
  cardsPerRow,
}: SearchResultsProps) {
  useEffect(() => {
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
      if (bottom) {
        setDisplayRowsLimit(displayRowsLimit + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [setDisplayRowsLimit]);

  const limitedResults = results.slice(0, displayRowsLimit * cardsPerRow);

  return (
    <div className={"results"}>
      {limitedResults.map((result, index) => {
        return <SearchResult key={index} card={result} toggleSearch={toggleSearch}/>
      })}
    </div>
  )
}

function SearchResult({card, toggleSearch}: { card: BaseCard, toggleSearch: () => void }) {
  const navigate = useNavigate();

  const clickAction = (id: string) => {
    navigate(`/card/custom/${id}`);
    toggleSearch();
  }

  return <CardSmall id={card.id} name={card.name} art={card.art} cardKind={card.kind} cardSubKind={card.subKind}
                    clickAction={clickAction}/>
}

async function searchCards(searchTerm: string): Promise<BaseCard[]> {
  const hits: string[] = cardManifest.entries.filter((entry: string) => {
    return entry.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const results: BaseCard[] = [];

  for (const hit of hits) {
    const card = await loadCard(hit);
    if (card) {
      results.push(card);
    }
  }

  return results;
}
