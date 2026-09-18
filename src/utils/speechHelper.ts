export class SpeechService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  public static isSupported(): boolean {
    return !!this.synth;
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static speak(
    text: string,
    lang: 'zh' | 'en',
    rate: number = 0.9,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    const cleanText = text.replace(/【.*?】/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.rate = Math.min(Math.max(rate, 0.6), 1.4);
    utterance.pitch = 1.0;
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';

    // Try finding the best voice for the chosen language
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => {
      if (lang === 'zh') {
        return (
          v.lang.startsWith('zh') ||
          v.name.includes('Chinese') ||
          v.name.includes('Mandarin') ||
          v.name.includes('Ting-Ting') ||
          v.name.includes('Mei-Jia')
        );
      } else {
        return (
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Natural') || v.default)
        );
      }
    });

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      if (onError) onError(e);
    };

    this.synth.speak(utterance);
    return true;
  }
}
