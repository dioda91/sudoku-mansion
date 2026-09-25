// mobile-ui.js —— 手机布局：气泡按钮、横屏锁定（?safe=1 时不启用）
(function () {
  'use strict';
  if (!document.documentElement.classList.contains('dsh-mobile')) return;

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
      if (screen.orientation && typeof screen.orientation.lock === 'function') return screen.orientation.lock('landscape');
    }).catch(function () {});
  }

  function boot() {
    if (document.getElementById('dsh-buttons')) return;
    var bar = el('div'); bar.id = 'dsh-buttons';
    var sync = function () {
      bRules.classList.toggle('dsh-on', document.body.classList.contains('dsh-left'));
      bInfo.classList.toggle('dsh-on', document.body.classList.contains('dsh-info'));
    };
    function mk(label, bodyClass, onClick) {
      var b = el('button', '', label);
      b.type = 'button';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (bodyClass) {
          var on = !document.body.classList.contains(bodyClass);
          document.body.classList.remove('dsh-left', 'dsh-info');
          if (on) document.body.classList.add(bodyClass);
          sync();
        }
        if (onClick) onClick();
      });
      bar.appendChild(b);
      return b;
    }
    var bRules = mk('规则', 'dsh-left');
    var bInfo = mk('故事', 'dsh-info');
    mk('横屏', null, goLandscape);
    document.body.appendChild(bar);

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#dsh-buttons') || t.closest('app-left-column')) return;
      if (t.closest('app-right-panel > *:has(.tab-bar)')) return;
      document.body.classList.remove('dsh-left', 'dsh-info');
      sync();
    }, true);

    var rot = el('div'); rot.id = 'dsh-rotate';
    var box = el('div', 'box');
    box.appendChild(el('p', '', '请把手机横过来'));
    var btn = el('button', '', '全屏并锁定横屏');
    btn.addEventListener('click', function (e) { e.stopPropagation(); goLandscape(); });
    box.appendChild(btn); rot.appendChild(box); document.body.appendChild(rot);

    window.addEventListener('touchstart', function once() {
      window.removeEventListener('touchstart', once, true);
      if (window.matchMedia('(orientation: portrait)').matches) goLandscape();
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();