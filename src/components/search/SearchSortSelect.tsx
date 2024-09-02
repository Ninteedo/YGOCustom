import {ReactNode} from "react";
import Select, {ActionMeta, SingleValue} from "react-select";
import {SearchSort} from "./SearchSort.ts";

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

  const customTheme = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#333',
      primary: '#555',
      neutral0: '#222', // background color
      neutral80: '#fff', // font color
      neutral50: '#888', // border color
      neutral20: '#444', // hover color
      neutral5: '#666', // selected color
      neutral10: '#555', // selected hover color
      neutral30: '#333', // selected border color
      neutral40: '#222', // selected font color
    },
  });

  return (
    <div className={"search-sort-container"}>
      <Select
        options={sorts}
        value={selectedSort}
        onChange={handleChange}
        className={"search-sort-select"}
        theme={customTheme}
        tabIndex={tabIndex}
      />
    </div>
  )
}
