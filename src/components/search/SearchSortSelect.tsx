import {ReactNode} from "react";
import Select, {ActionMeta, SingleValue} from "react-select";
import {SearchSort} from "./SearchSort.ts";
import {customSelectTheme} from "./SelectStyle.ts";

export interface SearchSortSelectProps {
  sorts: SearchSort[];
  selectedSort: SingleValue<SearchSort>;
  setSelectedSort: (selected: SingleValue<SearchSort>) => void;
  tabIndex: number;
}

export function SearchSortSelect({sorts, selectedSort, setSelectedSort, tabIndex}: SearchSortSelectProps): ReactNode {
  const handleChange = (selected: SingleValue<SearchSort>, _: ActionMeta<SearchSort>) => {
    setSelectedSort(selected);
  };

  return (
    <div className={"search-sort-container"}>
      <Select
        options={sorts}
        value={selectedSort}
        onChange={handleChange}
        className={"search-sort-select"}
        theme={customSelectTheme}
        tabIndex={tabIndex}
      />
    </div>
  )
}
