import React from 'react';
import { X, Palette, Check, Sun, Moon } from 'lucide-react';
import { ThemeId } from '../types';
import { THEMES } from '../data/themes';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100 font-ui">
              选择界面色彩主题 (Theme)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-stone-400 mb-2">
            推荐使用<strong>素雅浅色系列</strong>，视觉温润典雅，宛如品读纸质古雅圣经：
          </p>

          <div className="space-y-2.5">
            {Object.values(THEMES).map((th) => {
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    onSelectTheme(th.id);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition border text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400/70 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch circle */}
                    <div
                      className="w-8 h-8 rounded-full border border-black/20 shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: th.colorSwatch }}
                    >
                      {th.isDark ? (
                        <Moon className="w-4 h-4 text-amber-300" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-700" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-100 font-ui">
                          {th.nameZh}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {th.nameEn}
                        </span>
                        {!th.isDark && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            素雅浅色
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {th.id === 'parchment'
                          ? '古朴温润纸质浅色，金褐字墨，护眼典雅（默认推荐）'
                          : th.id === 'morning'
                          ? '清晨微光白底，柔和纯净，阅读清晰'
                          : th.id === 'olive'
                          ? '橄榄清浅与素绿亚麻，宁静舒缓'
                          : th.id === 'pure'
                          ? '极简纯白高对比，无杂质素净阅读'
                          : '深邃夜色暮霭，适合夜晚暗光背诵'}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
