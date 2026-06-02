/**
 * 识字乐园 - 四步学习页
 * 认 → 读 → 写 → 练
 * 每个字依次完成四个步骤
 */

function renderLearn(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) { App.navigateTo('home'); return; }
  if (charIndex < 0) charIndex = 0;
  if (charIndex >= chars.length) {
    // 本关完成
    App.playSound('complete');
    App.showDialog('🎉 太棒了！', '🌟', '第' + levelId + '关全部完成！', '下一关', function() {
      var nextLevel = levelId + 1;
      if (nextLevel <= getTotalLevels()) {
        App.navigateTo('learn/' + nextLevel + '/0');
      } else {
        App.navigateTo('home');
      }
    });
    return;
  }

  var charData = chars[charIndex];
  var progress = getCharProgress(charData.id);
  var currentStep = 0; // 默认从"认"开始

  // 标记已开始学习
  if (!progress.learned) updateCharProgress(charData.id, 'learned', true);

  renderAllSteps();

  function renderAllSteps() {
    var html = '';

    html += '<div class="page active">';

    // 顶部栏
    html += '<div class="top-bar">';
    html += '<button class="back-btn" onclick="App.navigateTo(\'home\')">←</button>';
    html += '<span class="title">' + charData.char + ' · 第' + levelId + '关</span>';
    html += '<span class="progress-dot">' + (charIndex + 1) + '/' + chars.length + '</span>';
    html += '</div>';

    // 步骤指示器
    html += '<div class="learn-steps" id="step-indicator">';
    var stepNames = ['👀 认', '🗣️ 读', '✍️ 写', '🎯 练'];
    for (var s = 0; s < 4; s++) {
      var cls = '';
      if (s === currentStep) cls = ' active';
      else if (s < currentStep) cls = ' done';
      html += '<div class="ls-dot' + cls + '" data-step="' + s + '">' + stepNames[s] + '</div>';
    }
    html += '</div>';

    // 步骤内容区
    html += '<div id="step-content" style="flex:1;overflow-y:auto"></div>';

    // 底部导航栏
    html += '<div class="bottom-nav">';
    html += '<button class="nav-item" onclick="App.navigateTo(\'home\')"><span class="nav-icon">🧭</span>探险</button>';
    html += '<button class="nav-item active"><span class="nav-icon">📖</span>学字</button>';
    html += '<button class="nav-item" onclick="App.navigateTo(\'review\')"><span class="nav-icon">🏆</span>宝藏</button>';
    html += '</div>';

    html += '</div>';

    root.innerHTML = html;

    // 绑定步骤点击
    document.querySelectorAll('.ls-dot').forEach(function(dot) {
      dot.addEventListener('click', function() {
        var step = parseInt(this.dataset.step);
        if (step <= currentStep) {
          switchStep(step);
        }
      });
    });

    // 渲染当前步骤
    switchStep(currentStep);
  }

  function switchStep(step) {
    currentStep = step;
    var container = document.getElementById('step-content');
    if (!container) return;

    // 更新步骤指示器
    var dots = document.querySelectorAll('.ls-dot');
    dots.forEach(function(d, i) {
      d.className = 'ls-dot';
      if (i === step) d.className += ' active';
      else if (i < step) d.className += ' done';
    });

    switch (step) {
      case 0: renderRen(container); break;
      case 1: renderDu(container); break;
      case 2: renderXie(container); break;
      case 3: renderLian(container); break;
    }
  }

  function goNextStep() {
    if (currentStep < 3) {
      currentStep++;
      switchStep(currentStep);
    } else {
      // 全部完成
      updateCharProgress(charData.id, 'stars', Math.max(progress.stars || 0, 1));
      var nextIdx = charIndex + 1;
      if (nextIdx < chars.length) {
        App.playSound('complete');
        App.showStarAnimation(3);
        App.showDialog('太棒了！🎉', '⭐', charData.char + ' 学完啦！', '下一个字', function() {
          App.navigateTo('learn/' + levelId + '/' + nextIdx);
        });
      } else {
        App.playSound('complete');
        App.showStarAnimation(3);
        App.showDialog('通关！🏆', '🌟', '第' + levelId + '关全部学完！', '回到首页', function() {
          App.navigateTo('home');
        });
      }
    }
  }

  // ===== 步骤1：认 =====
  function renderRen(container) {
    var wordsHtml = '';
    charData.words.forEach(function(w) {
      wordsHtml += '<div class="ren-word-item" onclick="ChineseTTS.speakWord(\'' + w.word + '\')">';
      wordsHtml += '<span class="rw-char">' + w.word + '</span>';
      wordsHtml += '<span class="rw-pinyin">' + w.pinyin + '</span>';
      wordsHtml += '</div>';
    });

    var emojiHtml = '';
    if (charData.emoji && charData.emoji.length <= 4) {
      emojiHtml = '<div class="ren-emoji">' + charData.emoji + '</div>';
    } else {
      var colors = ['#FFD93D,#FF6B6B', '#4ECDC4,#45B7D1', '#A29BFE,#6C5CE7', '#FD79A8,#E84393'];
      var c = colors[charData.id % colors.length];
      emojiHtml = '<div class="illus-bubble" style="background:linear-gradient(135deg,' + c + ')"><span class="bubble-char">' + charData.char + '</span></div>';
    }

    container.innerHTML =
      '<div class="ren-container">' +
        '<div class="ren-char-zone">' +
          emojiHtml +
          '<div class="ren-char-big">' + charData.char + '</div>' +
        '</div>' +
        '<div class="ren-info-zone">' +
          '<div class="pinyin-big">' + charData.pinyin + '</div>' +
          '<button class="speak-btn" onclick="ChineseTTS.speakChar(\'' + charData.char + '\')" style="margin:0 auto">🔊 听发音</button>' +
          '<div class="ren-words">' +
            '<h4>📝 组词（点一下听发音）</h4>' +
            wordsHtml +
          '</div>' +
          '<div style="font-size:15px;color:var(--color-text-light);text-align:center">' +
            charData.sentences[0] +
          '</div>' +
          '<button class="btn-cartoon" onclick="goNextStep()" style="margin:0 auto">学会啦，去读一读 →</button>' +
        '</div>' +
      '</div>';

    // 自动播放发音
    setTimeout(function() { ChineseTTS.speakChar(charData.char); }, 500);
  }

  // ===== 步骤2：读 =====
  function renderDu(container) {
    container.innerHTML =
      '<div class="du-container">' +
        '<div class="du-char-display">' + charData.char + '</div>' +
        '<div class="du-pinyin">' + charData.pinyin + '</div>' +
        '<button class="du-read-btn" id="du-read-btn" title="跟我读">🔊</button>' +
        '<div style="font-size:16px;color:var(--color-text-light)">👆 点一下，跟着读</div>' +
        '<div class="du-encourage" id="du-encourage"></div>' +
        '<button class="btn-cartoon orange" id="du-done-btn" style="display:none" onclick="goNextStep()">我读完啦，去写一写 →</button>' +
      '</div>';

    var readCount = 0;
    var encourageMsgs = ['真棒！再来一遍！👏', '声音真响亮！📢', '读得真好！再读一次！💪'];

    document.getElementById('du-read-btn').addEventListener('click', function() {
      ChineseTTS.speakChar(charData.char);
      readCount++;

      if (readCount < 3) {
        document.getElementById('du-encourage').textContent = encourageMsgs[readCount - 1];
      } else {
        document.getElementById('du-encourage').textContent = '读得太好了！🎉';
        document.getElementById('du-done-btn').style.display = 'inline-block';
      }
    });

    // 自动读第一遍
    setTimeout(function() { ChineseTTS.speakChar(charData.char); }, 600);
  }

  // ===== 步骤3：写（田字格） =====
  function renderXie(container) {
    container.innerHTML =
      '<div class="xie-container">' +
        '<div class="xie-tabs">' +
          '<button class="xie-tab active" id="xie-demo-tab">📺 看笔画</button>' +
          '<button class="xie-tab" id="xie-trace-tab">✍️ 描红</button>' +
        '</div>' +
        '<div id="xie-demo-area" style="width:260px;height:260px;margin:0 auto;background:white;border-radius:8px;box-shadow:var(--shadow-md)"></div>' +
        '<div id="xie-trace-area" style="display:none">' +
          '<div class="tianzige-wrapper">' +
            '<canvas class="tianzige-canvas" id="tianzige-canvas" width="260" height="260"></canvas>' +
          '</div>' +
        '</div>' +
        '<div class="xie-controls" id="xie-demo-ctrls">' +
          '<button class="btn-cartoon small" id="xie-play-btn">▶️ 播放</button>' +
          '<button class="btn-cartoon small orange" id="xie-reset-btn">🔄 重来</button>' +
        '</div>' +
        '<div class="xie-controls" id="xie-trace-ctrls" style="display:none">' +
          '<button class="btn-cartoon small orange" id="xie-clear-btn">🔄 清除</button>' +
          '<button class="btn-cartoon green small" id="xie-done-btn">✅ 写好了</button>' +
        '</div>' +
        '<div class="xie-encourage" id="xie-encourage"></div>' +
        '<button class="btn-cartoon orange" id="xie-next-btn" style="display:none" onclick="goNextStep()">去玩游戏 → 🎯</button>' +
      '</div>';

    // 初始化笔画动画
    var writer = null;
    try {
      writer = HanziWriter.create('xie-demo-area', charData.char, {
        width: 260, height: 260, padding: 5,
        strokeAnimationSpeed: 1.5, delayBetweenStrokes: 350,
        strokeColor: '#4A90D9', radicalColor: '#FF8C42',
        outlineColor: '#E0E0E0', showOutline: true, showCharacter: true
      });
    } catch(e) {
      document.getElementById('xie-demo-area').innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:120px;font-weight:900;color:#DDD">' + charData.char + '</div>';
    }

    // 演示控制
    document.getElementById('xie-play-btn').addEventListener('click', function() {
      if (writer) writer.animateCharacter();
    });
    document.getElementById('xie-reset-btn').addEventListener('click', function() {
      if (writer) { writer.cancelAnimation(); writer.reset(); }
    });

    // 自动播放
    setTimeout(function() { if (writer) writer.animateCharacter(); }, 500);

    // 模式切换：描红
    document.getElementById('xie-trace-tab').addEventListener('click', function() {
      document.getElementById('xie-demo-area').style.display = 'none';
      document.getElementById('xie-trace-area').style.display = 'block';
      document.getElementById('xie-demo-ctrls').style.display = 'none';
      document.getElementById('xie-trace-ctrls').style.display = 'flex';
      this.classList.add('active');
      document.getElementById('xie-demo-tab').classList.remove('active');
      if (writer) { writer.cancelAnimation(); writer.reset(); }
      initTianZiGe();
    });

    document.getElementById('xie-demo-tab').addEventListener('click', function() {
      document.getElementById('xie-demo-area').style.display = 'block';
      document.getElementById('xie-trace-area').style.display = 'none';
      document.getElementById('xie-demo-ctrls').style.display = 'flex';
      document.getElementById('xie-trace-ctrls').style.display = 'none';
      this.classList.add('active');
      document.getElementById('xie-trace-tab').classList.remove('active');
    });

    // 田字格描红
    function initTianZiGe() {
      var canvas = document.getElementById('tianzige-canvas');
      var ctx = canvas.getContext('2d');
      drawTianZiGe(ctx);

      var drawing = false;
      var hasDrawn = false;

      canvas.onpointerdown = function(e) {
        drawing = true; hasDrawn = true;
        var rect = canvas.getBoundingClientRect();
        var sx = canvas.width / rect.width, sy = canvas.height / rect.height;
        ctx.beginPath();
        ctx.moveTo((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy);
        e.preventDefault();
      };
      canvas.onpointermove = function(e) {
        if (!drawing) return;
        var rect = canvas.getBoundingClientRect();
        var sx = canvas.width / rect.width, sy = canvas.height / rect.height;
        ctx.lineTo((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy);
        ctx.strokeStyle = '#4A90D9'; ctx.lineWidth = 14;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.stroke();
        e.preventDefault();
      };
      canvas.onpointerup = function() {
        drawing = false;
        if (hasDrawn) {
          document.getElementById('xie-encourage').textContent = '写得真好！✍️';
        }
      };
    }

    function drawTianZiGe(ctx) {
      ctx.clearRect(0, 0, 260, 260);

      // 白底
      ctx.fillStyle = '#FFFEF9'; ctx.fillRect(0, 0, 260, 260);

      // 外框
      ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, 240, 240);

      // 十字虚线
      ctx.setLineDash([5, 5]); ctx.strokeStyle = '#CCC'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(130, 10); ctx.lineTo(130, 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 130); ctx.lineTo(250, 130); ctx.stroke();
      ctx.setLineDash([]);

      // 对角虚线
      ctx.setLineDash([3, 6]); ctx.strokeStyle = '#DDD'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(250, 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(250, 10); ctx.lineTo(10, 250); ctx.stroke();
      ctx.setLineDash([]);

      // 半透明描红底字
      ctx.font = '140px "PingFang SC","Heiti SC","STHeiti",sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillText(charData.char, 130, 130);
    }

    // 清除按钮
    document.getElementById('xie-clear-btn').addEventListener('click', function() {
      var canvas = document.getElementById('tianzige-canvas');
      drawTianZiGe(canvas.getContext('2d'));
      document.getElementById('xie-encourage').textContent = '';
    });

    // 完成按钮
    document.getElementById('xie-done-btn').addEventListener('click', function() {
      updateCharProgress(charData.id, 'written', true);
      document.getElementById('xie-encourage').textContent = '完成啦！🎉';
      document.getElementById('xie-next-btn').style.display = 'inline-block';
      App.playSound('star');
      App.showStarAnimation(2);
    });
  }

  // ===== 步骤4：练（大炮打帆船） =====
  function renderLian(container) {
    var score = 0;
    var rounds = 0;
    var maxRounds = 5;
    var targetChar = charData.char;

    // 生成帆船数据：1个正确目标 + 3-4个干扰
    function generateBoats() {
      var options = [targetChar];
      var allChars = chars.filter(function(c) { return c.char !== targetChar; });
      shuffleArray(allChars);
      for (var i = 0; i < 4 && i < allChars.length; i++) {
        options.push(allChars[i].char);
      }
      options = shuffleArray(options);

      var boats = [];
      for (var i = 0; i < options.length; i++) {
        boats.push({
          char: options[i],
          isTarget: options[i] === targetChar,
          top: 5 + Math.random() * 35, // % from top
          left: 3 + i * 20 + Math.random() * 5, // % from left
          animDelay: Math.random() * 2,
          hit: false
        });
      }
      return boats;
    }

    var boats = generateBoats();

    function renderGame() {
      var html = '';
      html += '<div class="lian-container" id="lian-game">';

      // 天空 + 海面
      html += '<div class="sea-waves"></div>';

      // 帆船
      boats.forEach(function(boat, idx) {
        if (boat.hit) return;
        html += '<div class="sailboat" id="boat-' + idx + '" style="top:' + boat.top + '%;left:' + boat.left + '%;animation-delay:-' + boat.animDelay + 's">';
        html += '<div class="boat-char">' + boat.char + '</div>';
        html += '<div class="sail"></div>';
        html += '<div class="hull"></div>';
        html += '</div>';
      });

      // 大炮
      html += '<div class="cannon" id="cannon">';
      html += '<div class="barrel"></div>';
      html += '<div class="base"></div>';
      html += '<div class="wheel"></div>';
      html += '</div>';

      // 提示文字
      html += '<div class="lian-prompt">🎯 开炮打中带 "<span style="color:#FFD93D;font-size:20px">' + targetChar + '</span>" 的帆船！</div>';
      html += '<div class="lian-score-board">🏆 <span id="lian-score">' + score + '</span> / ' + maxRounds + '</div>';

      html += '</div>';

      document.getElementById('step-content').innerHTML = html;

      // 绑定帆船点击
      boats.forEach(function(boat, idx) {
        if (boat.hit) return;
        var boatEl = document.getElementById('boat-' + idx);
        if (!boatEl) return;

        boatEl.addEventListener('click', function() {
          if (boat.hit) return;
          boat.hit = true;
          fireCannon(boat, boatEl, idx);
        });
      });
    }

    function fireCannon(boat, boatEl, idx) {
      // 炮弹动画
      var cannon = document.getElementById('cannon');
      var cannonRect = cannon ? cannon.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight * 0.7 };
      var boatRect = boatEl.getBoundingClientRect();

      var ball = document.createElement('div');
      ball.className = 'cannonball';
      ball.style.left = cannonRect.left + cannonRect.width/2 + 'px';
      ball.style.top = cannonRect.top + 'px';
      document.getElementById('lian-game').appendChild(ball);

      // 炮弹飞向帆船
      setTimeout(function() {
        ball.style.transition = 'all 0.3s ease-in';
        ball.style.left = boatRect.left + boatRect.width/2 + 'px';
        ball.style.top = boatRect.top + boatRect.height/2 + 'px';
      }, 50);

      // 命中效果
      setTimeout(function() {
        if (ball.parentNode) ball.parentNode.removeChild(ball);

        // 水花
        var splash = document.createElement('div');
        splash.className = 'splash';
        splash.textContent = boat.isTarget ? '💥' : '💦';
        splash.style.left = boatRect.left + boatRect.width/2 - 20 + 'px';
        splash.style.top = boatRect.top + 'px';
        document.getElementById('lian-game').appendChild(splash);
        setTimeout(function() { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 600);

        if (boat.isTarget) {
          // 命中！
          score++;
          document.getElementById('lian-score').textContent = score;
          // 帆船沉没
          boatEl.style.transform = 'rotate(90deg) translateY(30px)';
          boatEl.style.opacity = '0';
          App.playSound('correct');
          App.showStarAnimation(1);

          rounds++;
          if (rounds >= maxRounds) {
            finishLianGame();
          } else {
            // 重新生成帆船
            setTimeout(function() {
              boats = generateBoats();
              renderGame();
            }, 800);
          }
        } else {
          // 打错了
          boatEl.style.animation = 'wrong-shake 0.4s ease-in-out';
          App.playSound('wrong');
          setTimeout(function() { boatEl.style.animation = ''; boat.hit = false; }, 400);
        }
      }, 350);
    }

    function finishLianGame() {
      updateCharProgress(charData.id, 'practiced', true);
      updateCharProgress(charData.id, 'practiceScore', score);

      var stars = score >= 5 ? 3 : score >= 3 ? 2 : 1;
      if (stars > (progress.stars || 0)) {
        updateCharProgress(charData.id, 'stars', stars);
      }

      setTimeout(function() {
        App.playSound('complete');
        App.showStarAnimation(stars);
        App.showDialog('游戏结束！🎉',
          score >= 5 ? '⭐⭐⭐' : score >= 3 ? '⭐⭐' : '⭐',
          '命中 ' + score + ' / ' + maxRounds + ' 次！',
          '继续', goNextStep);
      }, 500);
    }

    renderGame();
  }
}

// 洗牌函数（全局复用）
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
