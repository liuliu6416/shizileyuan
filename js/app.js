/**
 * 识字乐园 - 主应用
 * 负责：路由、页面切换、Service Worker注册、应用初始化
 */

var App = {
  currentPage: null,
  currentParams: {},

  /**
   * 应用初始化
   */
  init: function() {
    var self = this;

    // 自动锁定横屏
    this.lockLandscape();

    // 初始化TTS
    ChineseTTS.init();

    // 初始化存储
    if (!AppState) loadState();
    incrementSessions();

    // 监听路由变化
    window.addEventListener('hashchange', function() {
      self.handleRoute();
    });

    // 初始路由
    this.handleRoute();

    // 注册Service Worker
    this.registerSW();

    // 监听在线/离线状态
    this.watchNetwork();

    // 首次用户交互时再次尝试初始化TTS（iOS需要用户手势）
    document.addEventListener('click', function initTTS() {
      if (!ChineseTTS.ready) {
        ChineseTTS.init();
      }
    }, { once: true });
  },

  /**
   * 路由处理
   * URL格式: #/page/param1/param2
   */
  handleRoute: function() {
    var hash = location.hash.slice(1) || '/';
    var parts = hash.split('/').filter(Boolean);

    var page = parts[0] || 'home';
    var params = parts.slice(1);

    this.currentParams = {};

    switch (page) {
      case 'home':
        this.currentParams = {};
        break;
      case 'learn':
        this.currentParams = { levelId: parseInt(params[0]) || AppState.unlockedLevel, charIndex: parseInt(params[1]) || 0 };
        break;
      // practice和write现在整合到learn页面中，重定向
      case 'practice':
      case 'write':
        this.currentParams = { levelId: parseInt(params[0]) || AppState.unlockedLevel, charIndex: parseInt(params[1]) || 0 };
        page = 'learn';
        break;
      case 'review':
        this.currentParams = {};
        break;
      default:
        page = 'home';
        this.currentParams = {};
    }

    this.showPage(page, this.currentParams);
  },

  /**
   * 显示指定页面
   */
  showPage: function(pageName, params) {
    this.currentPage = pageName;
    var root = document.getElementById('app-root');
    root.innerHTML = '';

    // 滚动到顶部
    root.scrollTop = 0;

    switch (pageName) {
      case 'home':
        renderHome(root, params);
        break;
      case 'learn':
        renderLearn(root, params);
        break;
      case 'practice':
        renderPractice(root, params);
        break;
      case 'write':
        renderWrite(root, params);
        break;
      case 'review':
        renderReview(root, params);
        break;
      default:
        this.navigateTo('home');
    }
  },

  /**
   * 页面跳转
   */
  navigateTo: function(page) {
    location.hash = '#' + page;
  },

  /**
   * 自动锁定横屏
   */
  lockLandscape: function() {
    // 方法1: Screen Orientation API (PWA standalone模式可用)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').then(function() {
        console.log('✅ 横屏已锁定');
      }).catch(function() {
        console.log('⚠️ 需要添加到主屏幕才能锁定横屏');
      });
    }
    // 方法2: 监听旋转事件，不强制但提示
    window.addEventListener('orientationchange', function() {
      var hint = document.getElementById('rotate-hint');
      if (hint) {
        if (window.innerHeight > window.innerWidth) {
          hint.style.display = 'block';
        } else {
          hint.style.display = 'none';
        }
      }
    });
    // 初始检查
    var hint = document.getElementById('rotate-hint');
    if (hint && window.innerHeight > window.innerWidth) {
      hint.style.display = 'block';
    }
  },

  /**
   * 注册Service Worker
   */
  registerSW: function() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ 浏览器不支持Service Worker，无法离线使用');
      return;
    }

    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('✅ Service Worker 注册成功', reg.scope);
      })
      .catch(function(err) {
        console.warn('⚠️ Service Worker 注册失败', err);
      });
  },

  /**
   * 监听网络状态
   */
  watchNetwork: function() {
    var banner = document.getElementById('offline-banner');

    function updateOnlineStatus() {
      if (navigator.onLine) {
        if (banner) banner.style.display = 'none';
      } else {
        if (banner) banner.style.display = 'block';
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // 初始检查
    updateOnlineStatus();
  },

  /**
   * 播放音效（使用Web Audio API，无需音频文件）
   */
  playSound: function(type) {
    if (!getSetting('soundEffects')) return;

    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (type) {
        case 'correct':
          // 欢快的上升音
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
          osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
          break;

        case 'wrong':
          // 低沉的下降音
          osc.type = 'square';
          osc.frequency.setValueAtTime(330, ctx.currentTime);
          osc.frequency.setValueAtTime(262, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
          break;

        case 'tap':
          // 短促的点击音
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.08);
          break;

        case 'star':
          // 星星获得的闪亮音
          osc.type = 'sine';
          osc.frequency.setValueAtTime(988, ctx.currentTime);
          osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
          break;

        case 'complete':
          // 完成音效：上升琶音
          var notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
          notes.forEach(function(freq, i) {
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
            o.start(ctx.currentTime + i * 0.12);
            o.stop(ctx.currentTime + i * 0.12 + 0.3);
          });
          break;
      }
    } catch (e) {
      // 静默失败，不影响体验
    }
  },

  /**
   * 显示星星飘落动画
   */
  showStarAnimation: function(count) {
    var container = document.body;
    for (var i = 0; i < Math.min(count, 5); i++) {
      (function(idx) {
        setTimeout(function() {
          var star = document.createElement('div');
          star.className = 'star-animation';
          star.textContent = '⭐';
          star.style.left = (30 + Math.random() * 40) + '%';
          star.style.top = (30 + Math.random() * 30) + '%';
          star.style.animationDelay = (idx * 0.15) + 's';
          container.appendChild(star);

          setTimeout(function() {
            if (star.parentNode) star.parentNode.removeChild(star);
          }, 1000);
        }, idx * 150);
      })(i);
    }
  },

  /**
   * 显示完成弹窗
   */
  showDialog: function(title, emoji, text, buttonText, onClose) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';

    overlay.innerHTML =
      '<div class="dialog">' +
        '<div class="dialog-emoji">' + (emoji || '🎉') + '</div>' +
        '<div class="dialog-title">' + (title || '') + '</div>' +
        '<div class="dialog-text">' + (text || '') + '</div>' +
        '<button class="btn-cartoon wide" id="dialog-close">' + (buttonText || '好的') + '</button>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('#dialog-close').addEventListener('click', function() {
      document.body.removeChild(overlay);
      if (onClose) onClose();
    });

    // 点击遮罩也可以关闭
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        if (onClose) onClose();
      }
    });
  }
};

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});
