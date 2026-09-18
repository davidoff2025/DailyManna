import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { BibleVerse, UserPreferences } from '../types';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: BibleVerse;
  preferences: UserPreferences;
  bgImageUrl: string;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  verse,
  preferences,
  bgImageUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawChinese =
    preferences.chineseVersion === 'traditional' && verse.textZhTrad
      ? verse.textZhTrad
      : verse.textZh;

  const handleCopyText = async () => {
    const text = `【每日经文背诵 · Daily Bible Verse】\n\n${verse.referenceZh} · ${verse.referenceEn}\n\n${rawChinese}\n\n"${verse.textEn}"\n\n— 和合本 / World English Bible`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `今日经文: ${verse.referenceZh}`,
          text: `${verse.referenceZh}\n${rawChinese}\n\n${verse.referenceEn}\n${verse.textEn}`,
          url: window.location.href,
        });
      } catch {
        // ignored
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/40">
          <h3 className="text-sm font-semibold text-stone-100 font-ui">
            经文分享卡片
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Share Card */}
        <div className="p-4">
          <div
            className="relative rounded-2xl p-6 overflow-hidden border border-amber-500/30 shadow-2xl flex flex-col justify-between min-h-[360px]"
            style={{
              backgroundImage: `linear-gradient(rgba(15, 12, 10, 0.72), rgba(15, 12, 10, 0.85)), url(${bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Card Top */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-amber-300 text-xs tracking-wider font-mono">
                <span>DAILY BIBLE VERSE</span>
                <span>{verse.categoryLabelZh}</span>
              </div>
              <div className="w-8 h-0.5 bg-amber-400/60 mt-1" />
            </div>

            {/* Scripture in center */}
            <div className="my-auto space-y-4 py-4">
              <p className="font-scripture text-lg text-stone-100 leading-relaxed font-medium">
                {rawChinese}
              </p>
              <p className="font-serif italic text-xs text-stone-300 leading-relaxed">
                "{verse.textEn}"
              </p>
            </div>

            {/* Card Bottom Reference */}
            <div className="pt-2 border-t border-white/15 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-amber-200 font-heading">
                  {verse.referenceZh}
                </div>
                <div className="text-[11px] text-amber-400/80 font-mono">
                  {verse.referenceEn}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">每日背诵</span>
                <span className="text-[10px] text-stone-500 font-mono">和合本 / WEB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>已复制全文！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制双语文字</span>
              </>
            )}
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>分享 / 发送</span>
          </button>
        </div>
      </div>
    </div>
  );
};
