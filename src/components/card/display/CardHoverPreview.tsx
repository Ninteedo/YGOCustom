import {BaseCard} from "../abstract/BaseCard.ts";
import "../../../style/CardHoverPreview.scss";
import CardDetail from "./CardDetail.tsx";
import {useEffect, useRef, useState} from "react";

interface CardHoverPreviewProps {
  card: BaseCard;
  setIsHovering: (isHovering: boolean) => void;
  mousePos: {x: number, y: number};
}

export default function CardHoverPreview({card, setIsHovering, mousePos}: CardHoverPreviewProps) {
  const [position, setPosition] = useState({top: 0, left: 0});
  const [show, setShow] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!ref.current) {
        return;
      }

      const previewWidth = ref.current.clientWidth;
      const previewHeight = ref.current.clientHeight;
      const offset = 10;
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

  useEffect(() => {
    if (!show) {
      const timeoutId = setTimeout(() => setIsHovering(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [show, setIsHovering]);

  const handleMouseEnter = () => {
    setShow(true);
    setIsHovering(true);
  }

  const handleMouseLeave = () => {
    setShow(false);
    setIsHovering(false);
  }

  return (
    <div
      className={`card-hover-preview ${show ? 'fade-in' : 'fade-out'}`}
      style={{top: position.top + 'px', left: position.left + 'px'}}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <CardDetail card={card}/>
    </div>
  )
}
