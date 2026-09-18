import { BibleVerse } from '../types';
import { BIBLE_MEMORY_VERSES, findVerseInDatabase } from '../data/bibleVerses';

// Standard mapping of English Bible book names to Chinese Union Version names
export const BIBLE_BOOKS_MAP: Record<string, { zh: string; en: string; testament: 'OT' | 'NT' }> = {
  // Old Testament
  genesis: { zh: '创世记', en: 'Genesis', testament: 'OT' },
  exodus: { zh: '出埃及记', en: 'Exodus', testament: 'OT' },
  leviticus: { zh: '利未记', en: 'Leviticus', testament: 'OT' },
  numbers: { zh: '民数记', en: 'Numbers', testament: 'OT' },
  deuteronomy: { zh: '申命记', en: 'Deuteronomy', testament: 'OT' },
  joshua: { zh: '约书亚记', en: 'Joshua', testament: 'OT' },
  judges: { zh: '士师记', en: 'Judges', testament: 'OT' },
  ruth: { zh: '路得记', en: 'Ruth', testament: 'OT' },
  '1 samuel': { zh: '撒母耳记上', en: '1 Samuel', testament: 'OT' },
  '2 samuel': { zh: '撒母耳记下', en: '2 Samuel', testament: 'OT' },
  '1 kings': { zh: '列王纪上', en: '1 Kings', testament: 'OT' },
  '2 kings': { zh: '列王纪下', en: '2 Kings', testament: 'OT' },
  '1 chronicles': { zh: '历代志上', en: '1 Chronicles', testament: 'OT' },
  '2 chronicles': { zh: '历代志下', en: '2 Chronicles', testament: 'OT' },
  ezra: { zh: '以斯拉记', en: 'Ezra', testament: 'OT' },
  nehemiah: { zh: '尼希米记', en: 'Nehemiah', testament: 'OT' },
  esther: { zh: '以斯帖记', en: 'Esther', testament: 'OT' },
  job: { zh: '约伯记', en: 'Job', testament: 'OT' },
  psalms: { zh: '诗篇', en: 'Psalms', testament: 'OT' },
  psalm: { zh: '诗篇', en: 'Psalms', testament: 'OT' },
  proverbs: { zh: '箴言', en: 'Proverbs', testament: 'OT' },
  ecclesiastes: { zh: '传道书', en: 'Ecclesiastes', testament: 'OT' },
  'song of solomon': { zh: '雅歌', en: 'Song of Solomon', testament: 'OT' },
  isaiah: { zh: '以赛亚书', en: 'Isaiah', testament: 'OT' },
  jeremiah: { zh: '耶利米书', en: 'Jeremiah', testament: 'OT' },
  lamentations: { zh: '耶利米哀歌', en: 'Lamentations', testament: 'OT' },
  ezekiel: { zh: '以西结书', en: 'Ezekiel', testament: 'OT' },
  daniel: { zh: '但以理书', en: 'Daniel', testament: 'OT' },
  hosea: { zh: '何西阿书', en: 'Hosea', testament: 'OT' },
  joel: { zh: '约珥书', en: 'Joel', testament: 'OT' },
  amos: { zh: '阿摩司书', en: 'Amos', testament: 'OT' },
  obadiah: { zh: '俄巴底亚书', en: 'Obadiah', testament: 'OT' },
  jonah: { zh: '约拿书', en: 'Jonah', testament: 'OT' },
  micah: { zh: '弥迦书', en: 'Micah', testament: 'OT' },
  nahum: { zh: '那鸿书', en: 'Nahum', testament: 'OT' },
  habakkuk: { zh: '哈巴谷书', en: 'Habakkuk', testament: 'OT' },
  zephaniah: { zh: '西番雅书', en: 'Zephaniah', testament: 'OT' },
  haggai: { zh: '哈该书', en: 'Haggai', testament: 'OT' },
  zechariah: { zh: '撒迦利亚书', en: 'Zechariah', testament: 'OT' },
  malachi: { zh: '玛拉基书', en: 'Malachi', testament: 'OT' },

  // New Testament
  matthew: { zh: '马太福音', en: 'Matthew', testament: 'NT' },
  mark: { zh: '马可福音', en: 'Mark', testament: 'NT' },
  luke: { zh: '路加福音', en: 'Luke', testament: 'NT' },
  john: { zh: '约翰福音', en: 'John', testament: 'NT' },
  acts: { zh: '使徒行传', en: 'Acts', testament: 'NT' },
  romans: { zh: '罗马书', en: 'Romans', testament: 'NT' },
  '1 corinthians': { zh: '哥林多前书', en: '1 Corinthians', testament: 'NT' },
  '2 corinthians': { zh: '哥林多后书', en: '2 Corinthians', testament: 'NT' },
  galatians: { zh: '加拉太书', en: 'Galatians', testament: 'NT' },
  ephesians: { zh: '以弗所书', en: 'Ephesians', testament: 'NT' },
  philippians: { zh: '腓立比书', en: 'Philippians', testament: 'NT' },
  colossians: { zh: '歌罗西书', en: 'Colossians', testament: 'NT' },
  '1 thessalonians': { zh: '帖撒罗尼迦前书', en: '1 Thessalonians', testament: 'NT' },
  '2 thessalonians': { zh: '帖撒罗尼迦后书', en: '2 Thessalonians', testament: 'NT' },
  '1 timothy': { zh: '提摩太前书', en: '1 Timothy', testament: 'NT' },
  '2 timothy': { zh: '提摩太后书', en: '2 Timothy', testament: 'NT' },
  titus: { zh: '提多书', en: 'Titus', testament: 'NT' },
  philemon: { zh: '腓利门书', en: 'Philemon', testament: 'NT' },
  hebrews: { zh: '希伯来书', en: 'Hebrews', testament: 'NT' },
  james: { zh: '雅各书', en: 'James', testament: 'NT' },
  '1 peter': { zh: '彼得前书', en: '1 Peter', testament: 'NT' },
  '2 peter': { zh: '彼得后书', en: '2 Peter', testament: 'NT' },
  '1 john': { zh: '约翰一书', en: '1 John', testament: 'NT' },
  '2 john': { zh: '约翰二书', en: '2 John', testament: 'NT' },
  '3 john': { zh: '约翰三书', en: '3 John', testament: 'NT' },
  jude: { zh: '犹大书', en: 'Jude', testament: 'NT' },
  revelation: { zh: '启示录', en: 'Revelation', testament: 'NT' },
};

