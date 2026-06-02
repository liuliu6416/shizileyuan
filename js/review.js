/**
 * 识字乐园 - 复习页
 * 已学汉字总览 + 成就徽章
 */

var ACHIEVEMENTS_DB = [
  { id: 'first_char', icon: '🌟', name: '初识汉字', desc: '学会第一个汉字' },
  { id: 'ten_chars', icon: '📚', name: '小小学者', desc: '学会10个汉字' },
  { id: 'fifty_chars', icon: '🎓', name: '识字达人', desc: '学会50个汉字' },
  { id: 'hundred_chars', icon: '👑', name: '识字大王', desc: '学会全部100个汉字' },
  { id: 'star_collector', icon: '💫', name: '星星收集者', desc: '收集30颗星星' }
];

function renderReview(root, params) {
  var totalStars = AppState.stats.totalStars;
  var charsMastered = AppState.stats.charsMastered;
  var totalChars = getTotalChars();
  var totalProgress = getTotalProgress();

  var html = '';

  html += '<div class="page active">';

  // 顶部栏
  html += '<div class="top-bar">';
  html += '<button class="back-btn" onclick="App.navigateTo(\'home\')">←</button>';
  html += '<span class="title">复习总览</span>';
  html += '<span></span>';
  html += '</div>';

  // 统计数据
  html += '<div class="review-stats">';
  html += '<div class="stat-card">';
  html += '<div class="stat-number">' + totalStars + '</div>';
  html += '<div class="stat-label">⭐ 星星</div>';
  html += '</div>';
  html += '<div class="stat-card">';
  html += '<div class="stat-number">' + charsMastered + '</div>';
  html += '<div class="stat-label">📖 已学会</div>';
  html += '</div>';
  html += '<div class="stat-card">';
  html += '<div class="stat-number">' + totalProgress + '%</div>';
  html += '<div class="stat-label">📊 进度</div>';
  html += '</div>';
  html += '</div>';

  // 进度条
  html += '<div class="progress-section">';
  html += '<div class="progress-label">';
  html += '<span>总进度</span>';
  html += '<span>' + charsMastered + '/' + totalChars + ' 字</span>';
  html += '</div>';
  html += '<div class="progress-bar">';
  html += '<div class="progress-bar-fill" style="width:' + totalProgress + '%"></div>';
  html += '</div>';
  html += '</div>';

  // 已学会的汉字网格
  html += '<div class="card">';
  html += '<h4 style="font-family:var(--font-cartoon);margin-bottom:12px">📝 已学会的字（' + charsMastered + '个）</h4>';
  html += '<div class="char-grid" id="char-grid">';

  var hasAnyMastered = false;
  CHARACTER_DB.forEach(function(c) {
    var p = getCharProgress(c.id);
    var mastered = p.learned && p.practiced && p.written;
    if (mastered) hasAnyMastered = true;

    var cssClass = 'char-chip ';
    if (mastered) {
      cssClass += 'mastered';
    } else if (p.learned || p.practiced || p.written) {
      cssClass += 'learning';
    } else {
      cssClass += 'locked';
    }

    html += '<div class="' + cssClass + '" data-id="' + c.id + '" title="' + c.char + ' (' + c.pinyin + ')"';
    if (!mastered && !p.learned && !p.practiced && !p.written) {
      html += ' style="pointer-events:none"';
    }
    html += '>' + c.char + '</div>';
  });

  if (!hasAnyMastered) {
    html += '<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--color-text-light)">';
    html += '还没有学会的字哦～<br>快去认字学习吧！🔍';
    html += '</div>';
  }

  html += '</div>';
  html += '</div>';

  // 成就徽章
  html += '<div class="card">';
  html += '<h4 style="font-family:var(--font-cartoon);margin-bottom:12px">🏅 成就徽章</h4>';
  html += '<div class="achievements">';

  ACHIEVEMENTS_DB.forEach(function(ach) {
    var earned = AppState.achievements.indexOf(ach.id) !== -1;
    html += '<div class="badge ' + (earned ? 'earned' : 'locked') + '">';
    html += '<div class="badge-icon">' + ach.icon + '</div>';
    html += '<div class="badge-name">' + ach.name + '</div>';
    if (!earned) {
      html += '<div style="font-size:10px;color:var(--color-locked)">🔒</div>';
    }
    html += '</div>';
  });

  html += '</div>';
  html += '</div>';

  // 底部导航
  html += '<div class="bottom-nav">';
  html += '<button class="nav-item" onclick="App.navigateTo(\'home\')"><span class="nav-icon">🏠</span>首页</button>';
  html += '<button class="nav-item" onclick="App.navigateTo(\'learn/' + AppState.unlockedLevel + '/0\')"><span class="nav-icon">🔍</span>认字</button>';
  html += '<button class="nav-item active" onclick="App.navigateTo(\'review\')"><span class="nav-icon">🏆</span>复习</button>';
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // 点击汉字跳转到学习页
  var chips = root.querySelectorAll('.char-chip.mastered, .char-chip.learning');
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      var id = parseInt(this.dataset.id);
      var charData = getCharById(id);
      if (charData) {
        App.playSound('tap');
        // 找到该字的关卡和索引
        var level = charData.level;
        var chars = getCharsByLevel(level);
        var idx = 0;
        for (var i = 0; i < chars.length; i++) {
          if (chars[i].id === id) {
            idx = i;
            break;
          }
        }
        App.navigateTo('learn/' + level + '/' + idx);
      }
    });
  });
}
