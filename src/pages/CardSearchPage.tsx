import {ReactNode, useEffect} from "react";
import SearchBox from "../components/search/SearchBox.tsx";

export default function CardSearchPage(): ReactNode {
  useEffect(() => {
    document.title = `Card Search`;
  });

  const toggleSearch = () => {

  };

  return (
    <div>
      <SearchBox toggleSearch={toggleSearch} isSearchBoxOpen={true} isModal={false}/>
    </div>
  );
}
