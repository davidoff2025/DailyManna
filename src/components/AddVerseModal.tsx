import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Check,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { BibleVerse, UserPreferences } from '../types';
import { ThemeConfig } from '../data/themes';
import { locateScripture } from '../utils/bibleParser';
import { speechRecognizer, SpeechRecognitionService } from '../utils/speechRecognition';

interface AddVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  theme: ThemeConfig;
  onAddVerseToMemorize: (verse: BibleVerse, startRecitingImmediately?: boolean) => void;
  favoritesCount: number;
}

const QUICK_REFS = [
  '约 3:16',
  '罗 8:28',
  '诗 23:1',
  '箴 3:5',
  '腓 4:13',
  '太 6:33',
];

export function AddVerseModal({
  isOpen,
  onClose,
  preferences,
  theme,
  onAddVerseToMemorize,
}: AddVerseModalProps) {
  const [queryInput, setQueryInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locatedVerse, setLocatedVerse] = useState<BibleVerse | null>(null);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [addedSuccessToast, setAddedSuccessToast] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setAddedSuccessToast(null);
      setLocateError(null);
    } else {
      handleStopVoice();
    }
  }, [isOpen]);

  const handleStopVoice = () => {
    speechRecognizer.stop();
    setIsListening(false);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      handleStopVoice();
      return;
    }

    if (!SpeechRecognitionService.isSupported()) {
      setLocateError('当前浏览器暂不支持语音识别，请直接键盘输入经文号');
      return;
    }

    setLocateError(null);
    setIsListening(true);

    speechRecognizer.start({
      lang: 'zh-CN',
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setQueryInput(transcript);
        if (isFinal) {
          triggerLocate(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setLocateError(err);
      },
      onEnd: () => setIsListening(false),
    });
  };

  const triggerLocate = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsLocating(true);
    setLocateError(null);

    try {
      const result = await locateScripture(q);
      if (result.verse) {
        setLocatedVerse(result.verse);
        setLocateError(null);
      } else {
        setLocatedVerse(null);
        setLocateError('未找到该章节，请检查经文号（如：约翰福音 3:16 或 约 3:16）');
      }
    } catch {
      setLocateError('获取经文异常，请稍后重试');
    } finally {
      setIsLocating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerLocate(queryInput);
    }
  };

  const handleSave = (immediate = false) => {
    if (!locatedVerse) return;

    onAddVerseToMemorize(locatedVerse, immediate);

    if (immediate) {
      onClose();
      return;
    }

    // Success feedback & reset for continuous addition
    setAddedSuccessToast(`《${locatedVerse.referenceZh}》已加入背诵`);
    setTimeout(() => setAddedSuccessToast(null), 2500);

    setQueryInput('');
    setLocatedVerse(null);
    setLocateError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden font-ui">
        {/* Header - Simple & Clean */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/10 bg-black/30">
          <h3 className="text-sm font-semibold text-stone-100">
            录入经文号
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Quick Success Toast */}
          {addedSuccessToast && (
            <div className="py-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{addedSuccessToast}，可继续输入下一条</span>
            </div>
          )}

          {/* Reference Input Bar */}
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入经文号，如：约 3:16、罗 8:28、诗篇 23:1"
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {/* Voice recognition */}
              <button
                type="button"
                onClick={handleToggleVoice}
                title={isListening ? '停止倾听' : '语音读出经文号'}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-stone-400 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Locate button */}
              <button
                type="button"
                onClick={() => triggerLocate(queryInput)}
                disabled={isLocating || !queryInput.trim()}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition disabled:opacity-40 cursor-pointer"
              >
                {isLocating ? '定位中' : '定位'}
              </button>
            </div>
          </div>

          {/* Voice listening status */}
          {isListening && (
            <p className="text-xs text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              请说出经文章节（例如：“约翰福音三章十六节”）...
            </p>
          )}

          {/* Error notice */}
          {locateError && (
            <p className="text-xs text-rose-400">{locateError}</p>
          )}

          {/* Quick reference examples if not yet located */}
          {!locatedVerse && !locateError && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-stone-500">示例:</span>
              {QUICK_REFS.map((ref) => (
                <button
                  key={ref}
                  onClick={() => {
                    setQueryInput(ref);
                    triggerLocate(ref);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-700 transition cursor-pointer"
                >
                  {ref}
                </button>
              ))}
            </div>
          )}

          {/* Preview of Located Scripture */}
          {locatedVerse && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-amber-300 text-sm">
                  {locatedVerse.referenceZh}
                </span>
                <span className="text-[11px] text-stone-400 font-serif">
                  {locatedVerse.referenceEn}
                </span>
              </div>
              <p className="text-xs text-stone-200 font-serif leading-relaxed line-clamp-4">
                {locatedVerse.textZh}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/30 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-stone-400 hover:text-stone-200 text-xs transition cursor-pointer"
          >
            关闭
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={!locatedVerse}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-medium transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>保存并继续</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={!locatedVerse}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span>立即背诵</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
