import React, { useState } from 'react';
import {
  Volume2,
  Square,
  Eye,
  EyeOff,
  Heart,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BibleVerse, ReciteMode, UserPreferences } from '../types';
import { ThemeConfig } from '../data/themes';
import { generateChineseCloze, generateEnglishCloze } from '../utils/clozeHelper';
import { SpeechService } from '../utils/speechHelper';
import { RecitationModeSelector } from './RecitationModeSelector';

interface VerseCardProps {
  verse: BibleVerse;
  preferences: UserPreferences;
  theme: ThemeConfig;
  isFavorite: boolean;
  isRecitedToday: boolean;
  onToggleFavorite: () => void;
  onMarkRecited: () => void;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onOpenShareModal: () => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  preferences,
  theme,
  isFavorite,
  isRecitedToday,
  onToggleFavorite,
  onMarkRecited,
  onPrevVerse,
  onNextVerse,
  onOpenShareModal,
}) => {
  const [mode, setMode] = useState<ReciteMode>('read');
  const [revealedChineseIds, setRevealedChineseIds] = useState<Set<number>>(new Set());
  const [revealedEnglishIds, setRevealedEnglishIds] = useState<Set<number>>(new Set());
  const [isPeeking, setIsPeeking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<'zh' | 'en' | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Active Chinese text based on preference
  const rawChinese =
    preferences.chineseVersion === 'traditional' && verse.textZhTrad
      ? verse.textZhTrad
      : verse.textZh;

  // Generate tokens based on current mode and revealed sets
  const effectiveMode = isPeeking ? 'read' : mode;
  const chineseTokens = generateChineseCloze(rawChinese, effectiveMode, revealedChineseIds);
  const englishTokens = generateEnglishCloze(verse.textEn, effectiveMode, revealedEnglishIds);

  const handleToggleChineseToken = (id: number) => {
    setRevealedChineseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleEnglishToken = (id: number) => {
    setRevealedEnglishIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResetCloze = (newMode: ReciteMode) => {
    setMode(newMode);
    setRevealedChineseIds(new Set());
    setRevealedEnglishIds(new Set());
  };

  // Web Speech TTS
  const handlePlayAudio = (lang: 'zh' | 'en') => {
    if (isPlayingAudio === lang) {
      SpeechService.stop();
      setIsPlayingAudio(null);
      return;
    }

    const textToRead = lang === 'zh' ? rawChinese : verse.textEn;
    setIsPlayingAudio(lang);

    SpeechService.speak(
      textToRead,
      lang,
      preferences.speechRate,
      () => setIsPlayingAudio(null),
      () => setIsPlayingAudio(null)
    );
  };

  // Copy bilingual text
  const handleCopy = async () => {
    const text = `${verse.referenceZh} / ${verse.referenceEn}\n\n${rawChinese}\n\n${verse.textEn}\n\n— 每日经文背诵 Daily Bible Recite`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    } catch {
      // fallback
    }
  };

  // Recite completion with confetti celebration
  const handleReciteComplete = () => {
    onMarkRecited();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#ffffff'],
    });
  };

  // Font size classes for scripture text
  const fontClass =
    preferences.fontSize === 'huge'
      ? 'text-xl sm:text-2xl leading-relaxed'
      : preferences.fontSize === 'large'
      ? 'text-lg sm:text-xl leading-relaxed'
      : 'text-base sm:text-lg leading-relaxed';

  return (
    <div className={`relative w-full max-w-xl mx-auto flex flex-col justify-between rounded-3xl border ${theme.cardBorderClass} ${theme.cardBgClass} overflow-hidden transition-colors duration-300`}>
      {/* Card Header */}
      <div className={`relative z-10 px-5 pt-5 pb-3 flex items-center justify-between border-b ${theme.isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium tracking-wide ${theme.categoryBadge}`}>
            {verse.categoryLabelZh}
          </span>
          <span className={`text-[11px] ${theme.textMuted}`}>
            {verse.testament === 'NT' ? '新约 New Testament' : '旧约 Old Testament'}
          </span>
        </div>

        {/* Previous & Next Verse navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevVerse}
            title="前一条经文"
            className={`p-1.5 rounded-lg transition active:scale-95 ${
              theme.isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/10'
                : 'text-stone-500 hover:text-stone-900 hover:bg-black/5'
            }`}
            aria-label="前一条经文"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextVerse}
            title="下一条经文"
            className={`p-1.5 rounded-lg transition active:scale-95 ${
              theme.isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/10'
                : 'text-stone-500 hover:text-stone-900 hover:bg-black/5'
            }`}
            aria-label="下一条经文"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scripture Reference Display */}
      <div className="relative z-10 px-6 pt-4 pb-2 text-center">
        <h2 className={`text-2xl sm:text-3xl font-bold font-heading tracking-wide ${theme.textHeading}`}>
          {verse.referenceZh}
        </h2>
        <p className={`text-xs sm:text-sm font-ui tracking-wider font-medium mt-0.5 ${theme.textSubHeading}`}>
          {verse.referenceEn}
        </p>
      </div>

      {/* Recitation Mode Selector */}
      <div className="relative z-10 px-5 py-2">
        <RecitationModeSelector
          mode={mode}
          onChangeMode={handleResetCloze}
          theme={theme}
        />
      </div>

      {/* Mode Hint & Quick Peek / Audio bar */}
      <div className={`relative z-10 px-6 py-1.5 flex items-center justify-between text-xs ${theme.textSecondary}`}>
        <div className="flex items-center gap-1.5">
          {mode !== 'read' ? (
            <span className={`text-[11px] flex items-center gap-1 font-medium ${theme.textSubHeading}`}>
              <Sparkles className="w-3 h-3 text-amber-600" />
              点按遮盖处逐字揭晓
            </span>
          ) : (
            <span className={`text-[11px] ${theme.textMuted}`}>
              和合本 (CUV) · World English Bible
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {mode !== 'read' && (
            <button
              onClick={() => setIsPeeking(!isPeeking)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition ${
                theme.isDark
                  ? 'bg-white/10 hover:bg-white/15 text-stone-300'
                  : 'bg-black/5 hover:bg-black/10 text-stone-700'
              }`}
            >
              {isPeeking ? <EyeOff className="w-3 h-3 text-amber-600" /> : <Eye className="w-3 h-3" />}
              <span>{isPeeking ? '隐藏答案' : '速览全文'}</span>
            </button>
          )}

          {/* Chinese Audio */}
          <button
            onClick={() => handlePlayAudio('zh')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition ${
              isPlayingAudio === 'zh'
                ? theme.buttonPrimary
                : theme.isDark
                ? 'bg-white/5 hover:bg-white/10 text-stone-300'
                : 'bg-black/5 hover:bg-black/10 text-stone-700'
            }`}
            title="朗读中文经文"
          >
            {isPlayingAudio === 'zh' ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span>中文朗读</span>
          </button>

          {/* English Audio */}
          <button
            onClick={() => handlePlayAudio('en')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition ${
              isPlayingAudio === 'en'
                ? theme.buttonPrimary
                : theme.isDark
                ? 'bg-white/5 hover:bg-white/10 text-stone-300'
                : 'bg-black/5 hover:bg-black/10 text-stone-700'
            }`}
            title="朗读英文经文"
          >
            {isPlayingAudio === 'en' ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span>EN Audio</span>
          </button>
        </div>
      </div>

      {/* Scripture Content Container */}
      <div className="relative z-10 px-6 py-4 flex-1 space-y-4 overflow-y-auto no-scrollbar max-h-[380px]">
        {/* Chinese Scripture */}
        {(preferences.primaryLanguage === 'bilingual' || preferences.primaryLanguage === 'zh') && (
          <div className={`p-4 rounded-2xl border ${theme.quoteBoxBorder} ${theme.quoteBoxBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${theme.textSubHeading}`}>
                {preferences.chineseVersion === 'traditional' ? '和合本 繁體 (CUV)' : '和合本 簡體 (CUV)'}
              </span>
            </div>
            <p className={`font-scripture ${theme.textQuoteZh} ${fontClass} tracking-wide select-none`}>
              {chineseTokens.map((token) => {
                if (token.isPunctuation) {
                  return (
                    <span key={token.id} className={theme.textMuted}>
                      {token.raw}
                    </span>
                  );
                }
                if (token.isHidden) {
                  return (
                    <button
                      key={token.id}
                      onClick={() => handleToggleChineseToken(token.id)}
                      className={`inline-block mx-0.5 px-1 py-0.5 rounded text-xs transition active:scale-95 cursor-pointer ${theme.clozeMaskClass}`}
                      title="点击揭开此字"
                    >
                      ＿
                    </button>
                  );
                }
                return (
                  <span
                    key={token.id}
                    onClick={() => {
                      if (mode !== 'read') handleToggleChineseToken(token.id);
                    }}
                    className={`${
                      token.isRevealed
                        ? theme.clozeRevealedClass
                        : theme.textQuoteZh
                    } ${mode !== 'read' ? 'cursor-pointer hover:opacity-80' : ''}`}
                  >
                    {token.raw}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* English Scripture */}
        {(preferences.primaryLanguage === 'bilingual' || preferences.primaryLanguage === 'en') && (
          <div className={`p-4 rounded-2xl border ${theme.quoteBoxBorder} ${theme.quoteBoxBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${theme.textMuted}`}>
                World English Bible (WEB - Free Public Domain)
              </span>
            </div>
            <p className={`font-serif italic ${theme.textQuoteEn} ${fontClass} tracking-normal select-none`}>
              {englishTokens.map((token) => {
                if (token.isPunctuation) {
                  return (
                    <span key={token.id} className={theme.textMuted}>
                      {token.raw}
                    </span>
                  );
                }
                if (token.isHidden) {
                  return (
                    <button
                      key={token.id}
                      onClick={() => handleToggleEnglishToken(token.id)}
                      className={`inline-block mx-1 px-1.5 py-0.5 rounded text-xs transition active:scale-95 cursor-pointer ${theme.clozeMaskClass}`}
                      title="Click to reveal word"
                    >
                      {token.maskDisplay}
                    </button>
                  );
                }
                return (
                  <span
                    key={token.id}
                    onClick={() => {
                      if (mode !== 'read') handleToggleEnglishToken(token.id);
                    }}
                    className={`${
                      token.isRevealed
                        ? theme.clozeRevealedClass
                        : theme.textQuoteEn
                    } ${mode !== 'read' ? 'cursor-pointer hover:opacity-80' : ''}`}
                  >
                    {token.raw}
                  </span>
                );
              })}
            </p>
          </div>
        )}
      </div>

      {/* Recite Completion & Action Bar */}
      <div className={`relative z-10 p-5 border-t ${theme.isDark ? 'border-white/10 bg-black/40' : 'border-black/5 bg-black/5'} space-y-3`}>
        {/* Recite Check-in Button */}
        <button
          onClick={handleReciteComplete}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer ${
            isRecitedToday
              ? theme.buttonCheckinRecited
              : theme.buttonPrimary
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isRecitedToday ? '今日已完成背诵 ✓ (已记录连续打卡)' : '今日已背诵完成，点击打卡！'}</span>
        </button>

        {/* Secondary Actions */}
        <div className="flex items-center justify-between pt-1">
          {/* Favorite Toggle */}
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-400/40'
                : theme.isDark
                ? 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? '已加入背诵库' : '收藏经文'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                theme.isDark
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
              }`}
              title="复制双语经文"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedToast ? '已复制！' : '复制经文'}</span>
            </button>

            {/* Share Card Button */}
            <button
              onClick={onOpenShareModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme.isDark
                  ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100'
              }`}
              title="生成精美经文分享卡片"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>分享经文卡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

