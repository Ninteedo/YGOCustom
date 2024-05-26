import {ReactNode, useState} from "react";
import "../style/NavBar.scss";
import SearchBox from "./SearchBox.tsx";

export default function NavBar(): ReactNode {
  const [isSearchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <div className={"nav-bar"}>
      <div className={"logo"}>
        <img src={"vite.svg"} alt={"Logo"} />
      </div>
      <div className={"links"}>
        <a href={"#"}>Home</a>
      </div>
      <div className={"search"}>
        <button onClick={toggleSearch}>Search</button>
        <SearchBox isVisible={isSearchVisible} toggleSearch={toggleSearch} />
      </div>
    </div>
  )
}
