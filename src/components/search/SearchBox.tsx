import React, {ReactNode, useState} from "react";
import "../../style/SearchBox.scss";
import {SearchResults} from "./SearchResults.tsx";

interface SearchBoxProps {
  toggleSearch: () => void;
}

export default function SearchBox({toggleSearch}: SearchBoxProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div className={"search-box"}>
      <div>
        <input type="text" name={"search-term"} className={"search-term"} placeholder={"Search"}
               onInput={handleInput}/>
        <button className={"close-button"} onClick={toggleSearch}>x</button>
      </div>
      <SearchResults
        searchTerm={searchTerm}
        toggleSearch={toggleSearch}
        cardsPerRow={4}
      />
    </div>
  )
}
