/**
 * 识字乐园 - 四步学习页（iPad横屏）
 * 认 → 读 → 写 → 练
 */
function renderLearn(root, params) {
  var levelId = params.levelId || 1;
  var charIndex = params.charIndex || 0;

  var chars = getCharsByLevel(levelId);
  if (chars.length === 0) { App.navigateTo('home'); return; }
  if (charIndex < 0) charIndex = 0;
  if (charIndex >= chars.length) {
    App.playSound('complete');
    var nl = levelId + 1;
    App.showDialog('🎉 太棒了！','🌟','第'+levelId+'关完成！', nl<=getTotalLevels()?'下一关':'回家',function(){
      App.navigateTo(nl<=getTotalLevels()?'learn/'+nl+'/0':'home');
    });
    return;
  }

  var charData = chars[charIndex];
  var progress = getCharProgress(charData.id);
  var currentStep = 0;

  if (!progress.learned) updateCharProgress(charData.id,'learned',true);

  buildPage();

  function buildPage(){
    var html='<div class="page active">';

    // 顶栏
    html+='<div class="top-bar">';
    html+='<button class="back-btn" onclick="App.navigateTo(\'home\')">←</button>';
    html+='<span class="title">'+charData.char+' · 第'+levelId+'关</span>';
    html+='<span class="progress-dot">'+(charIndex+1)+'/'+chars.length+'</span>';
    html+='</div>';

    // 步骤指示
    html+='<div class="step-indicator" id="step-bar">';
    var sn=['👀 认','🗣️ 读','✍️ 写','🎯 练'];
    for(var s=0;s<4;s++){
      var c='';if(s===currentStep)c=' active';else if(s<currentStep)c=' done';
      if(s>0)html+='<div class="step-line'+(s<=currentStep?' done':'')+'"></div>';
      html+='<div class="step-dot'+c+'" data-step="'+s+'">'+sn[s]+'</div>';
    }
    html+='</div>';

    // 内容区
    html+='<div class="step-content" id="step-box"></div>';

    html+='</div>';
    root.innerHTML=html;

    // 步骤点击
    document.querySelectorAll('#step-bar .step-dot').forEach(function(d){
      d.addEventListener('click',function(){
        var s=parseInt(this.dataset.step);
        if(s<=currentStep)switchTo(s);
      });
    });

    switchTo(currentStep);
  }

  function switchTo(step){
    currentStep=step;
    var box=document.getElementById('step-box');
    if(!box)return;

    // 更新指示器
    var dots=document.querySelectorAll('#step-bar .step-dot');
    var lines=document.querySelectorAll('#step-bar .step-line');
    dots.forEach(function(d,i){d.className='step-dot'+(i===step?' active':i<step?' done':'');});
    lines.forEach(function(l,i){l.className='step-line'+(i<step?' done':'');});

    // 渲染步骤
    box.innerHTML='';
    if(step===0)stepRen(box);
    else if(step===1)stepDu(box);
    else if(step===2)stepXie(box);
    else if(step===3)stepLian(box);
  }

  function nextStep(){
    if(currentStep<3){currentStep++;switchTo(currentStep);}
    else{
      updateCharProgress(charData.id,'stars',Math.max(progress.stars||0,1));
      var ni=charIndex+1;
      if(ni<chars.length){
        App.playSound('complete');App.showStarAnimation(3);
        App.showDialog('太棒了！🎉','⭐',charData.char+' 学完啦！','下一个字',function(){App.navigateTo('learn/'+levelId+'/'+ni);});
      }else{
        App.playSound('complete');App.showStarAnimation(3);
        App.showDialog('通关！🏆','🌟','第'+levelId+'关全部学完！','回到首页',function(){App.navigateTo('home');});
      }
    }
  }

  // ==== 步骤1：认 ====
  function stepRen(box){
    var wHtml='';
    charData.words.forEach(function(w){
      wHtml+='<div class="ren-word-row" onclick="ChineseTTS.speakWord(\''+w.word+'\')"><span>'+w.word+'</span><span class="rw-py">'+w.pinyin+'</span></div>';
    });

    var emojiH='';
    if(charData.emoji&&charData.emoji.length<=4){
      emojiH='<div class="ren-emoji">'+charData.emoji+'</div>';
    }else{
      var cl=['#FFD93D,#FF6B6B','#4ECDC4,#45B7D1','#A29BFE,#6C5CE7','#FD79A8,#E84393'];
      var c=cl[charData.id%cl.length];
      emojiH='<div class="illus-bubble" style="background:linear-gradient(135deg,'+c+')"><span class="bubble-char">'+charData.char+'</span></div>';
    }

    box.innerHTML=
    '<div class="ren-layout">'+
      '<div class="ren-left">'+emojiH+'<div class="ren-char-big">'+charData.char+'</div></div>'+
      '<div class="ren-right">'+
        '<div class="ren-pinyin">'+charData.pinyin+'</div>'+
        '<button class="speak-btn" onclick="ChineseTTS.speakChar(\''+charData.char+'\')" style="margin:0 auto">🔊 听发音</button>'+
        '<div class="ren-words-box"><h4>📝 组词（点击听发音）</h4>'+wHtml+'</div>'+
        '<div class="ren-sentence">'+charData.sentences[0]+'</div>'+
        '<button class="btn-cartoon" onclick="nextStep()" style="margin:0 auto">学会啦 → 去读</button>'+
      '</div>'+
    '</div>';

    setTimeout(function(){ChineseTTS.speakChar(charData.char);},400);
  }

  // ==== 步骤2：读 ====
  function stepDu(box){
    var count=0;
    var msgs=['真棒！再来一遍！👏','声音真响亮！📢','读得真好！💪'];

    box.innerHTML=
    '<div class="du-layout">'+
      '<div class="du-char">'+charData.char+'</div>'+
      '<div class="du-pinyin">'+charData.pinyin+'</div>'+
      '<button class="du-read-circle" id="du-btn">🔊</button>'+
      '<div class="du-hint">👆 点一下，跟着读</div>'+
      '<div class="du-encourage" id="du-msg"></div>'+
      '<button class="btn-cartoon orange" id="du-done" style="display:none" onclick="nextStep()">读完啦 → 去写</button>'+
    '</div>';

    document.getElementById('du-btn').addEventListener('click',function(){
      ChineseTTS.speakChar(charData.char);count++;
      if(count<3){document.getElementById('du-msg').textContent=msgs[count-1];}
      else{document.getElementById('du-msg').textContent='读得太好了！🎉';document.getElementById('du-done').style.display='inline-block';}
    });

    setTimeout(function(){ChineseTTS.speakChar(charData.char);},500);
  }

  // ==== 步骤3：写（田字格） ====
  function stepXie(box){
    box.innerHTML=
    '<div class="xie-layout">'+
      '<div class="xie-demo-side">'+
        '<div class="xie-demo-area" id="xie-demo"></div>'+
        '<div class="xie-btns"><button class="btn-cartoon small" id="xie-play">▶️ 播放</button><button class="btn-cartoon small orange" id="xie-reset">🔄 重来</button></div>'+
      '</div>'+
      '<div class="xie-trace-side">'+
        '<div class="tzgrid-wrap"><canvas class="tzgrid-canvas" id="tz-canvas" width="240" height="240"></canvas></div>'+
        '<div class="xie-btns"><button class="btn-cartoon small orange" id="xie-clr">🔄 清除</button><button class="btn-cartoon green small" id="xie-ok">✅ 写好了</button></div>'+
        '<div class="xie-msg" id="xie-msg"></div>'+
        '<button class="btn-cartoon orange" id="xie-next" style="display:none" onclick="nextStep()">去玩游戏 → 🎯</button>'+
      '</div>'+
    '</div>';

    // 笔画动画
    var w=null;
    try{
      w=HanziWriter.create('xie-demo',charData.char,{width:220,height:220,padding:5,strokeAnimationSpeed:1.5,delayBetweenStrokes:350,strokeColor:'#4A90D9',radicalColor:'#FF8C42',outlineColor:'#E0E0E0',showOutline:true,showCharacter:true});
    }catch(e){
      document.getElementById('xie-demo').innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:100px;font-weight:900;color:#DDD">'+charData.char+'</div>';
    }
    setTimeout(function(){if(w)w.animateCharacter();},400);

    document.getElementById('xie-play').addEventListener('click',function(){if(w)w.animateCharacter();});
    document.getElementById('xie-reset').addEventListener('click',function(){if(w){w.cancelAnimation();w.reset();}});

    // 田字格
    var cv=document.getElementById('tz-canvas');
    var ctx=cv.getContext('2d');
    drawTZG(ctx);

    function drawTZG(c){
      c.clearRect(0,0,240,240);
      c.fillStyle='#FFFEF9';c.fillRect(0,0,240,240);
      // 外框
      c.strokeStyle='#E74C3C';c.lineWidth=3;c.strokeRect(8,8,224,224);
      // 十字虚线
      c.setLineDash([4,4]);c.strokeStyle='#CCC';c.lineWidth=1.5;
      c.beginPath();c.moveTo(120,8);c.lineTo(120,232);c.stroke();
      c.beginPath();c.moveTo(8,120);c.lineTo(232,120);c.stroke();
      // 对角虚线
      c.setLineDash([3,5]);c.strokeStyle='#DDD';c.lineWidth=1;
      c.beginPath();c.moveTo(8,8);c.lineTo(232,232);c.stroke();
      c.beginPath();c.moveTo(232,8);c.lineTo(8,232);c.stroke();
      c.setLineDash([]);
      // 描红底字
      c.font='130px "PingFang SC","Heiti SC","STHeiti",sans-serif';c.textAlign='center';c.textBaseline='middle';
      c.fillStyle='rgba(0,0,0,0.06)';c.fillText(charData.char,120,120);
    }

    var drawing=false,hasDrawn=false;
    cv.onpointerdown=function(e){
      drawing=true;hasDrawn=true;
      var r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;
      ctx.beginPath();ctx.moveTo((e.clientX-r.left)*sx,(e.clientY-r.top)*sy);
      e.preventDefault();
    };
    cv.onpointermove=function(e){
      if(!drawing)return;
      var r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;
      ctx.lineTo((e.clientX-r.left)*sx,(e.clientY-r.top)*sy);
      ctx.strokeStyle='#4A90D9';ctx.lineWidth=12;ctx.lineCap='round';ctx.lineJoin='round';
      ctx.stroke();e.preventDefault();
    };
    cv.onpointerup=function(){drawing=false;if(hasDrawn)document.getElementById('xie-msg').textContent='写得真好！✍️';};

    document.getElementById('xie-clr').addEventListener('click',function(){drawTZG(ctx);document.getElementById('xie-msg').textContent='';hasDrawn=false;});
    document.getElementById('xie-ok').addEventListener('click',function(){
      updateCharProgress(charData.id,'written',true);
      document.getElementById('xie-msg').textContent='完成啦！🎉';
      document.getElementById('xie-next').style.display='inline-block';
      App.playSound('star');App.showStarAnimation(2);
    });
  }

  // ==== 步骤4：练（大炮打帆船） ====
  function stepLian(box){
    var score=0,rounds=0,maxRounds=5,targetChar=charData.char;

    function mkBoats(){
      var opts=[targetChar];
      var all=chars.filter(function(c){return c.char!==targetChar;});
      shuffleArray(all);
      for(var i=0;i<4&&i<all.length;i++)opts.push(all[i].char);
      opts=shuffleArray(opts);
      var bs=[];
      for(var j=0;j<opts.length;j++){
        bs.push({char:opts[j],isTarget:opts[j]===targetChar,top:4+Math.random()*40,left:2+j*20+Math.random()*6,animDelay:Math.random()*2.5,hit:false});
      }
      return bs;
    }
    var boats=mkBoats();

    function draw(){
      var h='<div class="lian-scene" id="lian-scene">';
      h+='<div class="sea-waves"></div>';
      boats.forEach(function(b,i){
        if(b.hit)return;
        h+='<div class="sailboat" id="b'+i+'" style="top:'+b.top+'%;left:'+b.left+'%;animation-delay:-'+b.animDelay+'s"><div class="boat-char">'+b.char+'</div><div class="sail"></div><div class="hull"></div></div>';
      });
      h+='<div class="cannon" id="cannon"><div class="barrel"></div><div class="base"></div><div class="wheel"></div></div>';
      h+='<div class="lian-prompt">🎯 开炮打中带"<span style="color:#FFD93D;font-size:18px">'+targetChar+'</span>"的帆船！</div>';
      h+='<div class="lian-score">🏆 <span id="ls">'+score+'</span>/'+maxRounds+'</div>';
      h+='</div>';
      box.innerHTML=h;

      boats.forEach(function(b,i){
        if(b.hit)return;
        var el=document.getElementById('b'+i);
        if(!el)return;
        el.addEventListener('click',function(){
          if(b.hit)return;b.hit=true;
          fire(b,el,i);
        });
      });
    }

    function fire(boat,el,idx){
      var cn=document.getElementById('cannon');
      var cr=cn?cn.getBoundingClientRect():{left:box.offsetWidth/2,top:box.offsetHeight*0.7};
      var br=el.getBoundingClientRect();
      var scene=document.getElementById('lian-scene');
      var sr=scene?scene.getBoundingClientRect():{left:0,top:0};

      var ball=document.createElement('div');ball.className='cannonball';
      ball.style.left=(cr.left+cr.width/2-sr.left)+'px';ball.style.top=(cr.top-sr.top)+'px';
      scene.appendChild(ball);

      setTimeout(function(){
        ball.style.transition='all 0.25s ease-in';
        ball.style.left=(br.left+br.width/2-sr.left)+'px';ball.style.top=(br.top+br.height/2-sr.top)+'px';
      },30);

      setTimeout(function(){
        if(ball.parentNode)ball.parentNode.removeChild(ball);

        var sp=document.createElement('div');sp.className='splash';
        sp.textContent=boat.isTarget?'💥':'💦';
        sp.style.left=(br.left+br.width/2-18-sr.left)+'px';sp.style.top=(br.top-sr.top)+'px';
        scene.appendChild(sp);
        setTimeout(function(){if(sp.parentNode)sp.parentNode.removeChild(sp);},600);

        if(boat.isTarget){
          score++;document.getElementById('ls').textContent=score;
          el.style.transform='rotate(90deg) translateY(20px)';el.style.opacity='0';
          App.playSound('correct');App.showStarAnimation(1);
          rounds++;
          if(rounds>=maxRounds)finish();
          else{setTimeout(function(){boats=mkBoats();draw();},700);}
        }else{
          el.style.animation='none';el.offsetHeight;el.style.animation='wrong-shake 0.4s ease-in-out';
          App.playSound('wrong');
          setTimeout(function(){el.style.animation='';boat.hit=false;},400);
        }
      },280);
    }

    function finish(){
      updateCharProgress(charData.id,'practiced',true);
      updateCharProgress(charData.id,'practiceScore',score);
      var stars=score>=5?3:score>=3?2:1;
      if(stars>(progress.stars||0))updateCharProgress(charData.id,'stars',stars);

      setTimeout(function(){
        App.playSound('complete');App.showStarAnimation(stars);
        App.showDialog('游戏结束！🎉',score>=5?'⭐⭐⭐':score>=3?'⭐⭐':'⭐','命中 '+score+'/'+maxRounds+' 次！','继续',nextStep);
      },400);
    }

    draw();
  }
}

function shuffleArray(a){var r=a.slice();for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=r[i];r[i]=r[j];r[j]=t;}return r;}
