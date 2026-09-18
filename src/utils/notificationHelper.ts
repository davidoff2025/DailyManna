import { BibleVerse } from '../types';

export class NotificationService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch (e) {
      console.warn('Notification permission error:', e);
      return false;
    }
  }

  public static sendVerseNotification(verse: BibleVerse): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const title = `📖 今日背诵经文 | Daily Verse (${verse.referenceZh})`;
      const body = `${verse.textZh}\n\n"${verse.textEn}"`;
      
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'daily-bible-verse',
        requireInteraction: false,
      });
      return true;
    } catch (e) {
      console.warn('Send notification error:', e);
      return false;
    }
  }
}
