import BaseDbCard from "../abstract/BaseDbCard.tsx";
import ForbiddenIcon from "../../../assets/images/limited/0.svg";
import LimitedIcon from "../../../assets/images/limited/1.svg";
import SemiLimitedIcon from "../../../assets/images/limited/2.svg";
import UnlimitedIcon from "../../../assets/images/limited/3.svg";

interface LimitedStatusParams {
  card: BaseDbCard;
}

export default function LimitedStatus({card}: LimitedStatusParams) {
  if (card.limitedTcg === 3 && card.limitedOcg === 3) {
    return undefined;
  }

  return (
    <div className={"limited-container"}>
      <div>TCG: <img src={getLimitedImage(card.limitedTcg)} alt={"TCG Limited Status"}/></div>
      <div>OCG: <img src={getLimitedImage(card.limitedOcg)} alt={"OCG Limited Status"}/></div>
    </div>
  );
}

function getLimitedImage(limited: number): string {
  switch (limited) {
    case 0:
      return ForbiddenIcon;
    case 1:
      return LimitedIcon;
    case 2:
      return SemiLimitedIcon;
    case 3:
      return UnlimitedIcon;
    default:
      throw new Error(`Invalid limited value: ${limited}`);
  }
}
