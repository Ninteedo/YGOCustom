import React, {useEffect, useState} from "react";
import '../../style/Card.scss';

interface CardArtProps {
  src: string;
  alt: string;
}

const IMAGE_PATH = "/images/";

const CardArt: React.FC<CardArtProps> = ({src, alt}) => {
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

  const fullSrc = IMAGE_PATH + src;

  return (
    <>
      <img
        className={`card-art ${isExpanded ? "expanded" : ""}`}
        src={fullSrc}
        alt={alt}
        onClick={toggleExpand}/>
      {isExpanded && <div className={"overlay"} onClick={toggleExpand}>
          <img src={fullSrc} alt={alt}/>
      </div>}
    </>
  )
}

export {CardArt}
