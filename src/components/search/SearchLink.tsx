import {SearchOption} from "./SearchOptions.ts";
import {ReactElement} from "react";
import {Link} from "react-router-dom";

export function SearchLink({ children, searchTerm, filterOptions }: { children: ReactElement, searchTerm: string, filterOptions: SearchOption[] }): ReactElement {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("query", searchTerm);
  }
  filterOptions.forEach((option, index) => {
    params.append(option.value, index.toString());
  });

  return (
    <Link to={{ pathname: "/", search: `?${params.toString()}` }}>
      {children}
    </Link>
  );
}