// Chinese to English book map for Chinese input queries like "约翰福音 1:5-7"
export const ZH_TO_EN_BOOKS: Record<string, string> = {
  创世记: 'Genesis',
  出埃及记: 'Exodus',
  利未记: 'Leviticus',
  民数记: 'Numbers',
  申命记: 'Deuteronomy',
  约书亚记: 'Joshua',
  士师记: 'Judges',
  路得记: 'Ruth',
  撒母耳记上: '1 Samuel',
  撒母耳记下: '2 Samuel',
  列王纪上: '1 Kings',
  列王纪下: '2 Kings',
  历代志上: '1 Chronicles',
  历代志下: '2 Chronicles',
  以斯拉记: 'Ezra',
  尼希米记: 'Nehemiah',
  以斯帖记: 'Esther',
  约伯记: 'Job',
  诗篇: 'Psalms',
  箴言: 'Proverbs',
  传道书: 'Ecclesiastes',
  雅歌: 'Song of Solomon',
  以赛亚书: 'Isaiah',
  耶利米书: 'Jeremiah',
  耶利米哀歌: 'Lamentations',
  以西结书: 'Ezekiel',
  但以理书: 'Daniel',
  何西阿书: 'Hosea',
  约珥书: 'Joel',
  阿摩司书: 'Amos',
  俄巴底亚书: 'Obadiah',
  约拿书: 'Jonah',
  弥迦书: 'Micah',
  那鸿书: 'Nahum',
  哈巴谷书: 'Habakkuk',
  西番雅书: 'Zephaniah',
  哈该书: 'Haggai',
  撒迦利亚书: 'Zechariah',
  玛拉基书: 'Malachi',
  马太福音: 'Matthew',
  马可福音: 'Mark',
  路加福音: 'Luke',
  约翰福音: 'John',
  使徒行传: 'Acts',
  罗马书: 'Romans',
  哥林多前书: '1 Corinthians',
  哥林多后书: '2 Corinthians',
  加拉太书: 'Galatians',
  以弗所书: 'Ephesians',
  腓立比书: 'Philippians',
  歌罗西书: 'Colossians',
  帖撒罗尼迦前书: '1 Thessalonians',
  帖撒罗尼迦后书: '2 Thessalonians',
  提摩太前书: '1 Timothy',
  提摩太后书: '2 Timothy',
  提多书: 'Titus',
  腓利门书: 'Philemon',
  希伯来书: 'Hebrews',
  雅各书: 'James',
  彼得前书: '1 Peter',
  彼得后书: '2 Peter',
  约翰一书: '1 John',
  约翰二书: '2 John',
  约翰三书: '3 John',
  犹大书: 'Jude',
  启示录: 'Revelation',
};

