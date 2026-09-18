import React, { useState } from 'react';
import { X, Bell, Clock, Send, Smartphone, Check, AlertCircle } from 'lucide-react';
import { BibleVerse, UserPreferences } from '../types';
import { NotificationService } from '../utils/notificationHelper';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  currentVerse: BibleVerse;
}

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  currentVerse,
}) => {
  const [testSent, setTestSent] = useState(false);
  const [permError, setPermError] = useState('');
  const isSupported = NotificationService.isSupported();
  const currentPermission = NotificationService.getPermission();

  if (!isOpen) return null;

  const handleToggleReminder = async () => {
    if (!preferences.reminderEnabled) {
      const granted = await NotificationService.requestPermission();
      if (granted) {
        onUpdatePreferences({ reminderEnabled: true });
        setPermError('');
      } else {
        setPermError('请在浏览器设置中允许此网站发送通知，以便每日向您推送经文提醒。');
      }
    } else {
      onUpdatePreferences({ reminderEnabled: false });
    }
  };

  const handleSendTestPush = async () => {
    let perm = NotificationService.getPermission();
    if (perm !== 'granted') {
      const granted = await NotificationService.requestPermission();
      if (!granted) {
        setPermError('通知权限尚未开启。');
        return;
      }
    }
    const success = NotificationService.sendVerseNotification(currentVerse);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-stone-100 font-ui">
              每日推送背诵提醒
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
        <div className="p-5 space-y-4">
          {/* Main Toggle */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-stone-100">
                开启每日经文推送
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                每天定时推送今日双语背诵经文
              </div>
            </div>
            <button
              onClick={handleToggleReminder}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                preferences.reminderEnabled ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  preferences.reminderEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {permError && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{permError}</span>
            </div>
          )}

          {/* Time Picker */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-stone-200">每日提醒时间</span>
            </div>
            <input
              type="time"
              value={preferences.reminderTime}
              onChange={(e) => onUpdatePreferences({ reminderTime: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-stone-800 border border-white/15 text-amber-200 text-sm font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Instant Test Push Button */}
          <button
            onClick={handleSendTestPush}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {testSent ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>已发送测试推送！请查看系统通知</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>立即发送一条测试经文通知</span>
              </>
            )}
          </button>

          {/* iPhone / iOS Home Screen Tip */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>iPhone 手机极简使用建议：</span>
            </div>
            <ol className="text-[11px] text-stone-300/90 list-decimal list-inside space-y-1 leading-relaxed">
              <li>在 iPhone Safari 浏览器打开此网页链接。</li>
              <li>点击 Safari 底部的 <strong>“分享” (Share)</strong> 按钮。</li>
              <li>滑动并选择 <strong>“添加到主屏幕” (Add to Home Screen)</strong>。</li>
              <li>即可像独立 App 一样全屏沉浸背诵，每天随时提醒！</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
