import {MultiValue} from "react-select";
import {SearchOption} from "./SearchOptions.ts";

export default interface SearchProps {
  query: string;
  options: MultiValue<SearchOption>;
  fuzzy: boolean;
}
