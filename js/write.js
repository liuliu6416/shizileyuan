/**
 * 识字乐园 - 写字页
 * 笔画演示 + 手指描红（Canvas）
 */

function renderWrite(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) {
    App.navigateTo('home');
    return;
  }

  if (charIndex >= chars.length) {
    App.playSound('complete');
    App.showDialog('🎉 写字完成！', '✍️', '第' + levelId + '关的字都写完啦！', '回到首页', function() {
      App.navigateTo('home');
    });
    return;
  }

  var charData = chars[charIndex];
  var currentMode = 'demo'; // 'demo' | 'trace'

  var html = '';

  html += '<div class="page active">';

  // 顶部栏
  html += '<div class="top-bar">';
  html += '<button class="back-btn" onclick="App.navigateTo(\'learn/' + levelId + '/' + charIndex + '\')">←</button>';
  html += '<span class="title">写一写 - ' + charData.char + '</span>';
  html += '<span class="progress-dot">' + (charIndex + 1) + '/' + chars.length + '</span>';
  html += '</div>';

  // 模式切换
  html += '<div class="write-tabs">';
  html += '<button class="write-tab active" data-mode="demo">📺 看笔画</button>';
  html += '<button class="write-tab" data-mode="trace">✍️ 自己写</button>';
  html += '</div>';

  // 笔画演示区域（Hanzi Writer SVG）
  html += '<div id="stroke-canvas" style="width:300px;height:300px;margin:0 auto;background:white;border-radius:var(--radius-md);box-shadow:var(--shadow-card)"></div>';

  // 描红Canvas（默认隐藏）
  html += '<div class="canvas-container" id="trace-container" style="display:none">';
  html += '<canvas id="trace-canvas" width="300" height="300"></canvas>';
  html += '</div>';

  // 控制按钮
  html += '<div class="write-controls" id="demo-controls">';
  html += '<button class="btn-cartoon secondary small" id="btn-play">▶️ 播放</button>';
  html += '<button class="btn-cartoon secondary small" id="btn-reset">🔄 重置</button>';
  html += '<button class="btn-cartoon secondary small" id="btn-slower">🐢 慢速</button>';
  html += '<button class="btn-cartoon secondary small" id="btn-faster">🐇 快速</button>';
  html += '</div>';

  // 描红控制
  html += '<div class="write-controls" id="trace-controls" style="display:none">';
  html += '<button class="btn-cartoon secondary small" id="btn-clear">🔄 清除</button>';
  html += '<button class="btn-cartoon small" id="btn-done-trace">✅ 写好了</button>';
  html += '</div>';

  // 信息
  html += '<div class="write-info">';
  html += '笔画：' + charData.strokeCount + '画 ｜ 用手指描一描吧！';
  html += '</div>';

  // 鼓励文字
  html += '<div class="write-encouragement" id="encouragement"></div>';

  // 导航按钮
  html += '<div class="nav-buttons">';
  if (charIndex > 0) {
    html += '<button class="btn-cartoon secondary small" onclick="App.navigateTo(\'write/' + levelId + '/' + (charIndex - 1) + '\')">← 上一个</button>';
  }
  html += '<button class="btn-cartoon accent small" onclick="App.navigateTo(\'practice/' + levelId + '/' + charIndex + '\')">🎮 练一练</button>';
  if (charIndex < chars.length - 1) {
    html += '<button class="btn-cartoon small" onclick="App.navigateTo(\'write/' + levelId + '/' + (charIndex + 1) + '\')">下一个 →</button>';
  }
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // ===== 初始化笔画演示 =====
  var writer = null;
  var animationSpeed = 1.5;

  try {
    writer = HanziWriter.create('stroke-canvas', charData.char, {
      width: 300,
      height: 300,
      padding: 5,
      strokeAnimationSpeed: animationSpeed,
      delayBetweenStrokes: 400,
      strokeColor: '#FF6B6B',
      radicalColor: '#4ECDC4',
      outlineColor: '#E0E0E0',
      showOutline: true,
      showCharacter: true,
      charDataLoader: function(char, onComplete) {
        // 从CDN加载笔画数据，失败时给空数据
        fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + char + '.json')
          .then(function(r) { return r.json(); })
          .then(function(data) { onComplete(data); })
          .catch(function() {
            // 笔画数据加载失败，使用基础渲染
            console.warn('笔画数据加载失败：' + char);
            onComplete({ strokes: [], medians: [] });
          });
      }
    });
  } catch (e) {
    console.warn('Hanzi Writer 初始化失败', e);
    document.getElementById('stroke-canvas').innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:100px;font-family:var(--font-cartoon);color:#DDD">' + charData.char + '</div>';
  }

  // 演示控制
  document.getElementById('btn-play').addEventListener('click', function() {
    if (writer) {
      writer.animateCharacter({
        onComplete: function() {
          document.getElementById('encouragement').textContent = '看清楚了吗？试试自己写吧！✍️';
        }
      });
      document.getElementById('encouragement').textContent = '';
    }
  });

  document.getElementById('btn-reset').addEventListener('click', function() {
    if (writer) {
      writer.cancelAnimation();
      writer.reset();
      document.getElementById('encouragement').textContent = '';
    }
  });

  document.getElementById('btn-slower').addEventListener('click', function() {
    animationSpeed = Math.max(0.5, animationSpeed - 0.5);
    if (writer) writer.updateStrokeAnimationSpeed(animationSpeed);
    document.getElementById('encouragement').textContent = '速度：' + animationSpeed + 'x 🐢';
  });

  document.getElementById('btn-faster').addEventListener('click', function() {
    animationSpeed = Math.min(3, animationSpeed + 0.5);
    if (writer) writer.updateStrokeAnimationSpeed(animationSpeed);
    document.getElementById('encouragement').textContent = '速度：' + animationSpeed + 'x 🐇';
  });

  // ===== 模式切换 =====
  var tabs = root.querySelectorAll('.write-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');

      var mode = this.dataset.mode;
      currentMode = mode;

      if (mode === 'demo') {
        document.getElementById('stroke-canvas').style.display = 'block';
        document.getElementById('trace-container').style.display = 'none';
        document.getElementById('demo-controls').style.display = 'flex';
        document.getElementById('trace-controls').style.display = 'none';
      } else {
        document.getElementById('stroke-canvas').style.display = 'none';
        document.getElementById('trace-container').style.display = 'block';
        document.getElementById('demo-controls').style.display = 'none';
        document.getElementById('trace-controls').style.display = 'flex';
        initTraceCanvas(charData);
      }
    });
  });

  // ===== 描红Canvas =====
  function initTraceCanvas(cData) {
    var canvas = document.getElementById('trace-canvas');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var hasDrawn = false;

    // 先绘制描红底字
    drawGhostCharacter(ctx, cData.char);

    // 触摸事件
    canvas.onpointerdown = function(e) {
      drawing = true;
      hasDrawn = true;
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      ctx.beginPath();
      ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      e.preventDefault();
    };

    canvas.onpointermove = function(e) {
      if (!drawing) return;
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      e.preventDefault();
    };

    canvas.onpointerup = function() {
      drawing = false;
      if (hasDrawn) {
        document.getElementById('encouragement').textContent = '画得真棒！继续加油！⭐';
      }
    };

    canvas.onpointerleave = function() {
      drawing = false;
    };
  }

  function drawGhostCharacter(ctx, char) {
    ctx.clearRect(0, 0, 300, 300);

    // 绘制半透明的描红底字
    ctx.font = '180px "ZCOOL KuaiLe", "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillText(char, 150, 150);
  }

  // 清除按钮
  document.getElementById('btn-clear').addEventListener('click', function() {
    var canvas = document.getElementById('trace-canvas');
    var ctx = canvas.getContext('2d');
    drawGhostCharacter(ctx, charData.char);
    document.getElementById('encouragement').textContent = '重新写吧！💪';
  });

  // 完成按钮
  document.getElementById('btn-done-trace').addEventListener('click', function() {
    updateCharProgress(charData.id, 'written', true);

    // 获取现有星级，不低于1星
    var currentStars = getCharProgress(charData.id).stars || 0;
    if (currentStars < 1) {
      updateCharProgress(charData.id, 'stars', 1);
      currentStars = 1;
    }

    App.playSound('complete');
    App.showStarAnimation(currentStars);

    var starDisplay = '';
    for (var s = 0; s < 3; s++) {
      starDisplay += s < currentStars ? '⭐' : '☆';
    }

    var nextIdx = charIndex + 1;
    if (nextIdx < chars.length) {
      App.showDialog('写字完成！', starDisplay, charData.char + ' 写得真好！\n继续写下一个字吧！', '下一个字', function() {
        App.navigateTo('write/' + levelId + '/' + nextIdx);
      });
    } else {
      App.showDialog('全部写完啦！', starDisplay, '第' + levelId + '关的字都写完啦！\n你好厉害！🏆', '回到首页', function() {
        App.navigateTo('home');
      });
    }
  });

  // 自动播放一次笔画演示
  setTimeout(function() {
    if (writer) {
      try {
        writer.animateCharacter();
      } catch(e) {}
    }
  }, 500);
}
