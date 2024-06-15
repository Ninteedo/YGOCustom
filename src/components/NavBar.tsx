import {ReactNode, useState} from "react";
import "../style/NavBar.scss";
import SearchBox from "./search/SearchBox.tsx";
import ModalOverlay from "./ModalOverlay.tsx";
import {Link} from "react-router-dom";

export default function NavBar(): ReactNode {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchHasBeenVisible, setSearchHasBeenVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    setSearchHasBeenVisible(true);
  };

  return (
    <div className={"nav-bar"}>
      <div className={"logo"}>
        <img src={"vite.svg"} alt={"Logo"}/>
      </div>
      <div className={"links"}>
        <Link to={"/"}>Home</Link>
      </div>
      <div className={"search"}>
        <button onClick={toggleSearch}>Search</button>
        <ModalOverlay close={toggleSearch} isVisible={isSearchVisible}>
          {(isSearchVisible || searchHasBeenVisible) && <SearchBox toggleSearch={toggleSearch}/>}
        </ModalOverlay>
      </div>
    </div>
  )
}
