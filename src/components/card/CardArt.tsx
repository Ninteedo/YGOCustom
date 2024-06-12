import React, { useEffect, useState } from "react";
import '../../style/Card.scss';
import {LoadingSpinner} from "./LoadingSpinner.tsx";

interface CardArtProps {
  src: string;
  alt: string;
  canExpand?: boolean;
  overrideLink?: boolean;
}

const IMAGE_PATH = "/images/";

const CardArt: React.FC<CardArtProps> = ({src, alt, canExpand, overrideLink}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState<string>(null); // Add error state

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

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = fullSrc;
    img.onload = () => {
      setIsLoading(false);
      setImageSrc(fullSrc);
    };
    img.onerror = (error) => {
      console.error('Failed to load image ' + fullSrc, error);
      setError(error); // Set error state when an error occurs
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [fullSrc]);

  return (
    <>
      {isLoading ? <LoadingSpinner /> :
        error ? <div>Error loading image</div> : // Display error message when an error occurs
        <img
          className={`card-art ${isExpanded ? "expanded" : ""}`}
          src={imageSrc}
          alt={alt}
          onClick={toggleExpand}/>
      }
      {isExpanded && canExpand && <div className={"overlay"} onClick={toggleExpand}>
          <img src={fullSrc} alt={alt}/>
      </div>}
    </>
  )
}

export {CardArt}
