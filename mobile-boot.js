// mobile-boot.js —— 手机上的默认设置 + 布局开关
// 加 ?safe=1 可以完全关掉手机适配，回到桌面布局（出问题时用）
(function () {
  try {
    var safe = /(^|[?&])safe=1(&|$)/.test(location.search);
    var w = window.innerWidth, h = window.innerHeight;
    var minSide = Math.min(w, h);
    var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var small = minSide <= 660 || w <= 1200 || (touch && Math.min(screen.width, screen.height) <= 900);
    if (safe || !small) return;
    document.documentElement.classList.add('dsh-mobile');

    var DEV_KEY = 'sudoku-mansion-device-settings';
    var SAVE_KEY = 'sudoku-mansion-save';

    // 关掉游戏自带的「小型设备模式」：它会把数字键盘塞进右栏标签页，
    // 我们要键盘单独占满右栏，只有关掉它右栏才会渲染独立的键盘。
    var dev = {};
    try { dev = JSON.parse(localStorage.getItem(DEV_KEY) || '{}') || {}; } catch (e) { dev = {}; }
    dev.keypadStacked = false;
    if (dev.captureMouse === undefined) dev.captureMouse = false;
    localStorage.setItem(DEV_KEY, JSON.stringify(dev));

    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      var save = null;
      try { save = JSON.parse(raw); } catch (e) { save = null; }
      if (save && typeof save === 'object') {
        if (!save.playerPreferences || typeof save.playerPreferences !== 'object') save.playerPreferences = {};
        if (save.playerPreferences.keypadStacked !== false) {
          save.playerPreferences.keypadStacked = false;
          localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        }
      }
    }
  } catch (e) { /* 出错不影响游戏 */ }
})();