import { ReciteMode } from '../types';

export interface ClozeToken {
  id: number;
  raw: string;
  isPunctuation: boolean;
  isHidden: boolean;
  isRevealed: boolean;
  maskDisplay: string;
}

// Check if character is Chinese/English punctuation or whitespace
export function isPunctuationChar(char: string): boolean {
  return /[\s，。、；：？！“”‘’（）《》【】—….,!?:;"'()\-—]/u.test(char);
}

/**
 * Tokenize and mask Chinese text for recitation
 */
export function generateChineseCloze(
  text: string,
  mode: ReciteMode,
  revealedTokenIds: Set<number>
): ClozeToken[] {
  const chars = Array.from(text);
  const tokens: ClozeToken[] = [];
  let charIndex = 0;

  // Track sentence start for 'firstWord' mode
  let isStartOfClause = true;

  chars.forEach((char, idx) => {
    const isPunct = isPunctuationChar(char);
    let shouldHide = false;

    if (!isPunct) {
      charIndex++;
      if (mode === 'cloze25') {
        // Deterministic mask every 4th char
        shouldHide = charIndex % 4 === 0;
      } else if (mode === 'cloze50') {
        shouldHide = charIndex % 2 === 0;
      } else if (mode === 'cloze75') {
        shouldHide = charIndex % 4 !== 1;
      } else if (mode === 'clozeAll') {
        shouldHide = true;
      } else if (mode === 'firstWord') {
        // Show only first character of clause
        shouldHide = !isStartOfClause;
      }
      isStartOfClause = false;
    } else {
      if (/[，。？！；]/.test(char)) {
        isStartOfClause = true;
      }
    }

    const isRevealed = revealedTokenIds.has(idx);

    tokens.push({
      id: idx,
      raw: char,
      isPunctuation: isPunct,
      isHidden: shouldHide && !isRevealed,
      isRevealed,
      maskDisplay: '＿',
    });
  });

  return tokens;
}

/**
 * Tokenize and mask English text for recitation
 */
export function generateEnglishCloze(
  text: string,
  mode: ReciteMode,
  revealedTokenIds: Set<number>
): ClozeToken[] {
  // Split words while keeping punctuation
  const regex = /([a-zA-Z0-9]+(?:'[a-zA-Z0-9]+)?|[^a-zA-Z0-9\s]+|\s+)/g;
  const matches = text.match(regex) || [text];
  const tokens: ClozeToken[] = [];
  let wordCount = 0;
  let isStartOfSentence = true;

  matches.forEach((token, idx) => {
    const isWord = /^[a-zA-Z0-9]/.test(token);
    let shouldHide = false;
    let mask = '_____';

    if (isWord) {
      wordCount++;
      if (mode === 'cloze25') {
        shouldHide = wordCount % 4 === 0;
      } else if (mode === 'cloze50') {
        shouldHide = wordCount % 2 === 0;
      } else if (mode === 'cloze75') {
        shouldHide = wordCount % 4 !== 1;
      } else if (mode === 'clozeAll') {
        shouldHide = true;
      } else if (mode === 'firstWord') {
        // First letter prompt
        shouldHide = !isStartOfSentence;
        if (shouldHide) {
          mask = `${token[0]}${'_'.repeat(Math.max(1, token.length - 1))}`;
        }
      }
      isStartOfSentence = false;
    } else {
      if (/[.!?]/.test(token)) {
        isStartOfSentence = true;
      }
    }

    const isRevealed = revealedTokenIds.has(idx);

    tokens.push({
      id: idx,
      raw: token,
      isPunctuation: !isWord,
      isHidden: shouldHide && !isRevealed,
      isRevealed,
      maskDisplay: mask,
    });
  });

  return tokens;
}
