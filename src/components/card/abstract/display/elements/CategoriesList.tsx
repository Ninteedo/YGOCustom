import {ReactNode} from "react";

export default function CategoriesList({categories}: { categories: string[] }): ReactNode {
  return (
    <h5 className="categories">[{categories.map(category => `${category}`).join(" / ")}]</h5>
  );
}
