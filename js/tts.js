/**
 * 识字乐园 - 真人发音朗读模块
 * 优先使用 Google Translate TTS（音质自然的真人发音）
 * 兜底使用浏览器内置 TTS
 */

var ChineseTTS = {
  // Google TTS 相关
  _audio: null,
  _useGoogleTTS: true,  // 是否启用Google TTS
  _queue: [],           // 朗读队列
  _playing: false,      // 是否正在播放

  // 浏览器TTS兜底
  synth: null,
  zhVoice: null,
  ready: false,
  _initAttempted: false,

  /**
   * 初始化
   */
  init: function() {
    if (this._initAttempted) return;
    this._initAttempted = true;

    // 初始化浏览器TTS作为兜底
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;

      var self = this;
      var loadVoices = function() {
        var voices = self.synth.getVoices();
        if (voices.length === 0) return;

        // iOS: 优先选 Ting-Ting（苹果高品质中文语音，接近真人）
        self.zhVoice = voices.find(function(v) { return v.name === 'Ting-Ting'; }) ||
                       voices.find(function(v) { return v.lang === 'zh-CN'; }) ||
                       voices.find(function(v) { return v.lang.startsWith('zh-CN'); }) ||
                       voices.find(function(v) { return v.lang.startsWith('zh-'); });

        if (self.zhVoice) {
          self.ready = true;
          console.log('✅ 浏览器中文语音就绪:', self.zhVoice.name);
        }
      };

      loadVoices();
      if (this.synth.addEventListener) {
        this.synth.addEventListener('voiceschanged', loadVoices);
      }
      setTimeout(function() {
        if (!self.ready) loadVoices();
      }, 1000);
    }

    // 预创建audio元素
    this._audio = new Audio();
  },

  /**
   * 主朗读方法
   * @param {string} text - 朗读文本
   * @param {number} rate - 语速（仅浏览器TTS使用）
   */
  speak: function(text, rate) {
    if (rate === undefined) rate = getSetting('ttsRate') || 0.9;
    if (!getSetting('ttsEnabled')) return false;

    // 优先使用Google TTS（真人发音音质）
    if (this._useGoogleTTS) {
      this._speakGoogle(text);
      return true;
    }

    // 兜底浏览器TTS
    return this._speakBrowser(text, rate);
  },

  /**
   * Google Translate TTS - 真人发音音质
   * 免费，无API Key，国内可访问
   */
  _speakGoogle: function(text) {
    var self = this;

    // 把文字加入队列
    this._queue.push(text);
    if (this._playing) return; // 正在播放，排队

    this._playNextInQueue();
  },

  _playNextInQueue: function() {
    var self = this;
    if (this._queue.length === 0) {
      this._playing = false;
      return;
    }

    this._playing = true;
    var text = this._queue.shift();

    // Google Translate TTS URL
    // tl=zh-CN 表示中文普通话
    // 分段处理：长文本拆开（Google TTS有长度限制）
    var chunks = this._splitText(text, 180);
    var chunkIndex = 0;

    function playChunk() {
      if (chunkIndex >= chunks.length) {
        // 所有分块播放完毕，播下一个队列项
        setTimeout(function() {
          self._playNextInQueue();
        }, 200);
        return;
      }

      var chunk = chunks[chunkIndex];
      var url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=' + encodeURIComponent(chunk);

      if (self._audio) {
        self._audio.src = url;
        self._audio.onended = function() {
          chunkIndex++;
          playChunk();
        };
        self._audio.onerror = function() {
          // Google TTS失败，降级到浏览器TTS
          console.warn('Google TTS 加载失败，切换到浏览器TTS');
          self._useGoogleTTS = false;

          // 把剩余文本用浏览器TTS读完
          var remaining = chunks.slice(chunkIndex).join('');
          self._speakBrowser(remaining);
          self._queue = []; // 清空队列
          self._playNextInQueue();
        };
        self._audio.play().catch(function() {
          self._useGoogleTTS = false;
          var remaining = chunks.slice(chunkIndex).join('');
          self._speakBrowser(remaining);
          self._queue = [];
          self._playNextInQueue();
        });
      } else {
        self._useGoogleTTS = false;
        self._speakBrowser(text);
        self._queue = [];
        self._playNextInQueue();
      }
    }

    playChunk();
  },

  /**
   * 浏览器TTS（兜底方案）
   */
  _speakBrowser: function(text, rate) {
    if (!this.synth) {
      this.init();
      if (!this.synth) return false;
    }

    this.synth.cancel();

    var safeText = String(text).replace(/</g, '＜').replace(/>/g, '＞');

    var utterance = new SpeechSynthesisUtterance(safeText);
    utterance.lang = 'zh-CN';
    if (this.zhVoice) utterance.voice = this.zhVoice;
    utterance.rate = rate || 0.9;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
    return true;
  },

  /**
   * 长文本分段（Google TTS URL 长度限制约200字符）
   */
  _splitText: function(text, maxLen) {
    if (text.length <= maxLen) return [text];

    var chunks = [];
    var remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxLen) {
        chunks.push(remaining);
        break;
      }

      // 在标点处断开
      var cutPoint = maxLen;
      for (var i = maxLen - 1; i >= maxLen - 30; i--) {
        if (i < 0) break;
        var ch = remaining[i];
        if (ch === '。' || ch === '，' || ch === '！' || ch === '？' || ch === '；' || ch === ' ' || ch === '　') {
          cutPoint = i + 1;
          break;
        }
      }

      chunks.push(remaining.substring(0, cutPoint));
      remaining = remaining.substring(cutPoint);
    }

    return chunks;
  },

  /**
   * 便捷方法
   */
  speakChar: function(char) {
    return this.speak(char, 0.75);
  },

  speakWord: function(word) {
    return this.speak(word, 0.85);
  },

  speakSentence: function(text) {
    return this.speak(text, 0.8);
  },

  /**
   * 停止所有播放
   */
  stop: function() {
    this._queue = [];
    this._playing = false;
    if (this._audio) {
      this._audio.pause();
      this._audio.src = '';
    }
    if (this.synth) this.synth.cancel();
  },

  hasChineseVoice: function() {
    return this.ready || this._useGoogleTTS;
  }
};
