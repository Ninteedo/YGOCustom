import {ReactNode} from "react";

export default function StatLine({atk, def}: { atk: number, def: number | null }): ReactNode {
  function formatStat(stat: number): string {
    if (stat === -1) {
      return "?";
    }
    return stat.toString();
  }

  return (
    <div className="statline">
      <span><span><b>ATK</b>/{formatStat(atk)}</span>&nbsp;{def && <span><b>DEF</b>/{formatStat(def)}</span>}</span>
    </div>
  );
}
