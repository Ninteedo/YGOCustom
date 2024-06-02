import React, {useEffect, useState} from "react";
import '../../style/Card.scss';

interface CardArtProps {
  src: string;
  alt: string;
  canExpand?: boolean;
  overrideLink?: boolean;
}

const IMAGE_PATH = "/images/";

const CardArt: React.FC<CardArtProps> = ({src, alt, canExpand, overrideLink}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);

  let fullSrc = src;
  if (!overrideLink && !src.includes("http://") && !src.includes("https://")) {
    fullSrc = IMAGE_PATH + src;
  }

  return (
    <>
      <img
        className={`card-art ${isExpanded ? "expanded" : ""}`}
        src={fullSrc}
        alt={alt}
        onClick={toggleExpand}/>
      {isExpanded && canExpand && <div className={"overlay"} onClick={toggleExpand}>
          <img src={fullSrc} alt={alt}/>
      </div>}
    </>
  )
}

export {CardArt}
