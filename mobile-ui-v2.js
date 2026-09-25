// mobile-ui.js —— 手机布局：左下角气泡按钮、横屏锁定（?safe=1 时不启用）
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
    var p = root.requestFullscreen ? root.requestFullscreen() : Promise.reject(new Error('no fullscreen'));
    return Promise.resolve(p).then(function () {
      if (screen.orientation && typeof screen.orientation.lock === 'function') return screen.orientation.lock('landscape');
    }).catch(function () {});
  }

  // 把右侧原生标签页切到「背景故事」。标签条虽然在手机模式下被隐藏，但点击依然有效。
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
        // bubbles:false：不要让它冒泡到 document，否则会被外面那层「点空白关闭」立刻关掉
        hit.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true, view: window }));
      }
    } catch (e) {}
  }

  function boot() {
    if (document.getElementById('dsh-buttons')) return;
    var bar = el('div'); bar.id = 'dsh-buttons';
    var bRules, bStory;
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
          if (on) { document.body.classList.add(cls); }
          sync();
          if (on && onClick) onClick();
        } else if (onClick) onClick();
      });
      bar.appendChild(b);
      return b;
    }
    // 「回正」：庄园/房间视图拖过之后把视角复位（等价于按回车键，游戏里的居中快捷键）
    var bCenter = el('button', '', '回正');
    bCenter.type = 'button';
    bCenter.style.display = 'none';
    bCenter.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      try {
        var target = document.querySelector('.canvas-wrap') || document.querySelector('app-mansion') || document.activeElement || document.body;
        ['keydown', 'keyup'].forEach(function (type) {
          var ev = new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true });
          target.dispatchEvent(ev);
        });
      } catch (err) {}
    });
    bar.appendChild(bCenter);
    setInterval(function () {
      bCenter.style.display = document.querySelector('app-mansion') ? '' : 'none';
    }, 700);

    bRules = mk('规则', 'dsh-left');
    bStory = mk('故事', 'dsh-info', selectLoreTab);
    mk('横屏', null, goLandscape);
    document.body.appendChild(bar);

    // 点空白处关闭气泡；点气泡内部或按钮不关
    document.addEventListener('click', function (e) {
      // 自己程序化点标签页会冒泡到这里，别把自己刚打开的气泡关掉
      if (window.__dshIgnoreClick) { window.__dshIgnoreClick = false; return; }
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#dsh-buttons')) return;
      if (t.closest('app-right-panel > .tab-bar')) return;
      if (t.closest('app-left-column')) return;
      if (t.closest('app-right-panel > .tab-content')) return;
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