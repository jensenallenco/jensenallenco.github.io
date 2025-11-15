(function(){
  const NAV_PARTIAL_PATH = './features/nav/nav.html';
  const NAV_SCRIPT_PATH = './features/nav/nav.js';

  async function injectNav() {
    try {
      let container = document.getElementById('site-nav');
      if (!container) {
        container = document.createElement('div');
        container.id = 'site-nav';

        const body = document.body || document.getElementsByTagName('body')[0];
        if (body.firstChild) body.insertBefore(container, body.firstChild); else body.appendChild(container);
      }
      const res = await fetch(NAV_PARTIAL_PATH, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to fetch nav partial');
      const html = await res.text();
      container.innerHTML = html;
      await loadNavScript();

      if (typeof setActiveNavLinks === 'function') {
        setActiveNavLinks();
      }
    } catch (e) {
      console.warn('Nav injection failed:', e);
    }
  }

  function loadNavScript() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[data-nav-script]')) return resolve();
      const s = document.createElement('script');
      s.src = NAV_SCRIPT_PATH;
      s.async = false;
      s.setAttribute('data-nav-script','true');
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  if (document.readyState !== 'loading') injectNav();
  else document.addEventListener('DOMContentLoaded', injectNav);
})();
