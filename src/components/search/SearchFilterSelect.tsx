import {ReactNode} from "react";
import Select, {ActionMeta, MultiValue} from "react-select";
import {SearchOption} from "./SearchOptions.ts";

export interface SearchFilterSelectProps {
  options: SearchOption[];
  selectedOptions: MultiValue<SearchOption>;
  setSelectedOptions: (selected: MultiValue<SearchOption>) => void;
  tabIndex: number;
}

export function SearchFilterSelect({options, selectedOptions, setSelectedOptions, tabIndex}: SearchFilterSelectProps): ReactNode {
  const handleChange = (selected: MultiValue<SearchOption>, _: ActionMeta<SearchOption>) => {
    setSelectedOptions(selected);
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
    <div className={"search-filter-container"}>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        className={"search-filter-select"}
        theme={customTheme}
        tabIndex={tabIndex}
      />
    </div>
  )
}
