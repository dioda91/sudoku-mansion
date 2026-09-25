// mobile-ui-v2.js —— 手机布局：左下角气泡按钮、横屏锁定（?safe=1 时不启用）
// 说明：庄园视图的平移/缩放交给游戏自己处理（单指拖 = 平移，点击 = 选中），
// 这里不再合成任何手势事件，只负责界面按钮。
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('dsh-mobile')) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function goLandscape() {
    // 已经装在主屏幕上（standalone）时不需要全屏，直接锁方向即可
    var standalone = false;
    try { standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) {}
    var p = standalone ? Promise.resolve() : (root.requestFullscreen ? root.requestFullscreen() : Promise.reject(new Error('no fullscreen')));
    return Promise.resolve(p).then(function () {
      if (screen.orientation && typeof screen.orientation.lock === 'function') return screen.orientation.lock('landscape');
    }).catch(function () {});
  }

  // 把右侧原生标签页切到「背景故事」
  function selectLoreTab() {
    try {
      var bar = document.querySelector('app-right-panel > .tab-bar');
      if (!bar) return;
      var btns = bar.querySelectorAll('button');
      var hit = null;
      for (var i = 0; i < btns.length; i++) {
        var t = (btns[i].textContent || '') + ' ' + (btns[i].getAttribute('aria-label') || '') + ' ' + (btns[i].title || '');
        if (t.indexOf('背景故事') >= 0 || /lore/i.test(t)) { hit = btns[i]; break; }
      }
      if (hit) {
        window.__dshIgnoreClick = true;
        // 不要冒泡到 document，否则会被外层「点空白关闭」立刻关掉
        hit.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true, view: window }));
      }
    } catch (e) {}
  }

  // 庄园视图的「回正」：等价于按回车键（游戏里的居中/跟随选中）
  function recenter() {
    try {
      var target = document.querySelector('.canvas-wrap') || document.querySelector('app-mansion') || document.activeElement || document.body;
      ['keydown', 'keyup'].forEach(function (type) {
        target.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
      });
    } catch (e) {}
  }

  function boot() {
    if (document.getElementById('dsh-buttons')) return;
    var bar = el('div'); bar.id = 'dsh-buttons';
    var bRules, bStory, bCenter;

    function sync() {
      if (bRules) bRules.classList.toggle('dsh-on', document.body.classList.contains('dsh-left'));
      if (bStory) bStory.classList.toggle('dsh-on', document.body.classList.contains('dsh-info'));
    }

    function mk(label, cls, onClick) {
      var b = el('button', '', label);
      b.type = 'button';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (cls) {
          var on = !document.body.classList.contains(cls);
          document.body.classList.remove('dsh-left', 'dsh-info');
          if (on) document.body.classList.add(cls);
          sync();
          if (on && onClick) onClick();
        } else if (onClick) onClick();
      });
      bar.appendChild(b);
      return b;
    }

    bCenter = mk('回正', null, recenter);
    bCenter.style.display = 'none';
    setInterval(function () {
      bCenter.style.display = document.querySelector('app-mansion') ? '' : 'none';
    }, 700);

    bRules = mk('规则', 'dsh-left');
    bStory = mk('故事', 'dsh-info', selectLoreTab);
    mk('横屏', null, goLandscape);
    document.body.appendChild(bar);

    document.addEventListener('click', function (e) {
      if (window.__dshIgnoreClick) { window.__dshIgnoreClick = false; return; }
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#dsh-buttons')) return;
      if (t.closest('app-left-column')) return;
      if (t.closest('app-right-panel > .tab-content')) return;
      if (t.closest('app-right-panel > .tab-bar')) return;
      if (!document.body.classList.contains('dsh-left') && !document.body.classList.contains('dsh-info')) return;
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