import BaseDbCard from "../abstract/BaseDbCard.tsx";
import ForbiddenIcon from "../../../assets/images/limited/0.svg";
import LimitedIcon from "../../../assets/images/limited/1.svg";
import SemiLimitedIcon from "../../../assets/images/limited/2.svg";
import UnlimitedIcon from "../../../assets/images/limited/3.svg";
import UnreleasedIcon from "../../../assets/images/limited/unreleased.svg";
import NeverReleasedIcon from "../../../assets/images/limited/never-released.svg";
import {ReactNode} from "react";

interface LimitedStatusParams {
  card: BaseDbCard;
}

export default function LimitedStatus({card}: LimitedStatusParams) {
  if (card.limitedTcg === 3 && card.limitedOcg === 3) {
    return undefined;
  }

  return (
    <div className={"limited-container"}>
      <div>TCG: {getLimitedElement(card.limitedTcg)}</div>
      <div>OCG: {getLimitedElement(card.limitedOcg)}</div>
    </div>
  );
}

function getLimitedElement(limited: number): ReactNode {
  function getSrc() {
    switch (limited) {
      case 0:
        return ForbiddenIcon;
      case 1:
        return LimitedIcon;
      case 2:
        return SemiLimitedIcon;
      case 3:
        return UnlimitedIcon;
      case 4:
        return UnreleasedIcon;
      case 5:
        return NeverReleasedIcon;
      default:
        throw new Error(`Invalid limited value: ${limited}`);
    }
  }

  function getAlt() {
    switch (limited) {
      case 0:
        return "Forbidden";
      case 1:
        return "Limited";
      case 2:
        return "Semi-Limited";
      case 3:
        return "Unlimited";
      case 4:
        return "Not yet released";
      case 5:
        return "Never released";
      default:
        throw new Error(`Invalid limited value: ${limited}`);
    }
  }

  return <img src={getSrc()} alt={getAlt()} title={getAlt()}/>;
}
