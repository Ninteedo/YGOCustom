import {ReactNode} from "react";

export default function CardLoading({id}: {id: string}): ReactNode {
  return (
    <div className="card">
      <span className="card-loading">Loading card {id}...</span>
    </div>
  )
}
