import React, {ReactNode, useState, useEffect, useRef} from "react";
import "../../style/SearchBox.scss";
import {SearchResults} from "./SearchResults.tsx";
import {SearchFilterSelect} from "./SearchFilterSelect.tsx";
import {MultiValue} from "react-select";
import {SearchOption, searchOptions} from "./SearchOptions.ts";

interface SearchBoxProps {
  toggleSearch: () => void;
  isSearchBoxOpen: boolean;
}

export default function SearchBox({toggleSearch, isSearchBoxOpen}: SearchBoxProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<SearchOption>>([]);
  const [enableFuzzySearch, setEnableFuzzySearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchBoxOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchBoxOpen]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div className={"search-box"}>
      <div className={"search-term-container"}>
        <input
          type="text"
          name={"search-term"}
          className={"search-term"}
          placeholder={"Search..."}
          onInput={handleInput}
          ref={inputRef}
          tabIndex={1}
        />
        {/*<button className={"close-button"} onClick={toggleSearch}>x</button>*/}
        <label className={"toggle-fuzzy-container"}>
          Fuzzy<input type="checkbox" name={"fuzzy-search"} className={"fuzzy-search"} id={"fuzzy-search"}
                      onInput={() => {setEnableFuzzySearch(!enableFuzzySearch);}}
                      tabIndex={3}
        />
        </label>
      </div>
      <SearchFilterSelect
        options={searchOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        tabIndex={2}
      />
      <SearchResults
        searchTerm={searchTerm}
        toggleSearch={toggleSearch}
        filterOptions={selectedOptions}
        fuzzySearch={enableFuzzySearch}
      />
    </div>
  )
}
