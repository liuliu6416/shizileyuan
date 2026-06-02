/**
 * 识字乐园 - 四步学习页 v3（事件委托修复）
 */
function renderLearn(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) { App.navigateTo('home'); return; }
  if (charIndex < 0) charIndex = 0;
  if (charIndex >= chars.length) {
    var nl = levelId + 1;
    App.playSound('complete');
    App.showDialog('🎉太棒了！','🌟','第'+levelId+'关完成！',nl<=getTotalLevels()?'下一关':'回家',function(){
      App.navigateTo(nl<=getTotalLevels()?'learn/'+nl+'/0':'home');
    });
    return;
  }

  var charData = chars[charIndex];
  var progress = getCharProgress(charData.id);
  var currentStep = 0;

  if (!progress.learned) updateCharProgress(charData.id,'learned',true);

  // 构建页面
  var html = '<div class="page active page-learn">';
  html += '<div class="top-bar">';
  html += '<button class="back-btn" id="tb-back">←</button>';
  html += '<span class="title">'+charData.char+' · 第'+levelId+'关</span>';
  html += '<span class="progress-dot">'+(charIndex+1)+'/'+chars.length+'</span>';
  html += '</div>';

  html += '<div class="step-indicator" id="step-bar">';
  var sn = ['👀 认','🗣️ 读','✍️ 写','🎯 练'];
  for (var s = 0; s < 4; s++) {
    if (s > 0) html += '<div class="step-line" id="sline-'+s+'"></div>';
    html += '<div class="step-dot" id="sdot-'+s+'">'+sn[s]+'</div>';
  }
  html += '</div>';

  html += '<div id="step-box"></div>';
  html += '</div>';

  root.innerHTML = html;

  // 返回按钮
  document.getElementById('tb-back').onclick = function(){ App.navigateTo('home'); };

  // 步骤指示器：点击跳转到下一步（或已完成的步骤）
  for (var ss = 0; ss < 4; ss++) {
    document.getElementById('sdot-'+ss).onclick = (function(s){
      return function(){
        if (s <= currentStep) {
          // 已完成的步骤：跳转回顾；当前步骤：前进
          if (s < currentStep) goStep(s);
          else goNext();
        }
      };
    })(ss);
  }

  // ==== 事件委托：step-box里所有带data-action的点击 ====
  document.getElementById('step-box').addEventListener('click', function(e){
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');

    if (action === 'speak-char') {
      ChineseTTS.speakChar(charData.char);
    } else if (action === 'speak-word') {
      var word = btn.getAttribute('data-word');
      if (word) ChineseTTS.speakWord(word);
    } else if (action === 'go-next') {
      goNext();
    } else if (action === 'du-read') {
      handleDuRead();
    } else if (action === 'du-done') {
      goNext();
    } else if (action === 'xie-play') {
      if (writerObj) writerObj.animateCharacter();
    } else if (action === 'xie-reset') {
      if (writerObj) { writerObj.cancelAnimation(); writerObj.reset(); }
    } else if (action === 'xie-clear') {
      clearTianZiGe();
    } else if (action === 'xie-done') {
      finishXie();
    }
  });

  // 读步骤的状态
  var duReadCount = 0;

  // 写步骤的状态
  var writerObj = null;
  var xieDone = false;

  goStep(0);

  function goStep(step) {
    currentStep = step;
    // 更新指示器
    for (var i = 0; i < 4; i++) {
      var dot = document.getElementById('sdot-'+i);
      if (dot) {
        dot.className = 'step-dot';
        if (i === step) dot.className += ' active';
        else if (i < step) dot.className += ' done';
      }
      if (i > 0) {
        var line = document.getElementById('sline-'+i);
        if (line) line.className = 'step-line' + (i <= step ? ' done' : '');
      }
    }
    renderStep(step);
  }

  function renderStep(step) {
    var box = document.getElementById('step-box');
    if (!box) return;
    box.innerHTML = getStepHTML(step);
    afterRender(step);
  }

  function getStepHTML(step) {
    if (step === 0) return getRenHTML();
    if (step === 1) return getDuHTML();
    if (step === 2) return getXieHTML();
    if (step === 3) return ''; // 练在afterRender里处理
    return '';
  }

  function afterRender(step) {
    if (step === 0) {
      // 拟物动画序列
      setTimeout(function(){ startMorphAnimation(); }, 300);
      setTimeout(function(){ ChineseTTS.speakChar(charData.char); }, 1200);
    }
    if (step === 1) {
      duReadCount = 0;
      var msgEl = document.getElementById('du-msg');
      if (msgEl) msgEl.textContent = '';
      setTimeout(function(){ ChineseTTS.speakChar(charData.char); }, 500);
    }
    if (step === 2) {
      xieDone = false;
      initXieDemo();
      initTianZiGe();
    }
    if (step === 3) {
      initLianGame();
    }
  }

  // ===== 步骤0 HTML：认（全屏大字+拟物动画） =====
  function getRenHTML() {
    var wHtml = '';
    charData.words.forEach(function(w){
      wHtml += '<div class="ren-word-row" data-action="speak-word" data-word="'+w.word+'"><span>'+w.word+'</span><span class="rw-py">'+w.pinyin+'</span></div>';
    });

    // 拟物动画：emoji渐变为汉字
    var morphHTML = '';
    if (charData.emoji && charData.emoji.length <= 4) {
      morphHTML =
        '<div class="morph-stage" id="morph-stage">'+
          '<div class="morph-emoji" id="morph-emoji">'+charData.emoji+'</div>'+
          '<div class="morph-char" id="morph-char">'+charData.char+'</div>'+
        '</div>';
    } else {
      // 没有emoji的字：气泡+字
      var cl = ['#FFD93D,#FF6B6B','#4ECDC4,#45B7D1','#A29BFE,#6C5CE7','#FD79A8,#E84393'];
      var c = cl[charData.id % cl.length];
      morphHTML =
        '<div class="morph-stage" id="morph-stage">'+
          '<div class="morph-emoji" id="morph-emoji" style="width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,'+c+');margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:70px;color:white;font-weight:900">'+charData.char+'</div>'+
          '<div class="morph-char" id="morph-char">'+charData.char+'</div>'+
        '</div>';
    }

    return '<div class="ren-full">'+
      // 背景装饰粒子
      '<div class="ren-particles" id="ren-particles"></div>'+
      // 拟物动画区
      morphHTML +
      // 拼音
      '<div class="ren-pinyin-row">'+
        '<span class="ren-pinyin-big">'+charData.pinyin+'</span>'+
        '<button class="speak-btn" data-action="speak-char">🔊</button>'+
      '</div>'+
      // 组词
      '<div class="ren-words-row" id="ren-words-row">'+
        '<div class="ren-words-box"><h4>📝 组词</h4>'+wHtml+'</div>'+
        '<div class="ren-sentence">'+charData.sentences[0]+'</div>'+
      '</div>'+
      // 按钮
      '<button class="btn-cartoon" data-action="go-next" style="margin:6px auto 0;display:block">学会啦 → 去读</button>'+
    '</div>';
  }

  // 拟物动画：emoji → 汉字
  function startMorphAnimation() {
    var stage = document.getElementById('morph-stage');
    var emoji = document.getElementById('morph-emoji');
    var charEl = document.getElementById('morph-char');
    if (!stage || !charEl) return;

    // 阶段1: emoji弹跳出现（0-0.8s）
    if (emoji) {
      emoji.style.cssText = 'animation:morph-in 0.8s var(--transition-bounce) forwards';
    }

    // 阶段2: emoji缩小消失 + 汉字放大出现（0.5-1.4s）
    setTimeout(function(){
      if (emoji) emoji.style.cssText = 'animation:morph-out 0.6s ease-in forwards';
      charEl.style.cssText = 'animation:morph-char-in 0.7s var(--transition-bounce) forwards';
    }, 600);

    // 阶段3: 汉字就位后持续浮动
    setTimeout(function(){
      charEl.style.cssText = 'animation:morph-char-float 2.5s ease-in-out infinite';
    }, 1400);

    // 阶段4: 组词滑入
    setTimeout(function(){
      var row = document.getElementById('ren-words-row');
      if (row) row.style.cssText = 'animation:slide-up 0.5s ease-out forwards';
    }, 1500);

    // 背景粒子
    spawnParticles();
  }

  function spawnParticles() {
    var container = document.getElementById('ren-particles');
    if (!container) return;
    var emojis = ['⭐','✨','🌸','🌟','💫','🎈','🌈','☁️','🫧','💖'];
    for (var i = 0; i < 12; i++) {
      (function(idx){
        setTimeout(function(){
          var p = document.createElement('span');
          p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
          p.style.cssText = 'position:absolute;font-size:'+(14+Math.random()*20)+'px;'+
            'left:'+(Math.random()*90)+'%;top:'+(Math.random()*80)+'%;'+
            'opacity:0;animation:particle-float '+(2+Math.random()*3)+'s ease-in-out '+(Math.random()*1)+'s forwards;'+
            'pointer-events:none';
          container.appendChild(p);
          setTimeout(function(){ if (p.parentNode) p.parentNode.removeChild(p); }, 4000);
        }, idx*100);
      })(i);
    }
  }

  // ===== 步骤1 HTML：读 =====
  function getDuHTML() {
    return '<div class="du-layout">'+
      '<div class="du-char">'+charData.char+'</div>'+
      '<div class="du-pinyin">'+charData.pinyin+'</div>'+
      '<button class="du-read-circle" data-action="du-read">🔊</button>'+
      '<div class="du-hint">👆 点一下，跟着读</div>'+
      '<div class="du-encourage" id="du-msg"></div>'+
      '<button class="btn-cartoon orange" data-action="du-done">学会啦 → 去写</button>'+
    '</div>';
  }

  function handleDuRead() {
    ChineseTTS.speakChar(charData.char);
    duReadCount++;
    var msgEl = document.getElementById('du-msg');
    var msgs = ['真棒！再来一遍！👏','声音真响亮！📢','读得真好！💪'];
    if (duReadCount <= 3) {
      if (msgEl) msgEl.textContent = msgs[Math.min(duReadCount-1, 2)];
    }
  }

  // ===== 步骤2 HTML：写 =====
  function getXieHTML() {
    return '<div class="xie-layout">'+
      '<div class="xie-demo-side">'+
        '<div class="xie-demo-area" id="xie-demo"></div>'+
        '<div class="xie-btns">'+
          '<button class="btn-cartoon small" data-action="xie-play">▶️ 播放</button>'+
          '<button class="btn-cartoon small orange" data-action="xie-reset">🔄 重来</button>'+
        '</div>'+
      '</div>'+
      '<div class="xie-trace-side">'+
        '<div class="tzgrid-wrap"><canvas class="tzgrid-canvas" id="tz-canvas" width="240" height="240"></canvas></div>'+
        '<div class="xie-btns">'+
          '<button class="btn-cartoon small orange" data-action="xie-clear">🔄 清除</button>'+
          '<button class="btn-cartoon green small" data-action="xie-done">✅ 写好了</button>'+
        '</div>'+
        '<div class="xie-msg" id="xie-msg"></div>'+
        '<button class="btn-cartoon orange" data-action="go-next">学会啦 → 去练</button>'+
      '</div>'+
    '</div>';
  }

  function initXieDemo() {
    try {
      writerObj = HanziWriter.create('xie-demo', charData.char, {
        width: 220, height: 220, padding: 5,
        strokeAnimationSpeed: 1.5, delayBetweenStrokes: 350,
        strokeColor: '#4A90D9', radicalColor: '#FF8C42',
        outlineColor: '#E0E0E0', showOutline: true, showCharacter: true
      });
    } catch(e) {
      var demo = document.getElementById('xie-demo');
      if (demo) demo.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:100px;font-weight:900;color:#DDD">'+charData.char+'</div>';
    }
    setTimeout(function(){ if (writerObj) writerObj.animateCharacter(); }, 400);
  }

  function initTianZiGe() {
    var cv = document.getElementById('tz-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');

    function drawTZG() {
      ctx.clearRect(0, 0, 240, 240);
      ctx.fillStyle = '#FFFEF9'; ctx.fillRect(0, 0, 240, 240);
      ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, 224, 224);
      ctx.setLineDash([4,4]); ctx.strokeStyle = '#CCC'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(120,8); ctx.lineTo(120,232); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8,120); ctx.lineTo(232,120); ctx.stroke();
      ctx.setLineDash([3,5]); ctx.strokeStyle = '#DDD'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(8,8); ctx.lineTo(232,232); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(232,8); ctx.lineTo(8,232); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '130px "PingFang SC","Heiti SC","STHeiti",sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillText(charData.char, 120, 120);
    }

    drawTZG();
    var drawing = false, hasDrawn = false;

    cv.onpointerdown = function(e) {
      drawing = true; hasDrawn = true;
      var r = cv.getBoundingClientRect(), sx = cv.width/r.width, sy = cv.height/r.height;
      ctx.beginPath(); ctx.moveTo((e.clientX-r.left)*sx, (e.clientY-r.top)*sy);
      e.preventDefault();
    };
    cv.onpointermove = function(e) {
      if (!drawing) return;
      var r = cv.getBoundingClientRect(), sx = cv.width/r.width, sy = cv.height/r.height;
      ctx.lineTo((e.clientX-r.left)*sx, (e.clientY-r.top)*sy);
      ctx.strokeStyle = '#4A90D9'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.stroke(); e.preventDefault();
    };
    cv.onpointerup = function() {
      drawing = false;
      if (hasDrawn) { var m = document.getElementById('xie-msg'); if (m) m.textContent = '写得真好！✍️'; }
    };
    cv.onpointerleave = function() { drawing = false; };

    // 保存清除函数
    window._clearTZG = function() { drawTZG(); var m = document.getElementById('xie-msg'); if (m) m.textContent = ''; hasDrawn = false; };
  }

  function clearTianZiGe() {
    if (window._clearTZG) window._clearTZG();
  }

  function finishXie() {
    updateCharProgress(charData.id, 'written', true);
    var m = document.getElementById('xie-msg');
    if (m) m.textContent = '完成啦！🎉';
    App.playSound('star'); App.showStarAnimation(2);
  }

  // ===== 步骤3：大炮游戏（升级版） =====
  function initLianGame() {
    var box = document.getElementById('step-box');
    if (!box) return;

    var score = 0, rounds = 0, maxRounds = 8;
    var boats, roundActive;

    function mkBoats() {
      roundActive = true;
      var allDistractors = chars.filter(function(c){ return c.char !== charData.char; });
      shuffleArray(allDistractors);

      // 5条船：1条目标 + 4条干扰，保证目标一定出现
      var boatChars = [];
      // 随机选目标位置
      var targetPos = Math.floor(Math.random() * 5);
      for (var i = 0; i < 5; i++) {
        if (i === targetPos) {
          boatChars.push({ char: charData.char, isTarget: true });
        } else {
          var idx = i < targetPos ? i : i - 1;
          boatChars.push({ char: allDistractors[idx].char, isTarget: false });
        }
      }
      shuffleArray(boatChars);

      var bs = [];
      var direction = rounds % 2 === 0 ? 'left' : 'right'; // 交替方向
      for (var j = 0; j < boatChars.length; j++) {
        // 分散在不同高度
        var topPct = 5 + j * 20 + Math.random() * 5;
        bs.push({
          char: boatChars[j].char,
          isTarget: boatChars[j].isTarget,
          top: topPct,
          direction: direction,
          hit: false
        });
      }
      return bs;
    }

    boats = mkBoats();

    function draw() {
      var speedClass = rounds >= 5 ? 'sail-fast' : '';
      var h = '<div class="lian-scene" id="lian-scene">';
      h += '<div class="sea-waves"></div>';

      boats.forEach(function(b,i){
        if (b.hit) return;
        var dirClass = (i % 2 === 0) ? 'sail-left' : 'sail-right';
        h += '<div class="sailboat '+dirClass+' '+speedClass+'" id="b'+i+'" style="top:'+b.top+'%"><div class="boat-char">'+b.char+'</div><div class="sail"></div><div class="hull"></div></div>';
      });

      h += '<div class="cannon" id="cannon"><div class="barrel"></div><div class="base"></div><div class="wheel"></div></div>';
      h += '<div class="lian-prompt">🎯 开炮打 "<span style="color:#FFD93D;font-size:22px">'+charData.char+'</span>" ！</div>';
      h += '<div class="lian-score">⭐ <span id="ls">'+score+'</span> / '+maxRounds+'</div>';
      h += '</div>';
      h += '<div style="text-align:center;margin:6px 0;display:flex;gap:8px;justify-content:center">';
      h += '<span style="background:rgba(255,255,255,0.9);padding:4px 10px;border-radius:12px;font-size:13px;font-weight:700">第<span id="rd-num">'+(rounds+1)+'</span>/'+maxRounds+'轮</span>';
      h += '<button class="btn-cartoon orange small" data-action="go-next">学会啦 → 下一个字</button>';
      h += '</div>';
      box.innerHTML = h;

      // 绑定帆船点击
      boats.forEach(function(b,i){
        if (b.hit) return;
        var el = document.getElementById('b'+i);
        if (!el) return;
        el.onclick = function(){
          if (b.hit || !roundActive) return;
          b.hit = true;
          fireCannon(b, el);
        };
      });
    }

    function fireCannon(boat, el) {
      roundActive = false;
      var scene = document.getElementById('lian-scene');
      if (!scene) return;
      var sr = scene.getBoundingClientRect();
      var cn = document.getElementById('cannon');
      var cr = cn ? cn.getBoundingClientRect() : {left: sr.left+sr.width/2, top: sr.top+sr.height*0.75};
      var br = el.getBoundingClientRect();

      // 炮弹
      var ball = document.createElement('div');
      ball.className = 'cannonball';
      ball.style.cssText = 'width:14px;height:14px;left:'+(cr.left+cr.width/2-sr.left-7)+'px;top:'+(cr.top-sr.top-7)+'px;';
      scene.appendChild(ball);

      // 开炮闪光
      var flash = document.createElement('div');
      flash.style.cssText = 'position:absolute;width:30px;height:30px;background:#FFD93D;border-radius:50%;left:'+(cr.left+cr.width/2-sr.left-15)+'px;top:'+(cr.top-sr.top-15)+'px;z-index:16;pointer-events:none;animation:splash-pop 0.3s ease-out forwards';
      scene.appendChild(flash);
      setTimeout(function(){ if (flash.parentNode) flash.parentNode.removeChild(flash); }, 300);

      setTimeout(function(){
        ball.style.transition = 'all 0.3s cubic-bezier(0.25,0.1,0.25,1)';
        ball.style.left = (br.left+br.width/2-sr.left-7)+'px';
        ball.style.top = (br.top+br.height/2-sr.top-7)+'px';
      }, 30);

      setTimeout(function(){
        if (ball.parentNode) ball.parentNode.removeChild(ball);

        if (boat.isTarget) {
          // 命中！爆炸效果
          for (var p = 0; p < 5; p++) {
            (function(delay){
              var particle = document.createElement('div');
              particle.className = 'splash';
              particle.textContent = ['💥','⭐','✨','🔥','💫'][delay];
              particle.style.cssText = 'left:'+(br.left+br.width/2-25+Math.random()*30-sr.left)+'px;top:'+(br.top-10+Math.random()*20-sr.top)+'px;animation-delay:'+(delay*0.08)+'s';
              scene.appendChild(particle);
              setTimeout(function(){ if (particle.parentNode) particle.parentNode.removeChild(particle); }, 800);
            })(p);
          }

          score++;
          var lsEl = document.getElementById('ls');
          if (lsEl) lsEl.textContent = score;
          // 沉船动画
          el.style.transition = 'all 0.8s ease-in';
          el.style.transform = 'rotate(120deg) translateY(40px) scale(0.5)';
          el.style.opacity = '0';
          App.playSound('correct');
          App.showStarAnimation(1);
          rounds++;

          if (rounds >= maxRounds) {
            setTimeout(finishGame, 600);
          } else {
            setTimeout(function(){
              boats = mkBoats();
              draw();
            }, 900);
          }
        } else {
          // 打偏了
          var sp = document.createElement('div');
          sp.className = 'splash';
          sp.textContent = '💦';
          sp.style.left = (br.left+br.width/2-20-sr.left)+'px';
          sp.style.top = (br.top-5-sr.top)+'px';
          scene.appendChild(sp);
          setTimeout(function(){ if (sp.parentNode) sp.parentNode.removeChild(sp); }, 600);

          // 船摇晃
          el.style.animation = 'none'; el.offsetHeight;
          el.style.animation = 'wrong-shake 0.5s ease-in-out';
          App.playSound('wrong');
          setTimeout(function(){
            el.style.animation = '';
            boat.hit = false;
            roundActive = true;
          }, 500);
        }
      }, 320);
    }

    function finishGame() {
      updateCharProgress(charData.id, 'practiced', true);
      updateCharProgress(charData.id, 'practiceScore', score);
      var stars = score >= 7 ? 3 : score >= 5 ? 2 : 1;
      if (stars > (progress.stars || 0)) updateCharProgress(charData.id, 'stars', stars);

      App.playSound('complete'); App.showStarAnimation(stars);
      App.showDialog('游戏结束！🎉',
        score >= 7 ? '⭐⭐⭐' : score >= 5 ? '⭐⭐' : '⭐',
        '命中 '+score+' / '+maxRounds+' 次！\n真厉害！',
        '继续', goNext);
    }

    draw();
  }

  function goNext() {
    if (currentStep < 3) {
      goStep(currentStep + 1);
    } else {
      updateCharProgress(charData.id, 'stars', Math.max(progress.stars || 0, 1));
      var ni = charIndex + 1;
      if (ni < chars.length) {
        App.playSound('complete'); App.showStarAnimation(3);
        App.showDialog('太棒了！🎉','⭐',charData.char+' 学完啦！','下一个字',function(){
          App.navigateTo('learn/'+levelId+'/'+ni);
        });
      } else {
        App.playSound('complete'); App.showStarAnimation(3);
        App.showDialog('通关！🏆','🌟','第'+levelId+'关全部学完！','回到首页',function(){
          App.navigateTo('home');
        });
      }
    }
  }
}

function shuffleArray(a){
  var r = a.slice();
  for (var i = r.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1)), t = r[i]; r[i] = r[j]; r[j] = t;
  }
  return r;
}
