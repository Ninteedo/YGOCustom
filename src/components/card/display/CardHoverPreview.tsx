import BaseDbCard from "../abstract/BaseDbCard.ts";
import "../../../style/CardHoverPreview.scss";
import CardDetail from "./CardDetail.tsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

interface CardHoverPreviewProps {
  card: BaseDbCard;
  mousePos: {x: number, y: number};
}

export default function CardHoverPreview({card, mousePos}: CardHoverPreviewProps) {
  function useSize(el: HTMLElement | null): {w: number, h: number} {
    const [size, set] = useState({w: 0, h: 0});
    useLayoutEffect(() => {
      if (!el) return;
      const ro = new ResizeObserver(([e]) => {
        const r = e.target.getBoundingClientRect();
        set({w: r.width, h: r.height});
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [el]);
    return size;
  }

  const [position, setPosition] = useState({top: 0, left: 0});
  const ref = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(ref.current);

  useEffect(() => {
    const offset = 0;
    let left = mousePos.x + offset;
    let top  = mousePos.y + offset;

    const maxLeft = window.innerWidth  - w - offset;
    const maxTop  = window.innerHeight - h - offset;

    left = Math.max(0, Math.min(left, Math.max(0, maxLeft)));
    top  = Math.max(0, Math.min(top,  Math.max(0, maxTop)));

    setPosition({ top, left });
  }, [mousePos, w, h]);

  return (
    <div
      className="card-hover-preview"
      style={{top: position.top + 'px', left: position.left + 'px'}}
      ref={ref}
    >
      <CardDetail card={card}/>
    </div>
  )
}
