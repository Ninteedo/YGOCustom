import {ReactNode} from "react";

export default function StatLine({atk, def}: { atk: number, def: number }): ReactNode {
  return (
    <div className="statline">
      <span><span><b>ATK</b>/{atk}</span>&nbsp;<span><b>DEF</b>/{def}</span></span>
    </div>
  );
}