// Chinese book abbreviations map (e.g. "约 3:16", "罗 8:28", "诗 23:1")
export const ZH_BOOK_ABBREVIATIONS: Record<string, string> = {
  创: '创世记',
  出: '出埃及记',
  利: '利未记',
  民: '民数记',
  申: '申命记',
  约书: '约书亚记',
  书: '约书亚记',
  士: '士师记',
  得: '路得记',
  撒上: '撒母耳记上',
  撒下: '撒母耳记下',
  王上: '列王纪上',
  王下: '列王纪下',
  代上: '历代志上',
  代下: '历代志下',
  拉: '以斯拉记',
  尼: '尼希米记',
  斯: '以斯帖记',
  伯: '约伯记',
  诗: '诗篇',
  箴: '箴言',
  传: '传道书',
  歌: '雅歌',
  赛: '以赛亚书',
  耶: '耶利米书',
  哀: '耶利米哀歌',
  结: '以西结书',
  但: '但以理书',
  何: '何西阿书',
  珥: '约珥书',
  摩: '阿摩司书',
  俄: '俄巴底亚书',
  拿: '约拿书',
  弥: '弥迦书',
  鸿: '那鸿书',
  哈: '哈巴谷书',
  番: '西番雅书',
  该: '哈该书',
  亚: '撒迦利亚书',
  玛: '玛拉基书',
  太: '马太福音',
  可: '马可福音',
  路: '路加福音',
  约: '约翰福音',
  徒: '使徒行传',
  罗: '罗马书',
  林前: '哥林多前书',
  林后: '哥林多后书',
  加: '加拉太书',
  弗: '以弗所书',
  腓: '腓立比书',
  西: '歌罗西书',
  帖前: '帖撒罗尼迦前书',
  帖后: '帖撒罗尼迦后书',
  提前: '提摩太前书',
  提后: '提摩太后书',
  多: '提多书',
  门: '腓利门书',
  来: '希伯来书',
  雅: '雅各书',
  彼前: '彼得前书',
  彼后: '彼得后书',
  约一: '约翰一书',
  约二: '约翰二书',
  约三: '约翰三书',
  犹: '犹大书',
  启: '启示录',
};

/**
 * Converts Chinese oral numbers (e.g. "三", "十六", "一百二十") to numeric string
 */
function chineseNumberToArabic(str: string): number {
  const map: Record<string, number> = {
    零: 0,
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };
  if (!str) return 0;
  if (/^\d+$/.test(str)) return parseInt(str, 10);

  let result = 0;
  let temp = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (map[char] !== undefined) {
      temp = map[char];
    } else if (char === '十') {
      if (temp === 0) temp = 1;
      result += temp * 10;
      temp = 0;
    } else if (char === '百') {
      result += temp * 100;
      temp = 0;
    }
  }
  result += temp;
  return result;
}

