import {ReactNode} from "react";
import ClipboardIcon from "../../../../../assets/images/icons/clipboard.svg";
import "../../../../../style/Clipboard.scss";

export default function CopyClipboardButton({text}: {text: string}): ReactNode {
  const doCopy = () => {
    navigator.clipboard.writeText(text);
    // briefly display a floating message that the text was copied
    const container = document.querySelector(".copy-clipboard-container");
    const el = document.createElement("div");
    if (!container) {
      return;
    }
    el.classList.add("copied-message");
    el.textContent = "Copied!";
    container.appendChild(el);
    setTimeout(() => {
      container.removeChild(el);
    }, 1000);
  }

  return (
    <div className={"copy-clipboard-container"}>
      <img
        className={"copy-clipboard"}
        onClick={doCopy}
        src={ClipboardIcon}
        alt={"Copy to clipboard"}
      />
    </div>
  );
}
