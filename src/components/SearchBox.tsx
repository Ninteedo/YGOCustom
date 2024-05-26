import {ReactNode, useEffect} from "react";
import "../style/SearchBox.scss";

export default function SearchBox({isVisible, toggleSearch}: {
  isVisible: boolean,
  toggleSearch: () => void
}): ReactNode {
  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (isVisible) {
      body.classList.add("search-box-visible");
    } else {
      body.classList.remove("search-box-visible");
    }
  }, [isVisible]);

  return (
    <>
      <div className={"search-box " + (isVisible ? "visible" : "hidden")}>
        <div>
          <input type="text" name={"search-term"} className={"search-term"} placeholder={"Search"}/>
          <button className={"close-button"} onClick={toggleSearch}>x</button>
        </div>
        <div className={"results"}>
        </div>
      </div>
      <div className={"search-box-overlay" + (isVisible ? "" : " hidden")} onClick={toggleSearch}/>
    </>
  )
}
