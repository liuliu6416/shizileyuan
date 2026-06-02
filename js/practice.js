/**
 * 识字乐园 - 练字页
 * 3种互动选择题游戏：看字选图、听音选字、找字游戏
 */

function renderPractice(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) {
    App.navigateTo('home');
    return;
  }

  if (charIndex >= chars.length) {
    // 本关练习全部完成
    App.playSound('complete');
    App.showDialog('🎉 练习完成！', '⭐', '第' + levelId + '关的练习都做完啦！', '回到首页', function() {
      App.navigateTo('home');
    });
    return;
  }

  var charData = chars[charIndex];
  var gameOrder = shuffleArray([1, 2, 3]); // 随机游戏顺序
  var currentGameIndex = 0;
  var results = []; // 每题结果: true/false

  // 渲染游戏容器
  var html = '';
  html += '<div class="page active">';

  // 顶部栏
  html += '<div class="top-bar">';
  html += '<button class="back-btn" onclick="App.navigateTo(\'learn/' + levelId + '/' + charIndex + '\')">←</button>';
  html += '<span class="title">练一练 - 第' + levelId + '关</span>';
  html += '<span class="progress-dot">' + (charIndex + 1) + '/' + chars.length + '</span>';
  html += '</div>';

  // 练习头
  html += '<div class="practice-header">';
  html += '<div style="font-family:var(--font-cartoon);font-size:24px;margin-bottom:8px">练一练：<span style="color:var(--color-primary)">' + charData.char + '</span></div>';
  html += '<div class="practice-score" id="practice-dots">';
  html += '<span class="practice-dot"></span>';
  html += '<span class="practice-dot"></span>';
  html += '<span class="practice-dot"></span>';
  html += '</div>';
  html += '</div>';

  // 游戏区域
  html += '<div class="game-area" id="game-area">';
  html += '</div>';

  // 反馈文字
  html += '<div class="feedback-text" id="feedback-text"></div>';

  // 继续按钮（初始隐藏）
  html += '<div style="text-align:center;margin-top:12px">';
  html += '<button class="btn-cartoon small" id="next-game-btn" style="display:none">继续 →</button>';
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // 开始第一个游戏
  renderGame(charData, gameOrder[currentGameIndex]);

  // 继续按钮事件
  document.getElementById('next-game-btn').addEventListener('click', function() {
    currentGameIndex++;
    if (currentGameIndex < gameOrder.length) {
      document.getElementById('feedback-text').textContent = '';
      document.getElementById('feedback-text').className = 'feedback-text';
      this.style.display = 'none';
      renderGame(charData, gameOrder[currentGameIndex]);
    } else {
      // 所有游戏完成
      finishPractice(charData, chars, charIndex, levelId);
    }
  });

  /**
   * 根据游戏类型渲染
   */
  function renderGame(cData, gameType) {
    var area = document.getElementById('game-area');
    area.innerHTML = '';

    switch (gameType) {
      case 1: renderMatchGame(cData, area); break;
      case 2: renderListenGame(cData, area); break;
      case 3: renderFindGame(cData, area); break;
    }
  }

  /**
   * 游戏1: 看字选图（看emoji选汉字）
   */
  function renderMatchGame(cData, area) {
    // 准备选项：1个正确 + 3个干扰项
    var options = [cData];
    var allChars = getCharsByLevel(levelId).filter(function(c) { return c.id !== cData.id; });
    shuffleArray(allChars);
    for (var i = 0; i < 3 && i < allChars.length; i++) {
      options.push(allChars[i]);
    }
    options = shuffleArray(options);

    var correctChar = cData.char;

    area.innerHTML =
      '<div class="game-question">🤔 这个图是哪个字？</div>' +
      '<div class="game-target-emoji">' + (cData.emoji || cData.char) + '</div>' +
      '<div class="options-grid" id="options-grid">' +
        options.map(function(opt) {
          return '<button class="option-btn" data-char="' + opt.char + '">' + opt.char + '</button>';
        }).join('') +
      '</div>';

    bindOptionClicks(correctChar);
  }

  /**
   * 游戏2: 听音选字
   */
  function renderListenGame(cData, area) {
    var options = [cData];
    var allChars = getCharsByLevel(levelId).filter(function(c) { return c.id !== cData.id; });
    shuffleArray(allChars);
    for (var i = 0; i < 3 && i < allChars.length; i++) {
      options.push(allChars[i]);
    }
    options = shuffleArray(options);

    var correctChar = cData.char;

    area.innerHTML =
      '<div class="game-question">👂 听一听，选一选</div>' +
      '<button class="speak-btn" id="replay-audio" style="margin:10px auto">🔊 再听一遍</button>' +
      '<div class="options-grid" id="options-grid">' +
        options.map(function(opt) {
          return '<button class="option-btn" data-char="' + opt.char + '">' + opt.char + '</button>';
        }).join('') +
      '</div>';

    // 先播放一遍
    setTimeout(function() {
      ChineseTTS.speakChar(cData.char);
    }, 300);

    document.getElementById('replay-audio').addEventListener('click', function() {
      ChineseTTS.speakChar(cData.char);
    });

    bindOptionClicks(correctChar);
  }

  /**
   * 游戏3: 找字游戏（3x3网格）
   */
  function renderFindGame(cData, area) {
    // 生成3x3网格，目标字出现2-3次
    var allChars = getCharsByLevel(levelId).filter(function(c) { return c.id !== cData.id; });
    shuffleArray(allChars);

    var cells = [];
    // 随机放2-3个目标字
    var targetCount = 2 + Math.floor(Math.random() * 2); // 2-3次
    var targetPositions = [];
    while (targetPositions.length < targetCount) {
      var pos = Math.floor(Math.random() * 9);
      if (targetPositions.indexOf(pos) === -1) targetPositions.push(pos);
    }

    for (var i = 0; i < 9; i++) {
      if (targetPositions.indexOf(i) !== -1) {
        cells.push({ char: cData.char, isTarget: true });
      } else {
        var dIdx = i;
        if (dIdx >= allChars.length) dIdx = i % allChars.length;
        cells.push({ char: allChars[dIdx].char, isTarget: false });
      }
    }

    var foundCount = 0;
    var totalTargets = targetCount;

    area.innerHTML =
      '<div class="game-question">🔍 找到所有的 "<span style="color:var(--color-primary);font-size:28px">' + cData.char + '</span>"：</div>' +
      '<div class="find-grid" id="find-grid">' +
        cells.map(function(cell, idx) {
          return '<div class="find-cell" data-target="' + cell.isTarget + '" data-idx="' + idx + '">' + cell.char + '</div>';
        }).join('') +
      '</div>' +
      '<div style="text-align:center;font-size:14px;color:var(--color-text-light);margin-top:8px">已找到：<span id="found-counter">0</span>/' + totalTargets + '</div>';

    var gridCells = area.querySelectorAll('.find-cell');
    gridCells.forEach(function(cell) {
      cell.addEventListener('click', function() {
        if (this.classList.contains('found')) return;

        if (this.dataset.target === 'true') {
          this.classList.add('found');
          foundCount++;
          document.getElementById('found-counter').textContent = foundCount;
          App.playSound('tap');

          if (foundCount >= totalTargets) {
            recordResult(true);
          }
        } else {
          // 点了非目标字
          this.classList.add('wrong');
          App.playSound('wrong');
          setTimeout(function() {
            cell.classList.remove('wrong');
          }, 400);
        }
      });
    });
  }

  /**
   * 绑定选项点击事件（游戏1和游戏2共用）
   */
  function bindOptionClicks(correctChar) {
    var answered = false;
    var btns = document.querySelectorAll('#options-grid .option-btn');

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (answered) return;
        answered = true;

        var selected = this.dataset.char;
        if (selected === correctChar) {
          this.classList.add('correct');
          App.playSound('correct');
          showFeedback(true);
          recordResult(true);
        } else {
          this.classList.add('wrong');
          App.playSound('wrong');
          // 高亮正确答案
          btns.forEach(function(b) {
            if (b.dataset.char === correctChar) b.classList.add('correct');
          });
          showFeedback(false);
          recordResult(false);
        }
      });
    });
  }

  /**
   * 记录单题结果
   */
  function recordResult(isCorrect) {
    results.push(isCorrect);
    updateDots();
    document.getElementById('next-game-btn').style.display = 'inline-block';
  }

  /**
   * 更新进度点
   */
  function updateDots() {
    var dots = document.querySelectorAll('#practice-dots .practice-dot');
    results.forEach(function(r, i) {
      if (i < dots.length) {
        dots[i].className = 'practice-dot ' + (r ? 'correct' : 'wrong');
      }
    });
  }

  /**
   * 显示反馈文字
   */
  function showFeedback(isCorrect) {
    var fb = document.getElementById('feedback-text');
    var messages = isCorrect
      ? ['太棒了！🎉', '真厉害！⭐', '答对啦！👏', '真聪明！💪']
      : ['再想想哦～💪', '差一点点！😊', '没关系，再来！🌟'];

    fb.textContent = isCorrect
      ? messages[Math.floor(Math.random() * messages.length)]
      : messages[Math.floor(Math.random() * messages.length)];
    fb.className = 'feedback-text ' + (isCorrect ? 'success' : 'retry');
  }

  /**
   * 完成所有练习
   */
  function finishPractice(cData, chars, cIdx, lvId) {
    var correctCount = results.filter(function(r) { return r; }).length;
    var starsEarned = correctCount >= 3 ? 3 : correctCount >= 2 ? 2 : 1;

    updateCharProgress(cData.id, 'practiced', true);
    updateCharProgress(cData.id, 'practiceScore', correctCount);
    // 取较大星级
    var currentStars = getCharProgress(cData.id).stars || 0;
    if (starsEarned > currentStars) {
      updateCharProgress(cData.id, 'stars', starsEarned);
    }

    App.playSound('complete');
    App.showStarAnimation(starsEarned);

    var starDisplay = '';
    for (var s = 0; s < 3; s++) {
      starDisplay += s < starsEarned ? '⭐' : '☆';
    }

    var nextIdx = cIdx + 1;
    if (nextIdx < chars.length) {
      App.showDialog('练习完成！', starDisplay, '答对 ' + correctCount + '/3 题\n获得 ' + starsEarned + ' 颗星星！', '下一个字', function() {
        App.navigateTo('practice/' + lvId + '/' + nextIdx);
      });
    } else {
      App.showDialog('全部练完啦！', starDisplay, '第' + lvId + '关练习全部完成！\n答对 ' + correctCount + '/3 题', '回到首页', function() {
        App.navigateTo('home');
      });
    }
  }
}

/**
 * 洗牌函数
 */
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}
