import {ReactNode} from "react";

export default function CardError({message}: { message: string }): ReactNode {
  return (
    <div className="card">
      <span className="card-error">{message}</span>
    </div>
  )
}
