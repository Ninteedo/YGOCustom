import {ReactNode} from "react";
import {Link} from "react-router-dom";

export default function CardName({name, id, link}: { name: string, id: string, link: boolean }): ReactNode {
  const inner = link ? <Link to={`/card/custom/${id}`}>{name}</Link> : name;
  return <h3 className="card-name">{inner}</h3>;
}
