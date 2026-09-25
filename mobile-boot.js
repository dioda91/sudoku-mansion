// mobile-boot.js  ——  手机上的默认设置（只在窄屏/触屏生效）
(function () {
  try {
    var w = window.innerWidth, h = window.innerHeight;
    var minSide = Math.min(w, h);
    var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var small = minSide <= 660 || w <= 1200 || (touch && Math.min(screen.width, screen.height) <= 900);
    if (!small) return;
    document.documentElement.classList.add('dsh-mobile');

    var DEV_KEY = 'sudoku-mansion-device-settings';
    var SAVE_KEY = 'sudoku-mansion-save';

    // 关键：关掉游戏自带的「小型设备模式」。
    // 原因是它会把数字键盘塞进右栏的标签页里，我们要的是键盘单独占满右栏，
    // 只有关掉它，右栏才会渲染出独立的 app-digit-pad。
    var dev = {};
    try { dev = JSON.parse(localStorage.getItem(DEV_KEY) || '{}') || {}; } catch (e) { dev = {}; }
    dev.keypadStacked = false;
    if (dev.aspectRatio === undefined) dev.aspectRatio = 'auto';
    if (dev.captureMouse === undefined) dev.captureMouse = false;
    if (dev.fullscreen === undefined) dev.fullscreen = false;
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