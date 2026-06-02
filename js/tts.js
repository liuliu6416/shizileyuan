/**
 * 识字乐园 - 中文语音朗读模块
 * 使用浏览器内置 SpeechSynthesis API，免费且支持离线
 */

var ChineseTTS = {
  synth: null,
  zhVoice: null,
  ready: false,
  _initAttempted: false,

  /**
   * 初始化TTS引擎
   */
  init: function() {
    if (this._initAttempted) return;
    this._initAttempted = true;

    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ 浏览器不支持语音朗读');
      return;
    }

    this.synth = window.speechSynthesis;

    var self = this;

    // 尝试加载中文语音
    var loadVoices = function() {
      var voices = self.synth.getVoices();
      if (voices.length === 0) return;

      // 按优先级查找中文语音
      // iOS: Ting-Ting (zh-CN)
      // Android: 取决于厂商
      // Chrome: Google 中文语音
      self.zhVoice = voices.find(function(v) { return v.lang === 'zh-CN'; }) ||
                     voices.find(function(v) { return v.lang.startsWith('zh-CN'); }) ||
                     voices.find(function(v) { return v.lang.startsWith('zh-'); }) ||
                     voices.find(function(v) { return /(chinese|yaoyao|tingting|xiaoyi|普通话|中文)/i.test(v.name); });

      if (self.zhVoice) {
        self.ready = true;
        console.log('✅ 中文语音已就绪:', self.zhVoice.name);
      } else {
        console.warn('⚠️ 未找到中文语音，请检查系统设置');
        console.log('可用语音:', voices.map(function(v) { return v.name + ' (' + v.lang + ')'; }));
      }
    };

    // Chrome: voices可能已加载
    loadVoices();

    // Safari: 需要异步加载
    if (this.synth.addEventListener) {
      this.synth.addEventListener('voiceschanged', loadVoices);
    }

    // 兜底：延迟再试一次
    setTimeout(function() {
      if (!self.ready) loadVoices();
    }, 1000);
  },

  /**
   * 朗读中文文本
   * @param {string} text - 要朗读的文本
   * @param {number} rate - 语速 (0.5-2.0, 默认0.9)
   * @returns {boolean} 是否成功开始朗读
   */
  speak: function(text, rate) {
    if (rate === undefined) rate = getSetting('ttsRate') || 0.9;

    if (!getSetting('ttsEnabled')) return false;

    if (!this.synth) {
      this.init();
      if (!this.synth) return false;
    }

    // 取消当前朗读，防止堆积
    this.synth.cancel();

    // 安全处理：iOS 26 某些版本尖括号可能导致TTS崩溃
    var safeText = String(text).replace(/</g, '＜').replace(/>/g, '＞');

    var utterance = new SpeechSynthesisUtterance(safeText);
    utterance.lang = 'zh-CN';
    if (this.zhVoice) {
      utterance.voice = this.zhVoice;
    }
    utterance.rate = rate;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
    return true;
  },

  /**
   * 朗读单个汉字（较慢语速）
   */
  speakChar: function(char) {
    return this.speak(char, 0.75);
  },

  /**
   * 朗读词语（正常语速）
   */
  speakWord: function(word) {
    return this.speak(word, 0.85);
  },

  /**
   * 朗读句子（稍慢语速，适合儿童）
   */
  speakSentence: function(text) {
    return this.speak(text, 0.8);
  },

  /**
   * 朗读拼音音节
   */
  speakPinyin: function(pinyin) {
    return this.speak(pinyin, 0.7);
  },

  /**
   * 检查是否有中文语音可用
   */
  hasChineseVoice: function() {
    return this.ready;
  }
};
