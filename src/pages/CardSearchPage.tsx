import {ReactNode, useEffect} from "react";
import SearchBox from "../components/search/SearchBox.tsx";
import {useLocation} from "react-router-dom";
import SearchProps from "../components/search/SearchProps.ts";
import {searchOptions} from "../components/search/SearchOptions.ts";
import {searchSorts} from "../components/search/SearchSort.ts";

export default function CardSearchPage(): ReactNode {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const indexedSearchOptions = searchOptions.filter((option) => params.has(option.value))
    .map((option) => ({...option, index: parseInt(params.get(option.value) || "0")}));

  const orderedSearchOptions = indexedSearchOptions.sort((a, b) => a.index - b.index);

  const initialSearch: SearchProps = {
    query: params.get("query") || "",
    options: orderedSearchOptions,
    fuzzy: params.has("fuzzy") && params.get("fuzzy") !== "false",
    sort: searchSorts[0],
  }

  useEffect(() => {
    document.title = `Card Search`;
  });

  const toggleSearch = () => {

  };

  return (
    <div>
      <SearchBox toggleSearch={toggleSearch} isSearchBoxOpen={true} isModal={false} initialSearch={initialSearch}/>
    </div>
  );
}
