import {ReactNode, useEffect} from "react";
import SearchBox from "../components/SearchBox.tsx";

export default function CardSearchPage(): ReactNode {
  useEffect(() => {
    document.title = `Card Search`;
  });

  const toggleSearch = () => {

  };

  return (
    <div>
      <SearchBox toggleSearch={toggleSearch}/>
    </div>
  );
}
