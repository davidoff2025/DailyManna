import React, { useState } from 'react';
import { Search, X, BookOpen, Plus, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { BibleVerse } from '../types';
import { BIBLE_MEMORY_VERSES } from '../data/bibleVerses';
import { fetchFreeBibleVerse } from '../utils/bibleParser';

interface VerseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: BibleVerse) => void;
  onAddCustomVerse: (verse: BibleVerse) => void;
}

export const VerseSearchModal: React.FC<VerseSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
  onAddCustomVerse,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Custom verse form state
  const [customRefZh, setCustomRefZh] = useState('');
  const [customRefEn, setCustomRefEn] = useState('');
  const [customTextZh, setCustomTextZh] = useState('');
  const [customTextEn, setCustomTextEn] = useState('');
  const [customCategory, setCustomCategory] = useState('信心与信靠');

  if (!isOpen) return null;

  // Filter local memory verses
  const filteredLocalVerses = query.trim()
    ? BIBLE_MEMORY_VERSES.filter((v) => {
        const q = query.toLowerCase().trim();
        return (
          v.referenceEn.toLowerCase().includes(q) ||
          v.referenceZh.toLowerCase().includes(q) ||
          v.textZh.toLowerCase().includes(q) ||
          v.textEn.toLowerCase().includes(q) ||
          v.categoryLabelZh.includes(q)
        );
      })
    : BIBLE_MEMORY_VERSES;

  // Search online free Bible API if not found or on submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if directly matched in local
    const exactLocal = BIBLE_MEMORY_VERSES.find(
      (v) =>
        v.referenceEn.toLowerCase() === query.trim().toLowerCase() ||
        v.referenceZh === query.trim()
    );
    if (exactLocal) {
      onSelectVerse(exactLocal);
      onClose();
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const fetched = await fetchFreeBibleVerse(query.trim());
      if (fetched) {
        onSelectVerse(fetched);
        onClose();
      } else {
        setSearchError('未找到相关经文。可尝试标准格式如 "John 1:5-7" 或 "约翰福音 1:5-7"，或在右侧直接输入自定义经文。');
      }
    } catch {
      setSearchError('网络请求失败，请检查网络或使用内置经典背诵经文。');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRefZh.trim() || !customTextZh.trim()) {
      return;
    }

    const newVerse: BibleVerse = {
      id: `custom-${Date.now()}`,
      bookEn: customRefEn.split(' ')[0] || 'Custom',
      bookZh: customRefZh.split(' ')[0] || '自定义',
      chapter: 1,
      startVerse: 1,
      referenceEn: customRefEn.trim() || customRefZh.trim(),
      referenceZh: customRefZh.trim(),
      textZh: customTextZh.trim(),
      textEn: customTextEn.trim() || customTextZh.trim(),
      category: 'hope',
      categoryLabelZh: customCategory,
      categoryLabelEn: 'Custom Memorization',
      testament: 'NT',
      source: 'User Custom Favorite Verse',
      isCustom: true,
    };

    onAddCustomVerse(newVerse);
    onSelectVerse(newVerse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100 font-ui">
              查找与添加背诵经文
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-1 flex border-b border-white/5 bg-stone-950/40">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2 px-3 text-xs font-semibold tracking-wide border-b-2 transition ${
              activeTab === 'search'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            从圣经检索 (如 John 1:5-7)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 px-3 text-xs font-semibold tracking-wide border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            自定义录入经文
          </button>
        </div>

        {/* Tab 1: Search */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-hidden">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入章节，如 John 1:5-7、约翰福音 3:16、Psalm 23..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-black/50 border border-white/15 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-stone-950 text-xs font-semibold flex items-center gap-1 transition"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '查询'}
              </button>
            </form>

            {searchError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-3">
              <span className="text-[11px] text-stone-400 shrink-0">经典背诵：</span>
              {['John 1:5-7', 'John 3:16', 'Psalm 23:1-3', 'Romans 8:28', 'Isaiah 40:31'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] font-mono shrink-0 transition"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
              {filteredLocalVerses.map((verse) => (
                <div
                  key={verse.id}
                  onClick={() => {
                    onSelectVerse(verse);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-black/30 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-amber-200 text-sm font-heading group-hover:text-amber-300">
                      {verse.referenceZh}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {verse.referenceEn}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 line-clamp-2 font-scripture mb-1">
                    {verse.textZh}
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-1 italic font-serif">
                    {verse.textEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Verse Input */}
        {activeTab === 'custom' && (
          <form onSubmit={handleSaveCustom} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>录入您心爱的经文，即可加入个人每日背诵库中随时复习！</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  中文出处 <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：约翰福音 1:5-7"
                  value={customRefZh}
                  onChange={(e) => setCustomRefZh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  英文出处 (可选)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John 1:5-7"
                  value={customRefEn}
                  onChange={(e) => setCustomRefEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">
                中文经文内容 (和合本或其他译本) <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="输入或粘贴中文经文..."
                value={customTextZh}
                onChange={(e) => setCustomTextZh(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-100 text-sm focus:outline-none focus:border-amber-400 leading-relaxed font-scripture"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">
                英文经文内容 (WEB / KJV 或其他公有领域译本)
              </label>
              <textarea
                rows={3}
                placeholder="Enter or paste English Scripture..."
                value={customTextEn}
                onChange={(e) => setCustomTextEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-100 text-sm focus:outline-none focus:border-amber-400 leading-relaxed font-serif"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">
                分类标签
              </label>
              <input
                type="text"
                placeholder="例如：平安与安慰、信心、救恩..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-1.5 transition shadow-lg"
              >
                <Plus className="w-4 h-4" />
                保存并开始背诵此经文
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