/**
 * Normalizes spoken oral Chinese verse references like:
 * "约翰福音第三章十六节" -> "约翰福音 3:16"
 * "罗马书八章二十八节" -> "罗马书 8:28"
 * "诗篇二十三篇一到三节" -> "诗篇 23:1-3"
 * "约 3:16" -> "约翰福音 3:16"
 */
export function parseOralOrAbbrevChineseReference(input: string): string {
  let text = input.trim();

  // Replace spoken phrases like "第", "章", "篇", "节", "至", "到"
  // e.g. "约翰福音第三章十六节" or "约翰福音 3章16节"
  const oralRegex = /([\u4e00-\u9fa5]+?)(?:第)?([一二两三四五六七八九十百\d]+)(?:章|篇)(?:(?:第)?([一二两三四五六七八九十百\d]+)(?:节)?)?(?:(?:至|到|-)(?:第)?([一二两三四五六七八九十百\d]+)(?:节)?)?/;
  const match = text.match(oralRegex);

  if (match) {
    const bookPart = match[1].trim();
    const chapterNum = chineseNumberToArabic(match[2]);
    const startVerseNum = match[3] ? chineseNumberToArabic(match[3]) : 1;
    const endVerseNum = match[4] ? chineseNumberToArabic(match[4]) : undefined;

    // Resolve book if abbreviated
    let resolvedBook = bookPart;
    if (ZH_BOOK_ABBREVIATIONS[bookPart]) {
      resolvedBook = ZH_BOOK_ABBREVIATIONS[bookPart];
    }

    if (chapterNum > 0) {
      if (endVerseNum) {
        return `${resolvedBook} ${chapterNum}:${startVerseNum}-${endVerseNum}`;
      } else {
        return `${resolvedBook} ${chapterNum}:${startVerseNum}`;
      }
    }
  }

  // Check abbreviation prefix (e.g. "约 3:16", "罗 8:28")
  for (const [abbr, fullBook] of Object.entries(ZH_BOOK_ABBREVIATIONS)) {
    if (text.startsWith(abbr)) {
      const rest = text.slice(abbr.length).trim();
      if (/^[\d:]/.test(rest)) {
        return `${fullBook} ${rest}`;
      }
    }
  }

  return text;
}

/**
 * Normalizes query string like "约翰福音 1:5-7" or "约 1:5-7" to standard English ref like "John 1:5-7"
 */
export function normalizeScriptureReference(input: string): { enRef: string; zhRef: string } {
  const parsed = parseOralOrAbbrevChineseReference(input);
  let cleaned = parsed.trim();

  for (const [zhBook, enBook] of Object.entries(ZH_TO_EN_BOOKS)) {
    if (cleaned.startsWith(zhBook)) {
      const rest = cleaned.slice(zhBook.length).trim();
      return {
        enRef: `${enBook} ${rest}`,
        zhRef: `${zhBook} ${rest}`,
      };
    }
  }
  return {
    enRef: cleaned,
    zhRef: cleaned,
  };
}

/**
 * Searches the local database by verse text content or keyword
 * (e.g. user speaks "神爱世人" or "耶和华是我的牧者" or "当刚强壮胆")
 */
