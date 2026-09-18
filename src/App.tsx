import React, { useState, useEffect } from 'react';
import { Plus, Mic } from 'lucide-react';
import { Header } from './components/Header';
import { VerseCard } from './components/VerseCard';
import { VerseSearchModal } from './components/VerseSearchModal';
import { FavoritesListModal } from './components/FavoritesListModal';
import { DailyReminderModal } from './components/DailyReminderModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareCardModal } from './components/ShareCardModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AddVerseModal } from './components/AddVerseModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { BibleVerse, UserPreferences } from './types';
import { BIBLE_MEMORY_VERSES, getDailyVerse } from './data/bibleVerses';
import { THEMES } from './data/themes';
import { NotificationService } from './utils/notificationHelper';

const DEFAULT_PREFERENCES: UserPreferences = {
  chineseVersion: 'simplified',
  primaryLanguage: 'bilingual',
  fontSize: 'large',
  speechRate: 0.95,
  reminderEnabled: false,
  reminderTime: '08:00',
  reciteStreak: 1,
  lastStreakDate: '',
  theme: 'parchment', // Default to elegant light parchment
};

export default function App() {
  // Current active verse
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [activeVerse, setActiveVerse] = useState<BibleVerse>(() => getDailyVerse());

  // User preferences & storage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('bible_recite_prefs');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const activeTheme = THEMES[preferences.theme || 'parchment'] || THEMES.parchment;

  // Favorites list
  const [favorites, setFavorites] = useState<BibleVerse[]>(() => {
    try {
      const saved = localStorage.getItem('bible_recite_favorites');
      if (saved) return JSON.parse(saved);
      // Pre-populate with John 1:5-7, John 3:16, Psalm 23
      return [
        BIBLE_MEMORY_VERSES[0], // John 1:5-7
        BIBLE_MEMORY_VERSES[1], // John 3:16
        BIBLE_MEMORY_VERSES[2], // Psalm 23:1-3
      ];
    } catch {
      return [BIBLE_MEMORY_VERSES[0], BIBLE_MEMORY_VERSES[1]];
    }
  });

  // Recited verses tracking
  const [recitedVerseIds, setRecitedVerseIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('bible_recited_verses');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Today's recitation status
  const getTodayString = () => new Date().toISOString().slice(0, 10);
  const isRecitedToday = preferences.lastStreakDate === getTodayString();

  // Desktop iPhone Frame toggle (default false on mobile, toggleable on wide desktop)
  const [isIPhoneFrame, setIsIPhoneFrame] = useState(false);

  // Modals state
  const [isAddVerseOpen, setIsAddVerseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // Add verse to memorization queue
  const handleAddVerseToMemorize = (verse: BibleVerse, startRecitingImmediately = false) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === verse.id || f.referenceZh === verse.referenceZh);
      if (exists) {
        return prev.map((f) =>
          f.id === verse.id || f.referenceZh === verse.referenceZh ? { ...f, ...verse } : f
        );
      }
      return [verse, ...prev];
    });

    if (startRecitingImmediately) {
      setActiveVerse(verse);
    }
  };

  // Sync preferences to localStorage
  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('bible_recite_prefs', JSON.stringify(next));
      } catch (e) {
        console.warn('Storage error:', e);
      }
      return next;
    });
  };

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bible_recite_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [favorites]);

  // Sync recited verses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'bible_recited_verses',
        JSON.stringify(Array.from(recitedVerseIds))
      );
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [recitedVerseIds]);

  // Navigate daily verses
  const handleChangeDay = (offsetDelta: number) => {
    const nextOffset = dayOffset + offsetDelta;
    setDayOffset(nextOffset);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + nextOffset);
    setActiveVerse(getDailyVerse(targetDate));
  };

  // Toggle favorite
  const isCurrentFavorite = favorites.some((f) => f.id === activeVerse.id);
  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) => prev.filter((f) => f.id !== activeVerse.id));
    } else {
      setFavorites((prev) => [...prev, activeVerse]);
    }
  };

  // Mark recited today
  const handleMarkRecited = () => {
    const today = getTodayString();
    setRecitedVerseIds((prev) => new Set(prev).add(activeVerse.id));

    if (preferences.lastStreakDate === today) {
      return; // Already checked in today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const isConsecutive = preferences.lastStreakDate === yesterdayStr;
    const newStreak = isConsecutive ? (preferences.reciteStreak || 0) + 1 : 1;

    updatePreferences({
      reciteStreak: newStreak,
      lastStreakDate: today,
    });
  };

  // Check daily notification interval
  useEffect(() => {
    if (!preferences.reminderEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentHM = `${hours}:${mins}`;

      if (currentHM === preferences.reminderTime) {
        const lastNotified = sessionStorage.getItem('last_notified_date');
        const today = getTodayString();
        if (lastNotified !== today) {
          sessionStorage.setItem('last_notified_date', today);
          NotificationService.sendVerseNotification(activeVerse);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [preferences.reminderEnabled, preferences.reminderTime, activeVerse]);

  // Format date display
  const now = new Date();
  if (dayOffset !== 0) {
    now.setDate(now.getDate() + dayOffset);
  }
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className={`relative min-h-screen w-full ${activeTheme.pageBgClass} flex flex-col items-center justify-center selection:bg-amber-500/30 overflow-x-hidden font-ui transition-colors duration-500`}>
      {/* Background Biblical Artwork with theme-specific overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `${activeTheme.bgOverlay}, url(${activeTheme.bgWideImg})`,
        }}
      />
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${
        activeTheme.isDark
          ? 'bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent'
          : 'bg-gradient-to-t from-stone-200/50 via-transparent to-transparent'
      }`} />

      {/* Main Container: Mobile Fullscreen or Simulated iPhone Frame */}
      <div
        className={`relative z-10 w-full transition-all duration-300 ${
          isIPhoneFrame
            ? `max-w-[420px] my-6 rounded-[50px] border-[10px] ${
                activeTheme.isDark ? 'border-stone-800 ring-1 ring-white/10' : 'border-stone-300 ring-1 ring-black/10'
              } shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden min-h-[850px]`
            : 'max-w-3xl min-h-screen'
        } flex flex-col justify-between`}
        style={{
          backgroundImage: isIPhoneFrame
            ? `${activeTheme.bgOverlay}, url(${activeTheme.bgMobileImg})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* iPhone Top Speaker / Dynamic Island Simulation (Only in frame mode) */}
        {isIPhoneFrame && (
          <div className="pt-2 px-6 flex items-center justify-between z-30 select-none">
            <span className={`text-xs font-mono font-bold ${activeTheme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              9:41
            </span>
            <div className={`w-24 h-5 rounded-full border flex items-center justify-center ${
              activeTheme.isDark ? 'bg-black border-stone-800' : 'bg-stone-900 border-stone-700'
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-mono ${activeTheme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              <span>5G</span>
              <div className={`w-5 h-2.5 border rounded-sm p-0.5 flex items-center ${activeTheme.isDark ? 'border-stone-400' : 'border-stone-600'}`}>
                <div className="w-full h-full bg-emerald-500 rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          dateStr={dateStr}
          preferences={preferences}
          theme={activeTheme}
          isIPhoneFrame={isIPhoneFrame}
          onToggleFrame={() => setIsIPhoneFrame(!isIPhoneFrame)}
          onOpenAddVerse={() => setIsAddVerseOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenReminder={() => setIsReminderOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
          favoritesCount={favorites.length}
        />

        {/* Main Workspace: Daily Verse Card */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-5 sm:py-7">
          <VerseCard
            verse={activeVerse}
            preferences={preferences}
            theme={activeTheme}
            isFavorite={isCurrentFavorite}
            isRecitedToday={isRecitedToday}
            onToggleFavorite={handleToggleFavorite}
            onMarkRecited={handleMarkRecited}
            onPrevVerse={() => handleChangeDay(-1)}
            onNextVerse={() => handleChangeDay(1)}
            onOpenShareModal={() => setIsShareOpen(true)}
          />

          {/* Quick PWA Install & Tips Banner */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <PWAInstallButton />
          </div>
        </main>

        {/* Bottom Bar: Day Navigation & Verse Info */}
        <footer className={`w-full px-6 py-3 border-t ${activeTheme.headerBorder} ${activeTheme.headerFooterBg} flex items-center justify-between text-xs pb-safe transition-colors duration-300`}>
          <button
            onClick={() => handleChangeDay(-1)}
            className={`${activeTheme.textSecondary} hover:${activeTheme.textHeading} transition flex items-center gap-1 cursor-pointer font-medium`}
          >
            <span>← 前一日</span>
          </button>

          <div className="text-center">
            {dayOffset === 0 ? (
              <span className={`font-semibold ${activeTheme.textSubHeading}`}>今日背诵经文</span>
            ) : (
              <button
                onClick={() => {
                  setDayOffset(0);
                  setActiveVerse(getDailyVerse());
                }}
                className={`${activeTheme.textSubHeading} underline underline-offset-4 hover:opacity-80 cursor-pointer font-medium`}
              >
                回到今日 ({dayOffset > 0 ? `+${dayOffset}天` : `${dayOffset}天`})
              </button>
            )}
          </div>

          <button
            onClick={() => handleChangeDay(1)}
            className={`${activeTheme.textSecondary} hover:${activeTheme.textHeading} transition flex items-center gap-1 cursor-pointer font-medium`}
          >
            <span>后一日 →</span>
          </button>
        </footer>

        {/* iPhone Bottom Home Indicator Bar (Only in frame mode) */}
        {isIPhoneFrame && (
          <div className={`py-2 flex justify-center ${activeTheme.headerFooterBg}`}>
            <div className={`w-32 h-1 rounded-full ${activeTheme.isDark ? 'bg-stone-500/60' : 'bg-stone-400/80'}`} />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddVerseModal
        isOpen={isAddVerseOpen}
        onClose={() => setIsAddVerseOpen(false)}
        preferences={preferences}
        theme={activeTheme}
        onAddVerseToMemorize={handleAddVerseToMemorize}
        favoritesCount={favorites.length}
      />

      <VerseSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVerse={(v) => setActiveVerse(v)}
        onAddCustomVerse={(v) => setFavorites((prev) => [v, ...prev])}
      />

      <FavoritesListModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        recitedVerseIds={recitedVerseIds}
        onSelectVerse={(v) => setActiveVerse(v)}
        onRemoveFavorite={(id) => setFavorites((prev) => prev.filter((f) => f.id !== id))}
        onOpenAddVerse={() => setIsAddVerseOpen(true)}
      />

      <DailyReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
        currentVerse={activeVerse}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        verse={activeVerse}
        preferences={preferences}
        bgImageUrl={activeTheme.bgWideImg}
      />

      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentTheme={preferences.theme || 'parchment'}
        onSelectTheme={(t) => updatePreferences({ theme: t })}
      />

      {/* Floating Quick Action Button */}
      <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-30 flex items-center">
        <button
          onClick={() => setIsAddVerseOpen(true)}
          className={`group flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-xs shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border ${
            activeTheme.isDark
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 shadow-amber-500/25'
              : 'bg-stone-900 hover:bg-stone-800 text-amber-200 border-amber-500/40 shadow-stone-900/35'
          }`}
          title="录入经文号"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="font-ui font-semibold">录经文</span>
        </button>
      </div>
    </div>
  );
}

