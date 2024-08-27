import BaseDbCard from "../abstract/BaseDbCard.ts";
import "../../../style/CardHoverPreview.scss";
import CardDetail from "./CardDetail.tsx";
import {useEffect, useRef, useState} from "react";

interface CardHoverPreviewProps {
  card: BaseDbCard;
  mousePos: {x: number, y: number};
}

export default function CardHoverPreview({card, mousePos}: CardHoverPreviewProps) {
  const [position, setPosition] = useState({top: 0, left: 0});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!ref.current) {
        return;
      }

      const previewWidth = ref.current.clientWidth;
      const previewHeight = ref.current.clientHeight;
      const offset = 0;
      let newLeft = mousePos.x + offset;
      let newTop = mousePos.y + offset;

      if (newLeft + previewWidth > window.innerWidth) {
        newLeft = window.innerWidth - previewWidth - offset;
      }
      if (newTop + previewHeight > window.innerHeight) {
        newTop = window.innerHeight - previewHeight - offset;
      }

      setPosition({top: newTop, left: newLeft});
    }

    updatePosition();
  }, [mousePos, ref]);

  return (
    <div
      className={`card-hover-preview`}
      style={{top: position.top + 'px', left: position.left + 'px'}}
      ref={ref}
    >
      <CardDetail card={card}/>
    </div>
  )
}
