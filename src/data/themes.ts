import { ThemeId } from '../types';

import bgLightMobile from '../assets/images/biblical_light_bg_1789766841882.jpg';
import bgLightWide from '../assets/images/biblical_light_wide_1789766853262.jpg';
import bgDarkMobile from '../assets/images/biblical_dawn_bg_1789766294773.jpg';
import bgDarkWide from '../assets/images/biblical_landscape_bg_1789766316159.jpg';

export interface ThemeConfig {
  id: ThemeId;
  nameZh: string;
  nameEn: string;
  isDark: boolean;
  colorSwatch: string;
  bgMobileImg: string;
  bgWideImg: string;
  bgOverlay: string;
  pageBgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  headerFooterBg: string;
  headerBorder: string;
  textHeading: string;
  textSubHeading: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textQuoteZh: string;
  textQuoteEn: string;
  quoteBoxBg: string;
  quoteBoxBorder: string;
  buttonPrimary: string;
  buttonCheckinRecited: string;
  clozeMaskClass: string;
  clozeRevealedClass: string;
  modeSelectorBg: string;
  modeTabActive: string;
  modeTabInactive: string;
  categoryBadge: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  parchment: {
    id: 'parchment',
    nameZh: '素雅羊皮纸',
    nameEn: 'Parchment',
    isDark: false,
    colorSwatch: '#f7f2e7',
    bgMobileImg: bgLightMobile,
    bgWideImg: bgLightWide,
    bgOverlay: 'linear-gradient(rgba(248, 244, 236, 0.76), rgba(243, 238, 228, 0.88))',
    pageBgClass: 'bg-[#f4efe4] text-stone-800',
    cardBgClass: 'bg-[#fffdf9]/92 backdrop-blur-xl shadow-xl',
    cardBorderClass: 'border-amber-900/15',
    headerFooterBg: 'bg-[#fcf9f2]/85 backdrop-blur-md',
    headerBorder: 'border-amber-900/10',
    textHeading: 'text-amber-950',
    textSubHeading: 'text-amber-800',
    textPrimary: 'text-stone-800',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-500',
    textQuoteZh: 'text-stone-900',
    textQuoteEn: 'text-stone-700',
    quoteBoxBg: 'bg-[#fbf7ee]/90 shadow-xs',
    quoteBoxBorder: 'border-amber-900/10',
    buttonPrimary: 'bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold border border-amber-600/30',
    buttonCheckinRecited: 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600/30',
    clozeMaskClass: 'bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono border border-amber-300',
    clozeRevealedClass: 'text-amber-900 font-semibold bg-amber-100 px-1 rounded border-b border-amber-500',
    modeSelectorBg: 'bg-amber-100/60 border-amber-900/10',
    modeTabActive: 'bg-white text-amber-900 border border-amber-300/80 shadow-xs font-semibold',
    modeTabInactive: 'text-stone-600 hover:text-stone-900 hover:bg-white/50',
    categoryBadge: 'bg-amber-100 text-amber-900 border-amber-300/60',
  },
  morning: {
    id: 'morning',
    nameZh: '晨曦浅白',
    nameEn: 'Morning Light',
    isDark: false,
    colorSwatch: '#f8fafc',
    bgMobileImg: bgLightMobile,
    bgWideImg: bgLightWide,
    bgOverlay: 'linear-gradient(rgba(248, 250, 252, 0.82), rgba(241, 245, 249, 0.92))',
    pageBgClass: 'bg-slate-100 text-slate-800',
    cardBgClass: 'bg-white/94 backdrop-blur-xl shadow-xl',
    cardBorderClass: 'border-slate-200/80',
    headerFooterBg: 'bg-white/85 backdrop-blur-md',
    headerBorder: 'border-slate-200/60',
    textHeading: 'text-slate-900',
    textSubHeading: 'text-amber-700',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    textQuoteZh: 'text-slate-900',
    textQuoteEn: 'text-slate-700',
    quoteBoxBg: 'bg-slate-50/90 shadow-xs',
    quoteBoxBorder: 'border-slate-200',
    buttonPrimary: 'bg-slate-800 hover:bg-slate-900 text-white font-bold border border-slate-700',
    buttonCheckinRecited: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500',
    clozeMaskClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono border border-slate-300',
    clozeRevealedClass: 'text-slate-900 font-semibold bg-amber-100 px-1 rounded border-b border-amber-400',
    modeSelectorBg: 'bg-slate-100 border-slate-200',
    modeTabActive: 'bg-white text-slate-900 border border-slate-300 shadow-xs font-semibold',
    modeTabInactive: 'text-slate-500 hover:text-slate-800 hover:bg-white/50',
    categoryBadge: 'bg-sky-50 text-sky-900 border-sky-200',
  },
  olive: {
    id: 'olive',
    nameZh: '橄榄素青',
    nameEn: 'Olive Grove',
    isDark: false,
    colorSwatch: '#f0f5f1',
    bgMobileImg: bgLightMobile,
    bgWideImg: bgLightWide,
    bgOverlay: 'linear-gradient(rgba(242, 247, 242, 0.82), rgba(235, 242, 235, 0.92))',
    pageBgClass: 'bg-[#edf3ee] text-stone-800',
    cardBgClass: 'bg-[#fafdfa]/95 backdrop-blur-xl shadow-xl',
    cardBorderClass: 'border-emerald-900/15',
    headerFooterBg: 'bg-[#f4f9f4]/85 backdrop-blur-md',
    headerBorder: 'border-emerald-900/10',
    textHeading: 'text-emerald-950',
    textSubHeading: 'text-emerald-800',
    textPrimary: 'text-stone-800',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-500',
    textQuoteZh: 'text-stone-900',
    textQuoteEn: 'text-emerald-900',
    quoteBoxBg: 'bg-[#f0f6f0]/80 shadow-xs',
    quoteBoxBorder: 'border-emerald-900/10',
    buttonPrimary: 'bg-emerald-800 hover:bg-emerald-900 text-white font-bold border border-emerald-700/30',
    buttonCheckinRecited: 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600',
    clozeMaskClass: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-mono border border-emerald-300',
    clozeRevealedClass: 'text-emerald-900 font-semibold bg-emerald-100 px-1 rounded border-b border-emerald-500',
    modeSelectorBg: 'bg-emerald-100/60 border-emerald-900/10',
    modeTabActive: 'bg-white text-emerald-950 border border-emerald-300 shadow-xs font-semibold',
    modeTabInactive: 'text-emerald-800/70 hover:text-emerald-950 hover:bg-white/50',
    categoryBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300/60',
  },
  pure: {
    id: 'pure',
    nameZh: '圣洁素白',
    nameEn: 'Sanctuary White',
    isDark: false,
    colorSwatch: '#ffffff',
    bgMobileImg: bgLightMobile,
    bgWideImg: bgLightWide,
    bgOverlay: 'linear-gradient(rgba(255, 255, 255, 0.90), rgba(250, 250, 250, 0.96))',
    pageBgClass: 'bg-white text-stone-900',
    cardBgClass: 'bg-white backdrop-blur-xl shadow-xl',
    cardBorderClass: 'border-stone-200',
    headerFooterBg: 'bg-white/90 backdrop-blur-md',
    headerBorder: 'border-stone-200',
    textHeading: 'text-stone-900',
    textSubHeading: 'text-stone-700',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-400',
    textQuoteZh: 'text-stone-950',
    textQuoteEn: 'text-stone-800',
    quoteBoxBg: 'bg-stone-50 border-stone-200 shadow-xs',
    quoteBoxBorder: 'border-stone-200',
    buttonPrimary: 'bg-stone-900 hover:bg-black text-white font-bold',
    buttonCheckinRecited: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    clozeMaskClass: 'bg-stone-100 hover:bg-stone-200 text-stone-900 font-mono border border-stone-300',
    clozeRevealedClass: 'text-stone-950 font-semibold bg-stone-200 px-1 rounded border-b border-stone-600',
    modeSelectorBg: 'bg-stone-100 border-stone-200',
    modeTabActive: 'bg-white text-stone-950 border border-stone-300 shadow-xs font-semibold',
    modeTabInactive: 'text-stone-500 hover:text-stone-900 hover:bg-white/50',
    categoryBadge: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  twilight: {
    id: 'twilight',
    nameZh: '沉思夜霭',
    nameEn: 'Twilight Dark',
    isDark: true,
    colorSwatch: '#1c1917',
    bgMobileImg: bgDarkMobile,
    bgWideImg: bgDarkWide,
    bgOverlay: 'linear-gradient(rgba(12, 10, 9, 0.75), rgba(12, 10, 9, 0.88))',
    pageBgClass: 'bg-stone-950 text-stone-100',
    cardBgClass: 'bg-stone-900/80 backdrop-blur-xl shadow-2xl',
    cardBorderClass: 'border-amber-500/20',
    headerFooterBg: 'bg-stone-950/60 backdrop-blur-md',
    headerBorder: 'border-white/10',
    textHeading: 'text-amber-200',
    textSubHeading: 'text-amber-400/80',
    textPrimary: 'text-stone-100',
    textSecondary: 'text-stone-300',
    textMuted: 'text-stone-400',
    textQuoteZh: 'text-stone-100',
    textQuoteEn: 'text-stone-200',
    quoteBoxBg: 'bg-black/30',
    quoteBoxBorder: 'border-white/5',
    buttonPrimary: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:brightness-110 text-stone-950 font-bold border border-amber-300/40',
    buttonCheckinRecited: 'bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-400/40',
    clozeMaskClass: 'bg-amber-500/25 hover:bg-amber-500/40 text-amber-300/80 font-mono border border-amber-500/40',
    clozeRevealedClass: 'text-amber-300 font-semibold bg-amber-500/20 px-1 rounded border-b border-amber-400',
    modeSelectorBg: 'bg-black/40 border-white/10',
    modeTabActive: 'bg-gradient-to-b from-amber-500/30 to-amber-600/20 text-amber-200 border border-amber-500/40 shadow-sm font-semibold',
    modeTabInactive: 'text-stone-400 hover:text-stone-200 hover:bg-white/5',
    categoryBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
};
