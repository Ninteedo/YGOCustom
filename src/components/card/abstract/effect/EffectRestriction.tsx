import {Fragment, ReactNode} from "react";

export default class EffectRestriction {
  public readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  render(index: number, cardId: string): ReactNode {
    const richContent = richEffectRestriction(this.content, cardId);
    return <span className="effect-restriction" key={index}>{richContent}&nbsp;</span>;
  }
}

/**
 * Add hover listeners to occurrences of effect references in the content.
 *
 * These appear as numbers in brackets, e.g. (1), (2), etc.
 * Numbers are 1-indexed and are not expected to be more than one digit.
 *
 * @param content - The content to add hover listeners to.
 * @param cardId - The ID of the card that the content is associated with.
 */
function richEffectRestriction(content: string, cardId: string): ReactNode {
  const regex = /\((\d)\)/g;
  const parts = content.split(regex);

  const enrichedContent = parts.map((part, index) => {
    if (/^\((\d)\)$/g.test(part) || /^\d$/g.test(part)) {
      const effectNumber = parseInt(part.replace(regex, "$1"), 10);
      return (
        <span
          className="effect-reference"
          key={index}
          onMouseOver={() => setEffectHighlight(effectNumber, cardId, true)}
          onMouseOut={() => setEffectHighlight(effectNumber, cardId, false)}
        >
          {"(" + part + ")"}
        </span>
      );
    } else {
      return part;
    }
  });

  return <Fragment>{enrichedContent}</Fragment>;
}

function setEffectHighlight(effectNumber: number, cardId: string, toHighlight: boolean) {
  const selector = `.card[data-card-id="${cardId}"] .effect-list li[data-effect-index="${effectNumber}"]`;
  const effect = document.querySelector(selector);
  if (effect) {
    if (toHighlight) {
      effect.classList.add("highlight");
    } else {
      effect.classList.remove("highlight");
    }
  }
}

export function parseEffectRestrictions(restrictions: string[] | string): EffectRestriction[] {
  if (typeof restrictions === "string") {
    return [new EffectRestriction(restrictions)];
  }
  return restrictions.map((restriction) => new EffectRestriction(restriction));
}
