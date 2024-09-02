import {MultiValue} from "react-select";
import {SearchOption} from "./SearchOptions.ts";
import {SearchSort} from "./SearchSort.ts";

export default interface SearchProps {
  query: string;
  options: MultiValue<SearchOption>;
  fuzzy: boolean;
  sort: SearchSort;
}
