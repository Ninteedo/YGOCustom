import EffectClause from "./EffectClause.ts";
import {EffectMain} from "../../../EffectText.tsx";
import {ReactNode} from "react";
import {SearchOption} from "../../../../search/SearchOptions.ts";
import {SearchLink} from "../../../../search/SearchLink.tsx";

export default class EffectMainClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    // return EffectMain(this.contents);

    const splits = splitMainByConjunctions(this.contents);
    return EffectMain(splits.map(split => split.render()));
  }

  public toText(): string {
    return this.contents;
  }
}

function splitMainByConjunctions(mainText: string): EffectClause[] {
  const clauses: EffectClause[] = [];
  const regexForQuotes = /"(.*?)"/g; // Regex to capture anything inside quotes
  const parts: { text: string; isQuoted: boolean }[] = [];
  let match: RegExpExecArray | null;

  // First, split the text by quoted parts
  let lastIndex = 0;
  while ((match = regexForQuotes.exec(mainText)) !== null) {
    const beforeQuote = mainText.slice(lastIndex, match.index);
    const quotedText = match[0];

    // Add the text before the quote (to be split by conjunctions later)
    if (beforeQuote) {
      parts.push({ text: beforeQuote, isQuoted: false });
    }

    // Add the quoted text as-is
    parts.push({ text: quotedText, isQuoted: true });

    lastIndex = regexForQuotes.lastIndex;
  }

  // Add the remaining unquoted text after the last quote
  const afterLastQuote = mainText.slice(lastIndex);
  if (afterLastQuote) {
    parts.push({ text: afterLastQuote, isQuoted: false });
  }

  // Function to add text as a clause (preserving leading/trailing spaces)
  const addClauseWithWhitespace = (text: string, isConjunction: boolean = false) => {
    if (isConjunction) {
      clauses.push(new MainConjunctionClause(text));
    } else {
      const trimmedText = text.trim();
      if (trimmedText.startsWith("\"") && trimmedText.endsWith("\"")) {
        clauses.push(new MainNamedClause(trimmedText));
      } else {
        clauses.push(new MainMiniClause(text));
      }
    }
  };

  // Now, process each part separately
  parts.forEach(part => {
    if (part.isQuoted) {
      // If it's a quoted part, treat it as a single MainMiniClause
      addClauseWithWhitespace(part.text);
    } else {
      // If it's not quoted, split by conjunctions
      let remainingText = part.text;

      conjunctions.forEach((conjunction) => {
        const regex = new RegExp(`(\\s*)( ${conjunction.text})(\\s*)`, 'i'); // Capture spaces around conjunctions
        let match = remainingText.match(regex);

        while (match) {
          const [beforeConjunction, afterConjunction] = [
            remainingText.slice(0, match.index),
            remainingText.slice(match.index! + match[0].length),
          ];

          if (beforeConjunction) {
            addClauseWithWhitespace(beforeConjunction); // Preserve text before conjunction
          }

          // Add conjunction with any surrounding whitespace
          const conjunctionWithWhitespace = `${match[1]}${match[2]}${match[3]}`;
          addClauseWithWhitespace(conjunctionWithWhitespace, true);

          remainingText = afterConjunction;

          match = remainingText.match(regex);
        }
      });

      // Push any remaining text as the last clause
      if (remainingText) {
        addClauseWithWhitespace(remainingText);
      }
    }
  });

  return clauses;
}


class MainMiniClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return EffectMain(this.contents, true);
  }

  public toText(): string {
    return this.contents;
  }
}

class MainConjunctionClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return <span className={"effect-conjunction"}>{this.contents}</span>;
  }

  public toText(): string {
    return this.contents;
  }
}

export class MainSearchClause implements EffectClause {
  public readonly contents: string;
  public readonly searchTerm: string;
  public readonly searchOptions: SearchOption[];

  constructor(contents: string, searchTerm: string, searchOptions: SearchOption[]) {
    this.contents = contents;
    this.searchTerm = searchTerm;
    this.searchOptions = searchOptions;
  }

  public render(): ReactNode {
    return (
      <SearchLink searchTerm={this.searchTerm} filterOptions={this.searchOptions}>
        <span>{this.contents}</span>
      </SearchLink>
    );
  }

  public toText(): string {
    return this.contents;
  }
}

class MainNamedClause implements EffectClause {
  public readonly contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public render(): ReactNode {
    return <span className={"effect-name"}>{this.contents}</span>;
  }

  public toText(): string {
    return this.contents;
  }
}

interface ConjunctionDefinition {
  text: string;
  isSimultaneous: boolean;
  isConditional: boolean;
  bothRequired: boolean;
}

const conjunctions: ConjunctionDefinition[] = [
  {text: "then", isSimultaneous: false, isConditional: true, bothRequired: false},
  {text: "also", isSimultaneous: true, isConditional: false, bothRequired: false},
  {text: "and if you do", isSimultaneous: true, isConditional: true, bothRequired: false},
  {text: "and", isSimultaneous: true, isConditional: false, bothRequired: true},
];
