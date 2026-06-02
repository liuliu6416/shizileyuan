/**
 * 识字乐园 - 认字页
 * 大字展示 + emoji插图 + TTS发音 + 组词 + 例句
 */

function renderLearn(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) {
    App.navigateTo('home');
    return;
  }

  // 确保索引在范围内
  if (charIndex < 0) charIndex = 0;
  if (charIndex >= chars.length) {
    // 本关完成，进入下一关或回到首页
    var nextLevel = levelId + 1;
    if (nextLevel <= getTotalLevels()) {
      App.playSound('complete');
      App.showDialog('🎉 太棒了！', '🌟', '你已经完成了第' + levelId + '关！\n继续挑战下一关吧！', '下一关', function() {
        App.navigateTo('learn/' + nextLevel + '/0');
      });
    } else {
      App.playSound('complete');
      App.showDialog('🎉 全部完成！', '🏆', '全部100个汉字你都认识了！\n真了不起！🏆', '回到首页', function() {
        App.navigateTo('home');
      });
    }
    return;
  }

  var charData = chars[charIndex];
  var progress = getCharProgress(charData.id);

  // 标记已学习
  if (!progress.learned) {
    updateCharProgress(charData.id, 'learned', true);
  }

  var html = '';

  // 气泡渐变色（用于抽象字）
  var bubbleColors = [
    'linear-gradient(135deg, #FFD93D, #FF6B6B)',
    'linear-gradient(135deg, #4ECDC4, #45B7D1)',
    'linear-gradient(135deg, #FF6B6B, #EE5A89)',
    'linear-gradient(135deg, #A29BFE, #6C5CE7)',
    'linear-gradient(135deg, #FD79A8, #E84393)',
    'linear-gradient(135deg, #00CEC9, #0984E3)',
    'linear-gradient(135deg, #FF9F43, #EE5A24)',
    'linear-gradient(135deg, #74B9FF, #3867D6)'
  ];
  var bubbleColor = bubbleColors[charData.id % bubbleColors.length];

  html += '<div class="page active">';

  // 顶部栏
  html += '<div class="top-bar">';
  html += '<button class="back-btn" onclick="App.navigateTo(\'home\')">←</button>';
  html += '<span class="title">第' + levelId + '关 - 学认字</span>';
  html += '<span class="progress-dot">' + (charIndex + 1) + '/' + chars.length + '</span>';
  html += '</div>';

  // 插图区域
  html += '<div class="learn-illustration">';
  if (charData.emoji && charData.emoji.length <= 4) {
    html += '<div class="emoji-illustration">' + charData.emoji + '</div>';
  } else {
    html += '<div class="illus-bubble" style="background:' + bubbleColor + '">';
    html += '<span class="bubble-char">' + charData.char + '</span>';
    html += '</div>';
  }
  html += '</div>';

  // 大字展示
  html += '<div class="learn-char-section">';
  html += '<div class="char-display-large">' + charData.char + '</div>';
  html += '</div>';

  // 拼音 + 发音按钮
  html += '<div class="learn-pinyin-section">';
  html += '<span class="pinyin-display">' + charData.pinyin + '</span>';
  html += '<button class="speak-btn" id="speak-char-btn" title="点击听发音">🔊 播放</button>';
  html += '</div>';

  // 关键词标签
  html += '<div style="text-align:center;margin:8px 0">';
  charData.keywords.forEach(function(kw) {
    html += '<span style="display:inline-block;padding:4px 12px;margin:3px;background:#FFF0F0;border-radius:20px;font-size:13px;color:var(--color-primary)">' + kw + '</span>';
  });
  html += '</div>';

  // 组词卡片
  html += '<div class="word-card">';
  html += '<h4>📝 组词</h4>';
  charData.words.forEach(function(w) {
    html += '<div class="word-item" data-speak="' + w.word + '">';
    html += '<span class="word-char">' + w.word + '</span>';
    html += '<span class="word-pinyin">' + w.pinyin + '</span>';
    html += '</div>';
  });
  html += '</div>';

  // 例句卡片
  html += '<div class="sentence-card">';
  html += '<h4>💬 例句</h4>';
  charData.sentences.forEach(function(s) {
    html += '<div class="sentence" data-speak="' + s + '">' + s + '</div>';
  });
  html += '</div>';

  // 导航按钮
  html += '<div class="nav-buttons">';
  if (charIndex > 0) {
    html += '<button class="btn-cartoon secondary small" onclick="App.navigateTo(\'learn/' + levelId + '/' + (charIndex - 1) + '\')">← 上一个</button>';
  } else {
    html += '<button class="btn-cartoon secondary small" style="visibility:hidden">←</button>';
  }
  html += '<button class="btn-cartoon accent small" id="learn-speak-all">🔊 全部朗读</button>';
  if (charIndex < chars.length - 1) {
    html += '<button class="btn-cartoon small" onclick="App.navigateTo(\'learn/' + levelId + '/' + (charIndex + 1) + '\')">下一个 →</button>';
  } else {
    html += '<button class="btn-cartoon small" onclick="App.navigateTo(\'learn/' + levelId + '/' + (charIndex + 1) + '\')">完成 🎉</button>';
  }
  html += '</div>';

  // 快捷操作
  html += '<div style="display:flex;justify-content:center;gap:12px;margin-top:16px">';
  html += '<button class="btn-cartoon secondary wide" onclick="App.navigateTo(\'practice/' + levelId + '/' + charIndex + '\')">🎮 练一练</button>';
  html += '<button class="btn-cartoon accent wide" onclick="App.navigateTo(\'write/' + levelId + '/' + charIndex + '\')">✍️ 写一写</button>';
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // 自动朗读汉字（页面进入时）
  setTimeout(function() {
    ChineseTTS.speakChar(charData.char);
  }, 300);

  // 发音按钮
  document.getElementById('speak-char-btn').addEventListener('click', function() {
    var btn = this;
    btn.classList.add('speaking');
    ChineseTTS.speakChar(charData.char);
    setTimeout(function() { btn.classList.remove('speaking'); }, 600);
  });

  // 全部朗读按钮
  document.getElementById('learn-speak-all').addEventListener('click', function() {
    var texts = [charData.char, charData.pinyin];
    charData.words.forEach(function(w) { texts.push(w.word); });
    charData.sentences.forEach(function(s) { texts.push(s); });

    var idx = 0;
    function speakNext() {
      if (idx < texts.length) {
        ChineseTTS.speak(texts[idx], 0.85);
        idx++;
        setTimeout(speakNext, 1200);
      }
    }
    speakNext();
  });

  // 组词和例句点击发音
  var speakItems = root.querySelectorAll('[data-speak]');
  speakItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var text = this.dataset.speak;
      App.playSound('tap');
      ChineseTTS.speakWord(text);
    });
  });
}
