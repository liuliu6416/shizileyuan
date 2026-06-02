/**
 * 识字乐园 - 数据存储模块
 * 使用 localStorage 持久化学习进度和设置
 */

const STORAGE_KEY = 'shizileyuan';

// 默认应用状态
const DEFAULT_STATE = {
  progress: {},           // { charId: { learned, practiced, written, stars, practiceScore, lastSeen } }
  unlockedLevel: 1,       // 已解锁的最高关卡
  settings: {
    ttsRate: 0.9,
    ttsEnabled: true,
    strictWriting: false,
    soundEffects: true
  },
  achievements: [],       // 已获得的成就ID列表
  stats: {
    totalStars: 0,
    charsMastered: 0,
    sessionsCount: 0
  }
};

// 当前应用状态（内存中）
var AppState = null;

/**
 * 从localStorage加载状态
 */
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      AppState = JSON.parse(raw);
      // 兼容旧版本数据结构
      if (!AppState.settings) AppState.settings = DEFAULT_STATE.settings;
      if (!AppState.achievements) AppState.achievements = [];
      if (!AppState.stats) AppState.stats = DEFAULT_STATE.stats;
      if (!AppState.unlockedLevel) AppState.unlockedLevel = 1;
    } else {
      AppState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } catch (e) {
    console.warn('加载存储数据失败，使用默认状态', e);
    AppState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return AppState;
}

/**
 * 保存状态到localStorage
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
  } catch (e) {
    console.warn('保存数据失败（可能是存储空间不足）', e);
  }
}

/**
 * 获取某个汉字的进度
 */
function getCharProgress(charId) {
  if (!AppState.progress[charId]) {
    AppState.progress[charId] = {
      learned: false,
      practiced: false,
      written: false,
      stars: 0,
      practiceScore: 0,
      lastSeen: null
    };
  }
  return AppState.progress[charId];
}

/**
 * 更新某个汉字的进度
 */
function updateCharProgress(charId, field, value) {
  var progress = getCharProgress(charId);
  progress[field] = value;
  progress.lastSeen = new Date().toISOString();

  // 如果三个环节都完成了，更新掌握数
  if (progress.learned && progress.practiced && progress.written) {
    recalcStats();
  }

  // 检查是否可以解锁下一关
  checkLevelUnlock();

  saveState();
}

/**
 * 检查并解锁关卡
 */
function checkLevelUnlock() {
  var currentLevel = AppState.unlockedLevel;
  // 检查当前关卡的完成进度
  var chars = getCharsByLevel(currentLevel);
  var allDone = chars.every(function(c) {
    var p = getCharProgress(c.id);
    return p.learned && p.practiced && p.written;
  });

  if (allDone && currentLevel < getTotalLevels()) {
    AppState.unlockedLevel = currentLevel + 1;
  }
}

/**
 * 重新计算统计数据
 */
function recalcStats() {
  var totalStars = 0;
  var charsMastered = 0;

  CHARACTER_DB.forEach(function(c) {
    var p = getCharProgress(c.id);
    totalStars += (p.stars || 0);
    if (p.learned && p.practiced && p.written) {
      charsMastered++;
    }
  });

  AppState.stats.totalStars = totalStars;
  AppState.stats.charsMastered = charsMastered;

  // 检查成就
  checkAchievements();
}

/**
 * 成就检查
 */
function checkAchievements() {
  var achievements = AppState.achievements;

  // 成就：初识汉字（学会1个字）
  addAchievement('first_char', '初识汉字', '学会第一个汉字');

  // 成就：小小学者（学会10个字）
  if (AppState.stats.charsMastered >= 10) {
    addAchievement('ten_chars', '小小学者', '学会10个汉字');
  }

  // 成就：识字达人（学会50个字）
  if (AppState.stats.charsMastered >= 50) {
    addAchievement('fifty_chars', '识字达人', '学会50个汉字');
  }

  // 成就：星星收集者
  if (AppState.stats.totalStars >= 30) {
    addAchievement('star_collector', '星星收集者', '收集30颗星星');
  }

  // 成就：百分百（学会100个字）
  if (AppState.stats.charsMastered >= 100) {
    addAchievement('hundred_chars', '识字大王', '学会全部100个汉字');
  }
}

function addAchievement(id, name, desc) {
  if (AppState.achievements.indexOf(id) === -1) {
    AppState.achievements.push(id);
  }
}

/**
 * 是否已解锁某关卡
 */
function isLevelUnlocked(level) {
  return level <= AppState.unlockedLevel;
}

/**
 * 获取关卡完成度（百分比）
 */
function getLevelProgress(level) {
  var chars = getCharsByLevel(level);
  if (chars.length === 0) return 0;
  var done = chars.filter(function(c) {
    var p = getCharProgress(c.id);
    return p.learned && p.practiced && p.written;
  }).length;
  return Math.round((done / chars.length) * 100);
}

/**
 * 获取关卡星星数
 */
function getLevelStars(level) {
  var chars = getCharsByLevel(level);
  var total = 0;
  chars.forEach(function(c) {
    total += getCharProgress(c.id).stars || 0;
  });
  return total;
}

/**
 * 获取关卡最大星星数
 */
function getLevelMaxStars(level) {
  return getCharsByLevel(level).length * 3;
}

/**
 * 获取总体进度百分比
 */
function getTotalProgress() {
  return Math.round((AppState.stats.charsMastered / getTotalChars()) * 100);
}

/**
 * 更新设置
 */
function updateSetting(key, value) {
  AppState.settings[key] = value;
  saveState();
}

/**
 * 获取设置
 */
function getSetting(key) {
  return AppState.settings[key];
}

/**
 * 增加学习会话次数
 */
function incrementSessions() {
  AppState.stats.sessionsCount++;
  saveState();
}

// 页面加载时自动加载状态
loadState();
