import React, {ReactNode, useEffect, useRef, useState} from "react";
import "../../style/SearchBox.scss";
import {SearchResults} from "./SearchResults.tsx";
import {SearchFilterSelect} from "./SearchFilterSelect.tsx";
import {MultiValue} from "react-select";
import {SearchOption, searchOptions} from "./SearchOptions.ts";
import {useNavigate} from "react-router-dom";
import SearchProps from "./SearchProps.ts";
import {searchSorts} from "./SearchSort.ts";
import {SearchSortSelect} from "./SearchSortSelect.tsx";

interface SearchBoxProps {
  toggleSearch: () => void;
  isSearchBoxOpen: boolean;
  isModal: boolean;
  initialSearch?: SearchProps;
}

export default function SearchBox({toggleSearch, isSearchBoxOpen, isModal, initialSearch}: SearchBoxProps): ReactNode {
  let initialQuery = "";
  let initialOptions: MultiValue<SearchOption> = [];
  let initialFuzzy = false;
  let initialSort = searchSorts[0];
  if (initialSearch) {
    initialQuery = initialSearch.query;
    initialOptions = initialSearch.options;
    initialFuzzy = initialSearch.fuzzy;
    initialSort = initialSearch.sort;
  }

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<SearchOption>>(initialOptions);
  const [enableFuzzySearch, setEnableFuzzySearch] = useState(initialFuzzy);
  const [sort, setSort] = useState(initialSort);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchBoxOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchBoxOpen]);

  useEffect(() => {
    if (isModal) {
      return;
    }

    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("query", searchTerm);
    }
    selectedOptions.forEach((option, index) => {
      params.append(option.value, index.toString());
    });
    if (enableFuzzySearch) {
      params.append("fuzzy", "true");
    }
    navigate({search: params.toString()});
  }, [searchTerm, selectedOptions, enableFuzzySearch, navigate, isModal]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const searchProps: SearchProps = {
    query: searchTerm,
    options: selectedOptions,
    fuzzy: enableFuzzySearch,
    sort,
  };

  return (
    <div className={"search-box" + (isModal ? " modal" : "")}>
      <div className={"search-term-container"}>
        <input
          type="text"
          name={"search-term"}
          className={"search-term"}
          placeholder={"Search..."}
          onInput={handleInput}
          ref={inputRef}
          tabIndex={1}
          value={searchTerm}
        />
        <label className={"toggle-fuzzy-container"}>
          Fuzzy<input
            type="checkbox"
            name={"fuzzy-search"}
            className={"fuzzy-search"}
            id={"fuzzy-search"}
            onChange={() => setEnableFuzzySearch(!enableFuzzySearch)}
            checked={enableFuzzySearch}
            tabIndex={3}
          />
        </label>
      </div>
      <div className={"search-options-container"}>
        <SearchFilterSelect
          options={searchOptions}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          tabIndex={2}
        />
        <SearchSortSelect
          sorts={searchSorts}
          selectedSort={sort}
          setSelectedSort={(selected) => setSort(selected as any)}
          tabIndex={4}
        />
      </div>
      <SearchResults search={searchProps} toggleSearch={toggleSearch}/>
    </div>
  )
}
