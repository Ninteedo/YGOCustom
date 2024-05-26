import {ReactNode, useEffect} from "react";
import "../style/ModalOverlay.scss";

interface ModalOverlayProps {
  children: ReactNode;
  close: () => void;
  isVisible: boolean;
}

export default function ModalOverlay({children, close, isVisible}: ModalOverlayProps): ReactNode {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });

  return (
    <div className={`modal-overlay ${isVisible ? "visible" : "hidden"}`} onClick={close}>
      <div className={"modal-content"} onClick={event => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
