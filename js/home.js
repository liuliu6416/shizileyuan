/**
 * 识字乐园 - 首页
 * 关卡选择 + 进度总览
 */

var LEVEL_ICONS = ['🌱', '🌿', '🌳', '🌸', '🍎', '🏠', '🚗', '📚', '🌈', '🏆'];
var LEVEL_NAMES = [
  '启蒙入门', '象形识字', '自然天地', '动物世界',
  '家人朋友', '动作行为', '日常物品', '学校生活',
  '四季颜色', '进阶达人'
];

function renderHome(root, params) {
  var totalProgress = getTotalProgress();
  var totalStars = AppState.stats.totalStars;
  var charsMastered = AppState.stats.charsMastered;

  var html = '';

  // 页面容器
  html += '<div class="page active">';

  // 头部
  html += '<div class="home-header">';
  html += '<div class="mascot">🐲</div>';
  html += '<h1 class="app-title">识字乐园</h1>';
  html += '<p class="app-subtitle">快乐学汉字，一天一个字</p>';
  html += '</div>';

  // 进度总览
  html += '<div class="progress-section">';
  html += '<div class="progress-label">';
  html += '<span>📖 学习进度</span>';
  html += '<span><strong>' + charsMastered + '</strong> / ' + getTotalChars() + ' 字</span>';
  html += '</div>';
  html += '<div class="progress-bar">';
  html += '<div class="progress-bar-fill" style="width:' + totalProgress + '%"></div>';
  html += '</div>';
  html += '<div style="display:flex;justify-content:space-around;margin-top:10px;font-size:13px;color:var(--color-text-light)">';
  html += '<span>⭐ ' + totalStars + ' 颗星</span>';
  html += '<span>🔓 ' + AppState.unlockedLevel + '/' + getTotalLevels() + ' 关</span>';
  html += '</div>';
  html += '</div>';

  // 关卡网格
  html += '<div class="level-grid">';

  for (var lv = 1; lv <= getTotalLevels(); lv++) {
    var unlocked = isLevelUnlocked(lv);
    var isCurrent = (lv === AppState.unlockedLevel);
    var progress = getLevelProgress(lv);
    var stars = getLevelStars(lv);
    var maxStars = getLevelMaxStars(lv);
    var chars = getCharsByLevel(lv);

    html += '<div class="level-card';
    if (isCurrent) html += ' current';
    else html += ' unlocked';
    html += '" data-level="' + lv + '">';

    html += '<div class="level-icon">' + LEVEL_ICONS[lv - 1] + '</div>';
    html += '<div class="level-name">第' + lv + '关</div>';
    html += '<div style="font-size:12px;color:var(--color-text-light)">' + LEVEL_NAMES[lv - 1] + '</div>';

    // 星星（全部开放）
    html += '<div class="level-stars" style="margin-top:6px">';
    for (var s = 0; s < 3; s++) {
      html += (s < Math.floor(stars / Math.max(chars.length, 1))) ? '⭐' : '☆';
    }
    html += '</div>';

    html += '<div class="level-count">' + chars.length + '个字</div>';
    html += '</div>';
  }

  html += '</div>';

  // 底部导航
  html += '<div class="bottom-nav">';
  html += '<button class="nav-item active" onclick="App.navigateTo(\'home\')"><span class="nav-icon">🏠</span>首页</button>';
  html += '<button class="nav-item" onclick="App.navigateTo(\'learn/' + AppState.unlockedLevel + '/0\')"><span class="nav-icon">🔍</span>认字</button>';
  html += '<button class="nav-item" onclick="App.navigateTo(\'review\')"><span class="nav-icon">🏆</span>复习</button>';
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // 绑定关卡卡片点击（全部开放，无锁）
  var cards = root.querySelectorAll('.level-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var level = parseInt(this.dataset.level);
      App.playSound('tap');
      App.navigateTo('learn/' + level + '/0');
    });
  });
}
