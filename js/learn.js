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
  var html = '<div class="page active">';
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

  // 步骤指示器
  for (var ss = 0; ss < 4; ss++) {
    document.getElementById('sdot-'+ss).onclick = (function(s){
      return function(){ if (s <= currentStep) goStep(s); };
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
    } else if (action === 'xie-next') {
      goNext();
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
      setTimeout(function(){ ChineseTTS.speakChar(charData.char); }, 400);
    }
    if (step === 1) {
      duReadCount = 0;
      var msgEl = document.getElementById('du-msg');
      if (msgEl) msgEl.textContent = '';
      var doneBtn = document.getElementById('du-done-btn');
      if (doneBtn) doneBtn.style.display = 'none';
      setTimeout(function(){ ChineseTTS.speakChar(charData.char); }, 500);
    }
    if (step === 2) {
      xieDone = false;
      var nextBtn = document.getElementById('xie-next-btn');
      if (nextBtn) nextBtn.style.display = 'none';
      initXieDemo();
      initTianZiGe();
    }
    if (step === 3) {
      initLianGame();
    }
  }

  // ===== 步骤0 HTML：认 =====
  function getRenHTML() {
    var wHtml = '';
    charData.words.forEach(function(w){
      wHtml += '<div class="ren-word-row" data-action="speak-word" data-word="'+w.word+'"><span>'+w.word+'</span><span class="rw-py">'+w.pinyin+'</span></div>';
    });

    var emojiH = '';
    if (charData.emoji && charData.emoji.length <= 4) {
      emojiH = '<div class="ren-emoji">'+charData.emoji+'</div>';
    } else {
      var cl = ['#FFD93D,#FF6B6B','#4ECDC4,#45B7D1','#A29BFE,#6C5CE7','#FD79A8,#E84393'];
      var c = cl[charData.id % cl.length];
      emojiH = '<div class="illus-bubble" style="background:linear-gradient(135deg,'+c+')"><span class="bubble-char">'+charData.char+'</span></div>';
    }

    return '<div class="ren-layout">'+
      '<div class="ren-left">'+emojiH+'<div class="ren-char-big">'+charData.char+'</div></div>'+
      '<div class="ren-right">'+
        '<div class="ren-pinyin">'+charData.pinyin+'</div>'+
        '<button class="speak-btn" data-action="speak-char">🔊 听发音</button>'+
        '<div class="ren-words-box"><h4>📝 组词（点击听发音）</h4>'+wHtml+'</div>'+
        '<div class="ren-sentence">'+charData.sentences[0]+'</div>'+
        '<button class="btn-cartoon" data-action="go-next">学会啦 → 去读</button>'+
      '</div>'+
    '</div>';
  }

  // ===== 步骤1 HTML：读 =====
  function getDuHTML() {
    return '<div class="du-layout">'+
      '<div class="du-char">'+charData.char+'</div>'+
      '<div class="du-pinyin">'+charData.pinyin+'</div>'+
      '<button class="du-read-circle" data-action="du-read">🔊</button>'+
      '<div class="du-hint">👆 点一下，跟着读</div>'+
      '<div class="du-encourage" id="du-msg"></div>'+
      '<button class="btn-cartoon orange" data-action="du-done" id="du-done-btn" style="display:none">读完啦 → 去写</button>'+
    '</div>';
  }

  function handleDuRead() {
    ChineseTTS.speakChar(charData.char);
    duReadCount++;
    var msgEl = document.getElementById('du-msg');
    var msgs = ['真棒！再来一遍！👏','声音真响亮！📢','读得真好！💪'];
    if (duReadCount < 3) {
      if (msgEl) msgEl.textContent = msgs[duReadCount-1];
    } else {
      if (msgEl) msgEl.textContent = '读得太好了！🎉';
      var doneBtn = document.getElementById('du-done-btn');
      if (doneBtn) doneBtn.style.display = 'inline-block';
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
        '<button class="btn-cartoon orange" data-action="xie-next" id="xie-next-btn" style="display:none">去玩游戏 → 🎯</button>'+
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
    var nb = document.getElementById('xie-next-btn');
    if (nb) nb.style.display = 'inline-block';
    App.playSound('star'); App.showStarAnimation(2);
  }

  // ===== 步骤3：大炮游戏 =====
  function initLianGame() {
    var box = document.getElementById('step-box');
    if (!box) return;

    var score = 0, rounds = 0, maxRounds = 5;
    var boats;

    function mkBoats() {
      var opts = [charData.char];
      var all = chars.filter(function(c){ return c.char !== charData.char; });
      shuffleArray(all);
      for (var i = 0; i < 4 && i < all.length; i++) opts.push(all[i].char);
      opts = shuffleArray(opts);
      var bs = [];
      for (var j = 0; j < opts.length; j++) {
        bs.push({
          char: opts[j], isTarget: opts[j] === charData.char,
          top: 5 + Math.random()*38, left: 2 + j*20 + Math.random()*6,
          animDelay: Math.random()*2.5, hit: false
        });
      }
      return bs;
    }

    boats = mkBoats();

    function draw() {
      var h = '<div class="lian-scene" id="lian-scene">';
      h += '<div class="sea-waves"></div>';
      boats.forEach(function(b,i){
        if (b.hit) return;
        h += '<div class="sailboat" id="b'+i+'" style="top:'+b.top+'%;left:'+b.left+'%;animation-delay:-'+b.animDelay+'s"><div class="boat-char">'+b.char+'</div><div class="sail"></div><div class="hull"></div></div>';
      });
      h += '<div class="cannon" id="cannon"><div class="barrel"></div><div class="base"></div><div class="wheel"></div></div>';
      h += '<div class="lian-prompt">🎯 开炮打中带"<span style="color:#FFD93D;font-size:18px">'+charData.char+'</span>"的帆船！</div>';
      h += '<div class="lian-score">🏆 <span id="ls">'+score+'</span>/'+maxRounds+'</div>';
      h += '</div>';
      box.innerHTML = h;

      // 绑定帆船
      boats.forEach(function(b,i){
        if (b.hit) return;
        var el = document.getElementById('b'+i);
        if (!el) return;
        el.onclick = function(){
          if (b.hit) return;
          b.hit = true;
          fireCannon(b, el);
        };
      });
    }

    function fireCannon(boat, el) {
      var scene = document.getElementById('lian-scene');
      if (!scene) return;
      var sr = scene.getBoundingClientRect();
      var cn = document.getElementById('cannon');
      var cr = cn ? cn.getBoundingClientRect() : {left: sr.left+sr.width/2, top: sr.top+sr.height*0.7};
      var br = el.getBoundingClientRect();

      var ball = document.createElement('div');
      ball.className = 'cannonball';
      ball.style.left = (cr.left + cr.width/2 - sr.left) + 'px';
      ball.style.top = (cr.top - sr.top) + 'px';
      scene.appendChild(ball);

      setTimeout(function(){
        ball.style.transition = 'all 0.25s ease-in';
        ball.style.left = (br.left + br.width/2 - sr.left) + 'px';
        ball.style.top = (br.top + br.height/2 - sr.top) + 'px';
      }, 30);

      setTimeout(function(){
        if (ball.parentNode) ball.parentNode.removeChild(ball);

        var sp = document.createElement('div');
        sp.className = 'splash';
        sp.textContent = boat.isTarget ? '💥' : '💦';
        sp.style.left = (br.left + br.width/2 - 18 - sr.left) + 'px';
        sp.style.top = (br.top - sr.top) + 'px';
        scene.appendChild(sp);
        setTimeout(function(){ if (sp.parentNode) sp.parentNode.removeChild(sp); }, 600);

        if (boat.isTarget) {
          score++;
          var lsEl = document.getElementById('ls');
          if (lsEl) lsEl.textContent = score;
          el.style.transform = 'rotate(90deg) translateY(20px)';
          el.style.opacity = '0';
          App.playSound('correct'); App.showStarAnimation(1);
          rounds++;
          if (rounds >= maxRounds) {
            finishGame();
          } else {
            setTimeout(function(){ boats = mkBoats(); draw(); }, 700);
          }
        } else {
          el.style.animation = 'none'; el.offsetHeight;
          el.style.animation = 'wrong-shake 0.4s ease-in-out';
          App.playSound('wrong');
          setTimeout(function(){ el.style.animation = ''; boat.hit = false; }, 400);
        }
      }, 280);
    }

    function finishGame() {
      updateCharProgress(charData.id, 'practiced', true);
      updateCharProgress(charData.id, 'practiceScore', score);
      var stars = score >= 5 ? 3 : score >= 3 ? 2 : 1;
      if (stars > (progress.stars || 0)) updateCharProgress(charData.id, 'stars', stars);

      setTimeout(function(){
        App.playSound('complete'); App.showStarAnimation(stars);
        App.showDialog('游戏结束！🎉',
          score >= 5 ? '⭐⭐⭐' : score >= 3 ? '⭐⭐' : '⭐',
          '命中 '+score+'/'+maxRounds+' 次！', '继续', goNext);
      }, 400);
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
