// mobile-ui.js —— 手机布局：气泡按钮、横屏锁定
(function () {
  'use strict';
  var mq = window.matchMedia('(max-width: 1200px), (max-height: 660px)');
  var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var minSide = Math.min(window.innerWidth, window.innerHeight);
  var small = mq.matches || (touch && minSide <= 700) || minSide <= 660;
  if (!small) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function goLandscape() {
    var root = document.documentElement;
    var p = root.requestFullscreen ? root.requestFullscreen() : Promise.reject(new Error('no fullscreen'));
    return Promise.resolve(p).then(function () {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        return screen.orientation.lock('landscape');
      }
    }).catch(function () { /* 浏览器不支持就只靠系统自动旋转 */ });
  }

  function boot() {
    if (document.getElementById('dsh-buttons')) return;

    var bar = el('div'); bar.id = 'dsh-buttons';
    function mk(label, bodyClass, onClick) {
      var b = el('button', '', label);
      b.type = 'button';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (bodyClass) {
          var on = !document.body.classList.contains(bodyClass);
          document.body.classList.remove('dsh-left', 'dsh-info');
          if (on) document.body.classList.add(bodyClass);
          b.classList.toggle('dsh-on', on);
          sync();
        }
        if (onClick) onClick();
      });
      bar.appendChild(b);
      return b;
    }

    var bRules = mk('规则', 'dsh-left');
    var bInfo = mk('故事', 'dsh-info');
    var bRot = mk('横屏', null, function () { goLandscape(); });
    document.body.appendChild(bar);

    function sync() {
      bRules.classList.toggle('dsh-on', document.body.classList.contains('dsh-left'));
      bInfo.classList.toggle('dsh-on', document.body.classList.contains('dsh-info'));
    }

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#dsh-buttons')) return;
      if (t.closest('app-left-column')) return;
      if (t.closest('app-right-panel > *:has(.tab-bar)')) return;
      document.body.classList.remove('dsh-left', 'dsh-info');
      sync();
    }, true);

    var rot = el('div'); rot.id = 'dsh-rotate';
    var box = el('div', 'box');
    var p = el('p', '', '请把手机横过来');
    var btn = el('button', '', '全屏并锁定横屏');
    btn.addEventListener('click', function (e) { e.stopPropagation(); goLandscape(); });
    box.appendChild(p); box.appendChild(btn); rot.appendChild(box);
    document.body.appendChild(rot);

    window.addEventListener('touchstart', function once() {
      window.removeEventListener('touchstart', once, true);
      if (window.matchMedia('(orientation: portrait)').matches) goLandscape();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();