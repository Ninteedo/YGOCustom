import {ReactElement} from "react";
import {AttributeIcon} from "./AttributeIcon.tsx";
import PendulumDualDiamondIcon from "../../../assets/images/icons/pendulum-dual-diamond.svg";

export function PendulumRating({ rating }: { rating: number | undefined }): ReactElement {
  if (rating === undefined) {
    return <></>;
  }
  return (
    <span>
      <AttributeIcon src={PendulumDualDiamondIcon} alt={"Pendulum Rating Icon"} title={"Pendulum Rating"}/>
      {rating}
    </span>
  );
}
