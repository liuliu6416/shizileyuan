/**
 * 识字乐园 - 首页（刘小爱风格：探险地图主题）
 */

var LEVEL_THEMES = [
  { icon: '🌱', name: '萌芽森林', color: '#5CB85C', desc: '走进数字的世界' },
  { icon: '🏔️', name: '象形山谷', color: '#4A90D9', desc: '画出万物的样子' },
  { icon: '🌈', name: '自然乐园', color: '#FF8C42', desc: '蓝天白云花草' },
  { icon: '🐾', name: '动物王国', color: '#E880A0', desc: '认识可爱的小伙伴' },
  { icon: '🏠', name: '温暖家园', color: '#FF6B6B', desc: '家人和朋友们' },
  { icon: '🎪', name: '活动广场', color: '#8B5CF6', desc: '跑一跑跳一跳' },
  { icon: '🎒', name: '百宝箱', color: '#F59E0B', desc: '身边的物品' },
  { icon: '🏫', name: '快乐学堂', color: '#06B6D4', desc: '校园里的字' },
  { icon: '🎨', name: '彩色世界', color: '#EC4899', desc: '四季与颜色' },
  { icon: '🏆', name: '挑战山峰', color: '#6366F1', desc: '成为识字大王' }
];

function renderHome(root, params) {
  var totalProgress = getTotalProgress();
  var totalStars = AppState.stats.totalStars;
  var charsMastered = AppState.stats.charsMastered;
  var totalChars = getTotalChars();

  var html = '';

  // 背景装饰云朵（刘小爱风格标志）
  html += '<div class="cloud-decor">☁️</div>';
  html += '<div class="cloud-decor">☁️</div>';
  html += '<div class="cloud-decor">☁️</div>';

  html += '<div class="page active">';

  // 头部：蓝天白云 + 探险主题
  html += '<div class="home-header">';
  html += '<div class="mascot">🧭</div>';
  html += '<h1 class="app-title">识字大冒险</h1>';
  html += '<p class="app-subtitle">和汉字一起去旅行 ✨</p>';
  html += '</div>';

  // 进度总览 - 藏宝图风格
  html += '<div class="progress-section">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
  html += '<span style="font-size:28px">🗺️</span>';
  html += '<div style="flex:1">';
  html += '<div class="progress-label">';
  html += '<span style="font-weight:700">探索进度</span>';
  html += '<span><strong>' + charsMastered + '</strong> / ' + totalChars + ' 字</span>';
  html += '</div>';
  html += '<div class="progress-bar">';
  html += '<div class="progress-bar-fill" style="width:' + totalProgress + '%"></div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div style="display:flex;justify-content:space-around;text-align:center;font-size:13px;color:var(--color-text-light)">';
  html += '<div>⭐<br><strong style="font-size:20px;color:var(--color-orange)">' + totalStars + '</strong></div>';
  html += '<div>🔓<br><strong style="font-size:20px;color:var(--color-sky)">' + getTotalLevels() + '</strong></div>';
  html += '<div>🏅<br><strong style="font-size:20px;color:var(--color-green)">' + AppState.achievements.length + '</strong></div>';
  html += '</div>';
  html += '</div>';

  // 关卡地图 - 每个关卡像一个目的地
  html += '<div style="font-size:15px;font-weight:700;color:var(--color-text);margin:10px 0 6px">📍 选择目的地：</div>';

  html += '<div class="level-grid">';

  for (var lv = 1; lv <= getTotalLevels(); lv++) {
    var theme = LEVEL_THEMES[lv - 1];
    var stars = getLevelStars(lv);
    var chars = getCharsByLevel(lv);
    var maxStars = chars.length * 3;

    html += '<div class="level-card unlocked" data-level="' + lv + '" style="border-left:4px solid ' + theme.color + '">';
    html += '<div class="level-icon">' + theme.icon + '</div>';
    html += '<div class="level-name">第' + lv + '站</div>';
    html += '<div class="level-theme">' + theme.name + '</div>';
    html += '<div style="font-size:11px;color:var(--color-text-light);margin-top:2px">' + theme.desc + '</div>';

    // 星星
    var starCount = Math.floor(stars / Math.max(chars.length, 1));
    html += '<div class="level-stars">';
    for (var s = 0; s < 3; s++) {
      html += s < starCount ? '⭐' : '☆';
    }
    html += '</div>';

    html += '<div class="level-count">' + chars.length + '个字</div>';
    html += '</div>';
  }

  html += '</div>';

  // 底部导航
  html += '<div class="bottom-nav">';
  html += '<button class="nav-item active" onclick="App.navigateTo(\'home\')"><span class="nav-icon">🧭</span>探险</button>';
  html += '<button class="nav-item" onclick="App.navigateTo(\'learn/' + AppState.unlockedLevel + '/0\')"><span class="nav-icon">📖</span>学字</button>';
  html += '<button class="nav-item" onclick="App.navigateTo(\'review\')"><span class="nav-icon">🏆</span>宝藏</button>';
  html += '</div>';

  html += '</div>';

  root.innerHTML = html;

  // 绑定点击（全部开放）
  var cards = root.querySelectorAll('.level-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var level = parseInt(this.dataset.level);
      App.playSound('tap');
      App.navigateTo('learn/' + level + '/0');
    });
  });
}
