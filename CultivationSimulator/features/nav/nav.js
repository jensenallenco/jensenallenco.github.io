(function(){
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('nav-close');
  const backdrop = document.getElementById('drawer-backdrop');

  if(!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.remove('hidden');
    toggleBtn.setAttribute('aria-expanded','true');
    const focusable = drawer.querySelector('a,button');
    if (focusable) focusable.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded','false');
    toggleBtn.focus();
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && !drawer.classList.contains('hidden')) closeDrawer(); });
})();

// Set aria-current and visual active state for nav links
document.addEventListener('DOMContentLoaded', () => {
  try {
    const links = Array.from(document.querySelectorAll('nav a'));
    const path = location.pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    let matched = false;
    links.forEach(a => {
      try {
        const url = new URL(a.href, location.origin);
        const hrefPath = url.pathname.replace(/\/$/, '') || '/';
        if (hrefPath === path) {
          a.setAttribute('aria-current', 'page');
          a.classList.add('nav-current');
          matched = true;
        }
      } catch(e) { /* ignore malformed hrefs */ }
    });

    // If no exact match, mark 'Projects' as active for project subpaths (e.g. /CultivationSimulator)
    if (!matched) {
      if (path !== '/' && path !== '/index.html') {
        const projectsLink = document.querySelector('nav a[href="/"]');
        if (projectsLink) {
          projectsLink.setAttribute('aria-current', 'page');
          projectsLink.classList.add('nav-current');
        }
      }
    }
  } catch(e) {
    console.warn('Nav active link script error', e);
  }
});
