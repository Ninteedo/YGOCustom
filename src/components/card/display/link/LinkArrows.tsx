import {CSSProperties, ReactNode} from "react";
import LinkArrowFilled from "../../../../assets/images/icons/link-arrow-filled.svg";
import LinkArrowEmpty from "../../../../assets/images/icons/link-arrow-empty.svg";
import LinkArrowFilledCorner from "../../../../assets/images/icons/link-arrow-filled-corner.svg";
import LinkArrowEmptyCorner from "../../../../assets/images/icons/link-arrow-empty-corner.svg";
import {LinkArrow, linkArrowOrdered} from "./LinkArrow.ts";

interface LinkArrowProps {
  arrows: LinkArrow[];
  contents: ReactNode;
}

export function LinkArrows({arrows, contents}: LinkArrowProps) {
  const arrowSources: string[] = linkArrowOrdered.map(arrow => linkArrowImage(arrows.includes(arrow), arrow % 2 === 1));

  return <div>
    <div className="link-arrows-container">
      {arrowSources.map((source, index) =>
        <img key={index} src={source} style={linkArrowStyle(index as LinkArrow)}/>)}
      {contents}
    </div>

  </div>;
}

function linkArrowAngle(arrow: LinkArrow): number {
  return arrow * 45 + 180;
}

function linkArrowStyle(arrow: LinkArrow): CSSProperties {
  const positions: Record<LinkArrow, CSSProperties> = {
    [LinkArrow.TOP]: { top: "-12px", left: "50%", transform: "translateX(-50%)" },         // Top center
    [LinkArrow.TOP_RIGHT]: { top: "0", right: "0", transform: "translate(50%, -50%)" },     // Top right
    [LinkArrow.RIGHT]: { top: "50%", right: "-20px", transform: "translateY(-50%)" },       // Right center
    [LinkArrow.BOTTOM_RIGHT]: { bottom: "0", right: "0", transform: "translate(50%, 50%)" }, // Bottom right
    [LinkArrow.BOTTOM]: { bottom: "-12px", left: "50%", transform: "translateX(-50%)" },   // Bottom center
    [LinkArrow.BOTTOM_LEFT]: { bottom: "0", left: "0", transform: "translate(-50%, 50%)" }, // Bottom left
    [LinkArrow.LEFT]: { top: "50%", left: "-20px", transform: "translateY(-50%)" },         // Left center
    [LinkArrow.TOP_LEFT]: { top: "0", left: "0", transform: "translate(-50%, -50%)" },       // Top left
  };

  return {
    ...positions[arrow],
    position: "absolute",
    transform: `${positions[arrow].transform} rotate(${linkArrowAngle(arrow)}deg)`,  // Add rotation based on arrow direction
    transformOrigin: "center",
  };
}

function linkArrowImage(isFilled: boolean, isCorner: boolean): string {
  if (isFilled) {
    return isCorner ? LinkArrowFilledCorner : LinkArrowFilled;
  } else {
    return isCorner ? LinkArrowEmptyCorner : LinkArrowEmpty;
  }
}
