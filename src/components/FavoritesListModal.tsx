import React from 'react';
import { X, Bookmark, Play, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { BibleVerse } from '../types';

interface FavoritesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: BibleVerse[];
  recitedVerseIds: Set<string>;
  onSelectVerse: (verse: BibleVerse) => void;
  onRemoveFavorite: (id: string) => void;
  onOpenAddVerse?: () => void;
}

export const FavoritesListModal: React.FC<FavoritesListModalProps> = ({
  isOpen,
  onClose,
  favorites,
  recitedVerseIds,
  onSelectVerse,
  onRemoveFavorite,
  onOpenAddVerse,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100 font-ui">
              我的背诵行列 ({favorites.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAddVerse && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAddVerse();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>录入经文</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-3">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <Bookmark className="w-10 h-10 mx-auto mb-2 text-stone-600" />
              <p className="text-sm font-medium">暂无待背经文</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                在听道、读书或祷告时，点击顶部的「记经文」，随时输入或语音念诵经文加入此处。
              </p>
              {onOpenAddVerse && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddVerse();
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold transition hover:bg-amber-400"
                >
                  立即添加第一篇经文
                </button>
              )}
            </div>
          ) : (
            favorites.map((verse) => {
              const isRecited = recitedVerseIds.has(verse.id);
              return (
                <div
                  key={verse.id}
                  className="p-4 rounded-2xl bg-black/35 border border-white/5 hover:border-amber-500/30 transition flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-amber-200 text-sm font-heading">
                        {verse.referenceZh}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {verse.referenceEn}
                      </span>
                      {isRecited && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          今日已背
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onSelectVerse(verse);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-amber-300" />
                        背诵
                      </button>
                      <button
                        onClick={() => onRemoveFavorite(verse.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="移出背诵行列"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 font-scripture line-clamp-2 leading-relaxed">
                    {verse.textZh}
                  </p>
                  <p className="text-[11px] text-stone-400 font-serif italic line-clamp-1">
                    {verse.textEn}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

