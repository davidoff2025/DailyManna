export type Testament = 'OT' | 'NT';

export type ScriptureCategory =
  | 'salvation'
  | 'peace'
  | 'strength'
  | 'faith'
  | 'love'
  | 'wisdom'
  | 'prayer'
  | 'hope';

export interface BibleVerse {
  id: string;
  bookEn: string;
  bookZh: string;
  chapter: number;
  startVerse: number;
  endVerse?: number;
  referenceEn: string;
  referenceZh: string;
  textZh: string; // Simplified Chinese (和合本)
  textZhTrad?: string; // Traditional Chinese (和合本繁体)
  textEn: string; // English (World English Bible / KJV - public domain)
  category: ScriptureCategory;
  categoryLabelZh: string;
  categoryLabelEn: string;
  testament: Testament;
  source?: string;
  isCustom?: boolean;
  scene?: 'reading' | 'sermon' | 'prayer' | 'life' | 'custom';
  sceneLabel?: string;
  userNote?: string;
  addedAt?: string;
}

export type ReciteMode = 'read' | 'cloze25' | 'cloze50' | 'cloze75' | 'clozeAll' | 'firstWord';

export interface ReciteProgress {
  recitedCount: number;
  lastRecitedAt?: string;
  mastered: boolean;
}

export type ThemeId = 'parchment' | 'morning' | 'olive' | 'pure' | 'twilight';

export interface UserPreferences {
  chineseVersion: 'simplified' | 'traditional';
  primaryLanguage: 'bilingual' | 'zh' | 'en';
  fontSize: 'normal' | 'large' | 'huge';
  speechRate: number; // 0.7 to 1.2
  reminderEnabled: boolean;
  reminderTime: string; // e.g. "08:00"
  reciteStreak: number;
  lastStreakDate?: string;
  theme: ThemeId;
}

export interface RecitationLog {
  date: string; // YYYY-MM-DD
  verseId: string;
  verseRef: string;
  completedAt: string;
}
