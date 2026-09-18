import React from 'react';
import { Bell, Search, Bookmark, Settings, Smartphone, Monitor, Flame, Palette, Plus, Mic } from 'lucide-react';
import { UserPreferences } from '../types';
import { ThemeConfig } from '../data/themes';

interface HeaderProps {
  dateStr: string;
  preferences: UserPreferences;
  theme: ThemeConfig;
  isIPhoneFrame: boolean;
  onToggleFrame: () => void;
  onOpenAddVerse: () => void;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onOpenReminder: () => void;
  onOpenSettings: () => void;
  onOpenThemeSelector: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  dateStr,
  preferences,
  theme,
  isIPhoneFrame,
  onToggleFrame,
  onOpenAddVerse,
  onOpenSearch,
  onOpenFavorites,
  onOpenReminder,
  onOpenSettings,
  onOpenThemeSelector,
  favoritesCount,
}) => {
  return (
    <header className={`relative z-20 w-full px-4 py-3 flex items-center justify-between border-b ${theme.headerBorder} ${theme.headerFooterBg}`}>
      {/* App Branding & Date */}
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${
          theme.isDark
            ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
            : 'bg-amber-100 border-amber-300 text-amber-900'
        }`}>
          <span className="text-lg font-heading font-bold">✟</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-sm font-bold tracking-wide font-ui ${theme.textHeading}`}>
              每日经文背诵
            </h1>
            <span className={`text-[10px] font-mono tracking-tighter uppercase px-1.5 py-0.5 rounded border ${
              theme.isDark
                ? 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'
                : 'text-amber-900 bg-amber-100 border-amber-300/80 font-medium'
            }`}>
              Bible Recite
            </span>
          </div>
          <p className={`text-[11px] font-ui tracking-wide ${theme.textMuted}`}>
            {dateStr}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Recite Streak Badge */}
        <div
          title={`连续背诵打卡: ${preferences.reciteStreak} 天`}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${
            theme.isDark
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-amber-100 border-amber-300 text-amber-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
          <span>{preferences.reciteStreak}</span>
          <span className="hidden sm:inline text-[10px] opacity-80">天</span>
        </div>

        {/* Quick Add Verse Button (Supports voice & typing) */}
        <button
          onClick={onOpenAddVerse}
          title="录入经文号"
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 shadow-xs cursor-pointer ${
            theme.isDark
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 shadow-amber-500/20'
              : 'bg-amber-800 hover:bg-amber-900 text-amber-50 border-amber-900 shadow-amber-900/20'
          }`}
          aria-label="录入经文号"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>录经文</span>
        </button>

        {/* Theme Selector Button */}
        <button
          onClick={onOpenThemeSelector}
          title={`切换主题配色（当前：${theme.nameZh}）`}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition active:scale-95 ${
            theme.isDark
              ? 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200 shadow-2xs'
          }`}
          aria-label="切换主题配色"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline text-[11px]">{theme.nameZh}</span>
        </button>

        {/* Search / Custom Verse */}
        <button
          onClick={onOpenSearch}
          title="查找或输入经文 (如 John 1:5-7)"
          className={`p-2 rounded-lg transition active:scale-95 ${
            theme.isDark
              ? 'text-stone-300 hover:text-white hover:bg-white/10'
              : 'text-stone-700 hover:text-stone-950 hover:bg-black/5'
          }`}
          aria-label="搜索经文"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Favorites Library */}
        <button
          onClick={onOpenFavorites}
          title="我的背诵库"
          className={`relative p-2 rounded-lg transition active:scale-95 ${
            theme.isDark
              ? 'text-stone-300 hover:text-white hover:bg-white/10'
              : 'text-stone-700 hover:text-stone-950 hover:bg-black/5'
          }`}
          aria-label="背诵库"
        >
          <Bookmark className="w-4 h-4" />
          {favoritesCount > 0 && (
            <span className={`absolute top-1 right-1 w-4 h-4 rounded-full font-bold text-[9px] flex items-center justify-center ${
              theme.isDark ? 'bg-amber-500 text-stone-950' : 'bg-amber-700 text-white'
            }`}>
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Daily Reminder Bell */}
        <button
          onClick={onOpenReminder}
          title="每日推送提醒设置"
          className={`relative p-2 rounded-lg transition active:scale-95 ${
            theme.isDark
              ? 'text-stone-300 hover:text-white hover:bg-white/10'
              : 'text-stone-700 hover:text-stone-950 hover:bg-black/5'
          }`}
          aria-label="每日推送提醒"
        >
          <Bell className="w-4 h-4" />
          {preferences.reminderEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>

        {/* Desktop iPhone Frame Toggle (Only visible on wide screen) */}
        <button
          onClick={onToggleFrame}
          title={isIPhoneFrame ? '切换至宽屏浏览' : '切换至 iPhone 手机模拟视图'}
          className={`hidden md:flex p-2 rounded-lg transition active:scale-95 ${
            theme.isDark
              ? 'text-stone-300 hover:text-white hover:bg-white/10'
              : 'text-stone-700 hover:text-stone-950 hover:bg-black/5'
          }`}
          aria-label="切换手机视图"
        >
          {isIPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="设置 (版本/字体/语速)"
          className={`p-2 rounded-lg transition active:scale-95 ${
            theme.isDark
              ? 'text-stone-300 hover:text-white hover:bg-white/10'
              : 'text-stone-700 hover:text-stone-950 hover:bg-black/5'
          }`}
          aria-label="设置"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

