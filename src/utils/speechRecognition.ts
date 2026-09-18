// Web Speech Recognition helper for voice input of scripture reference or text

interface SpeechRecognitionServiceConfig {
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public start(config: SpeechRecognitionServiceConfig): boolean {
    if (!SpeechRecognitionService.isSupported()) {
      config.onError?.('您的浏览器暂不支持语音识别，请直接使用键盘输入经文号或文字。');
      return false;
    }

    try {
      this.stop(); // Stop any existing session

      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      this.recognition.lang = config.lang || 'zh-CN';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        config.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          config.onResult?.(currentText, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let msg = '语音识别遇到错误';
        if (event.error === 'not-allowed') {
          msg = '请允许浏览器使用麦克风权限，以便语音输入经文。';
        } else if (event.error === 'no-speech') {
          msg = '未检测到语音输入，请重试或贴近麦克风。';
        } else if (event.error === 'network') {
          msg = '语音网络连接超时，请检查网络或直接打字输入。';
        }
        config.onError?.(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        config.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Speech recognition start failed:', err);
      config.onError?.(err?.message || '无法启动麦克风语音识别');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}

export const speechRecognizer = new SpeechRecognitionService();