export function searchVersesByTextContent(keyword: string): BibleVerse[] {
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword || cleanKeyword.length < 2) return [];

  // Remove common punctuation
  const stripped = cleanKeyword.replace(/[，。、！？：；“”"'\s]/g, '');

  return BIBLE_MEMORY_VERSES.filter((verse) => {
    const zhClean = verse.textZh.replace(/[，。、！？：；“”"'\s]/g, '').toLowerCase();
    const zhTradClean = (verse.textZhTrad || '').replace(/[，。、！？：；“”"'\s]/g, '').toLowerCase();
    const enClean = verse.textEn.toLowerCase();

    return (
      zhClean.includes(stripped) ||
      zhTradClean.includes(stripped) ||
      enClean.includes(cleanKeyword) ||
      verse.referenceZh.toLowerCase().includes(cleanKeyword) ||
      verse.referenceEn.toLowerCase().includes(cleanKeyword)
    );
  });
}

/**
 * High-level scripture locator: handles oral speech, reference abbreviations,
 * and text recitation speech. Returns best match or null.
 */
export async function locateScripture(query: string): Promise<{
  type: 'reference' | 'content';
  verse: BibleVerse | null;
  candidates: BibleVerse[];
}> {
  const trimmed = query.trim();
  if (!trimmed) return { type: 'reference', verse: null, candidates: [] };

  // 1. Try normalizing as reference (supports oral speech like "约翰福音第三章十六节")
  const { enRef, zhRef } = normalizeScriptureReference(trimmed);

  // Check if query looks like a reference (contains numbers/chapters)
  const isRefPattern = /[\d一二三四五六七八九十]+/.test(trimmed) && (
    trimmed.includes('章') || trimmed.includes('篇') || trimmed.includes(':') || trimmed.includes(' ')
  );

  if (isRefPattern) {
    const localMatch = findVerseInDatabase(zhRef) || findVerseInDatabase(enRef) || findVerseInDatabase(trimmed);
    if (localMatch) {
      return { type: 'reference', verse: localMatch, candidates: [localMatch] };
    }
    // Try external public API
    const remote = await fetchFreeBibleVerse(enRef);
    if (remote) {
      return { type: 'reference', verse: remote, candidates: [remote] };
    }
  }

  // 2. Full-text search for spoken or typed scripture words
  const contentMatches = searchVersesByTextContent(trimmed);
  if (contentMatches.length > 0) {
    return {
      type: 'content',
      verse: contentMatches[0],
      candidates: contentMatches,
    };
  }

  // 3. Fallback: try direct fetch in case user entered simple English ref e.g. "Rom 8:28"
  const remote = await fetchFreeBibleVerse(trimmed);
  if (remote) {
    return { type: 'reference', verse: remote, candidates: [remote] };
  }

  return { type: 'content', verse: null, candidates: [] };
}

/**
 * Look up a verse query from free public bible-api.com API
 */
export async function fetchFreeBibleVerse(query: string): Promise<BibleVerse | null> {
  // Check local database first for fast & full bilingual data
  const localMatch = findVerseInDatabase(query);
  if (localMatch) return localMatch;

  const { enRef } = normalizeScriptureReference(query);

  try {
    const encoded = encodeURIComponent(enRef);
    const res = await fetch(`https://bible-api.com/${encoded}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (!data || !data.verses || data.verses.length === 0) {
      return null;
    }

    const firstVerse = data.verses[0];
    const bookName = firstVerse.book_name || 'Bible';
    const lowerBook = bookName.toLowerCase();
    const mapped = BIBLE_BOOKS_MAP[lowerBook];
    const bookZh = mapped ? mapped.zh : bookName;
    const testament = mapped ? mapped.testament : 'NT';

    // Clean English text (remove trailing newlines)
    const cleanEnText = (data.text || '').replace(/\s+/g, ' ').trim();

    return {
      id: `custom-${Date.now()}`,
      bookEn: bookName,
      bookZh,
      chapter: firstVerse.chapter,
      startVerse: firstVerse.verse,
      endVerse: data.verses.length > 1 ? data.verses[data.verses.length - 1].verse : undefined,
      referenceEn: data.reference,
      referenceZh: `${bookZh} ${firstVerse.chapter}:${firstVerse.verse}${data.verses.length > 1 ? '-' + data.verses[data.verses.length - 1].verse : ''}`,
      textZh: `【${bookZh} ${data.reference}】（若需和合本中文，可点击编辑补充中文，或切换查看英文）`,
      textEn: cleanEnText,
      category: 'hope',
      categoryLabelZh: '精选经文',
      categoryLabelEn: 'Scripture',
      testament,
      source: `${data.translation_name || 'World English Bible'} (Free Public Domain)`,
      isCustom: true,
    };
  } catch (err) {
    console.warn('Free Bible API fetch error:', err);
    return null;
  }
}
