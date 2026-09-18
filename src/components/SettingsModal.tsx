import React from 'react';
import { X, Globe, Type, Volume2, Sparkles, BookOpen, Palette } from 'lucide-react';
import { UserPreferences, ThemeId } from '../types';
import { THEMES } from '../data/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100 font-ui">
              背诵与阅读偏好设置
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Theme Palette Selection */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>界面色彩主题 (Theme)</span>
              </div>
              <span className="text-[10px] text-amber-300">
                素雅浅色系列
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(THEMES).map((th) => {
                const isActive = preferences.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onUpdatePreferences({ theme: th.id })}
                    className={`py-2 px-2.5 rounded-xl text-xs flex items-center gap-2 transition border ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/30"
                      style={{ backgroundColor: th.colorSwatch }}
                    />
                    <span className="truncate">{th.nameZh}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chinese Version Selector */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>中文圣经译本字形 (和合本)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdatePreferences({ chineseVersion: 'simplified' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  preferences.chineseVersion === 'simplified'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-stone-400'
                }`}
              >
                简体和合本 (CUV)
              </button>
              <button
                onClick={() => onUpdatePreferences({ chineseVersion: 'traditional' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  preferences.chineseVersion === 'traditional'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-stone-400'
                }`}
              >
                繁體和合本 (CUV)
              </button>
            </div>
          </div>

          {/* Language Display Mode */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>经文呈现语言</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bilingual', label: '中英双语' },
                { id: 'zh', label: '仅看中文' },
                { id: 'en', label: '仅看英文' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdatePreferences({
                      primaryLanguage: item.id as 'bilingual' | 'zh' | 'en',
                    })
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition ${
                    preferences.primaryLanguage === item.id
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-stone-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
              <Type className="w-4 h-4 text-amber-400" />
              <span>经文字体字号</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: '标准字号' },
                { id: 'large', label: '适度放大' },
                { id: 'huge', label: '特大字号' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdatePreferences({
                      fontSize: item.id as 'normal' | 'large' | 'huge',
                    })
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition ${
                    preferences.fontSize === item.id
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-stone-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* TTS Speech Rate */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>语音朗读语速</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 0.8, label: '0.8x 稳缓沉思' },
                { rate: 0.95, label: '1.0x 标准诵读' },
                { rate: 1.15, label: '1.2x 快速复习' },
              ].map((item) => (
                <button
                  key={item.rate}
                  onClick={() => onUpdatePreferences({ speechRate: item.rate })}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition ${
                    Math.abs(preferences.speechRate - item.rate) < 0.05
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-stone-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Public Domain & Source Guarantee */}
          <div className="p-3 rounded-xl bg-white/5 text-[11px] text-stone-400 leading-relaxed border border-white/5">
            <span className="text-amber-300 font-semibold">经文版权与来源说明：</span><br />
            中文为经典《和合本》（Chinese Union Version, 1919年出版，属公有领域），英文为《World English Bible》(WEB，公有领域自由使用)，完全免费开放、无任何商业版权限制。
          </div>
        </div>
      </div>
    </div>
  );
};
