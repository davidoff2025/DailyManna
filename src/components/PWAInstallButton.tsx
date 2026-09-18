import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as standalone app, hide prompt
  if (isInstalled) {
    return null;
  }

  // Android / Desktop Chromium native install prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition active:scale-95 shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>安装手机桌面 App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not fired by iOS WebKit)
  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-medium border border-white/15 transition active:scale-95"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
        <span>添加至 iPhone 主屏幕</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-amber-500/30 p-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-amber-200">
                添加至 iPhone / iPad 主屏幕
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs text-stone-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  在 iPhone 的 Safari 浏览器中，点击底部的 <strong>“分享” (Share)</strong> 图标（向上箭头的方框）。
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  在分享列表中向下滑动，选择 <strong>“添加到主屏幕” (Add to Home Screen)</strong>。
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  点击右上角 <strong>“添加”</strong>，即可在手机桌面拥有独立的圣经背诵 App，无需重复输入网址！
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-600 transition"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
};
