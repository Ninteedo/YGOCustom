import {ReactNode} from "react";
import Select, {ActionMeta, MultiValue} from "react-select";
import {SearchOption, SearchOptionGroup} from "./SearchOptions.ts";
import {customSelectTheme} from "./SelectStyle.ts";

export interface SearchFilterSelectProps {
  options: SearchOptionGroup[];
  selectedOptions: MultiValue<SearchOption>;
  setSelectedOptions: (selected: MultiValue<SearchOption>) => void;
  tabIndex: number;
}

export function SearchFilterSelect({options, selectedOptions, setSelectedOptions, tabIndex}: SearchFilterSelectProps): ReactNode {
  const handleChange = (selected: MultiValue<SearchOption>, _: ActionMeta<SearchOption>) => {
    setSelectedOptions(selected);
  };

  return (
    <div className={"search-filter-container"}>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        className={"search-filter-select"}
        theme={customSelectTheme}
        tabIndex={tabIndex}
        placeholder={"Filter..."}
      />
    </div>
  )
}
