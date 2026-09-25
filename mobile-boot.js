// mobile-boot.js  ——  手机上的默认设置（只在窄屏/触屏上生效，且只填没设置过的项）
(function () {
  try {
    var w = window.innerWidth, h = window.innerHeight;
    var minSide = Math.min(w, h);
    var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var small = minSide <= 620 || w <= 1100 || (touch && Math.min(screen.width, screen.height) <= 900);
    if (!small) return;

    var DEV_KEY = 'sudoku-mansion-device-settings';
    var SAVE_KEY = 'sudoku-mansion-save';

    var dev = {};
    try { dev = JSON.parse(localStorage.getItem(DEV_KEY) || '{}') || {}; } catch (e) { dev = {}; }
    var devChanged = false;
    if (dev.keypadStacked === undefined) { dev.keypadStacked = true; devChanged = true; }
    if (dev.aspectRatio === undefined) { dev.aspectRatio = 'auto'; devChanged = true; }
    if (dev.captureMouse === undefined) { dev.captureMouse = false; devChanged = true; }
    if (dev.fullscreen === undefined) { dev.fullscreen = false; devChanged = true; }
    if (devChanged) localStorage.setItem(DEV_KEY, JSON.stringify(dev));

    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      var save = null;
      try { save = JSON.parse(raw); } catch (e) { save = null; }
      if (save && typeof save === 'object') {
        if (!save.playerPreferences || typeof save.playerPreferences !== 'object') save.playerPreferences = {};
        if (save.playerPreferences.keypadStacked === undefined) {
          save.playerPreferences.keypadStacked = true;
          localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        }
      }
    }

    if (minSide <= 620) {
      var m = document.querySelector('meta[name="viewport"]');
      if (m) m.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    }
  } catch (e) { /* 出错不影响游戏 */ }
})();