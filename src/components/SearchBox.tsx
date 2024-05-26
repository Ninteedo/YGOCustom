import React, {ReactNode, useEffect, useState} from "react";
import "../style/SearchBox.scss";
import {BaseCard} from "./card/abstract/BaseCard.ts";
import CardSmall from "./card/display/CardSmall.tsx";
import cardManifest from "../cardManifest.json";
import {loadCard} from "./card/abstract/CardLoader.tsx";
import {useNavigate} from "react-router-dom";

export default function SearchBox({isVisible, toggleSearch}: {
  isVisible: boolean,
  toggleSearch: () => void
}): ReactNode {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BaseCard[]>([]);

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
        <SearchResults results={searchResults} toggleSearch={toggleSearch}/>
      </div>
      <div className={"search-box-overlay" + (isVisible ? "" : " hidden")} onClick={toggleSearch}/>
    </>
  )
}

function SearchResults({results, toggleSearch}: { results: BaseCard[], toggleSearch: () => void }) {
  return (
    <div className={"results"}>
      {results.map((result, index) => {
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
