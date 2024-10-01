import {ReactNode, useEffect, useState} from "react";
import '../../style/Card.scss';
import {LoadingSpinner} from "./LoadingSpinner.tsx";
import {LinkArrow} from "./display/link/LinkArrow.ts";
import {LinkArrows} from "./display/link/LinkArrows.tsx";

interface CardArtProps {
  src: string;
  alt: string;
  canExpand?: boolean;
  overrideLink?: boolean;
  linkArrows?: LinkArrow[];
}

export function CardArt({src, alt, canExpand, linkArrows}: CardArtProps): ReactNode {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState<string | null>(null); // Add error state

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

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error state when the src prop changes
    const controller = new AbortController(); // Create a new AbortController
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (!controller.signal.aborted) { // Check if the request has been cancelled
        setIsLoading(false);
        setImageSrc(src);
      }
    };

    img.onerror = (error) => {
      if (!controller.signal.aborted) { // Check if the request has been cancelled
        console.error('Failed to load image ' + src, error);
        setError((typeof error === "string" && error) || "An error occurred");
        setIsLoading(false);
      }
    };

    return () => {
      controller.abort(); // Cancel the request when the src prop changes
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  let imgElement;
  if (isLoading) {
    imgElement = <LoadingSpinner />;
  } else if (error || imageSrc.endsWith('unknown.jpg')) {
    imgElement = <img
      className={`card-art missing-art`}
      src={`${process.env.IMAGE_BASE_URL}/unknown.jpg`}
      alt={'Failed to load image'}
      draggable={false}
    />
  } else {
    imgElement = (
      <img
        className={`card-art ${isExpanded ? "expanded" : ""}`}
        src={imageSrc}
        alt={alt}
        onClick={toggleExpand}
        draggable={false}
      />
    );
  }

  let result = (
    <div className={"card-art-box"}>
      {imgElement}
      {isExpanded && canExpand && <div className={"overlay"} onClick={toggleExpand}>
          <img src={imageSrc} alt={alt}/>
      </div>}
    </div>
  );

  if (linkArrows) {
    result = <LinkArrows arrows={linkArrows} contents={result} />;
  }

  return result;
}
