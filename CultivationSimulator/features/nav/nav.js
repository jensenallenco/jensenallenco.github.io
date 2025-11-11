(function(){
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('nav-close');
  const backdrop = document.getElementById('drawer-backdrop');
  let lastFocused = null;

  if(!drawer) return; // nothing to do

  function getFocusable(container) {
    return Array.from(container.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    // focus first focusable inside drawer
    const focusable = getFocusable(drawer)[0];
    if (focusable) focusable.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    // restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e)=>{
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      expanded ? closeDrawer() : openDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close on link click and trap focus
  drawer.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if (a) {
      // allow external links to proceed but close drawer on click
      closeDrawer();
      return;
    }
  });

  // Simple focus trap inside drawer
  drawer.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') { if (drawer.classList.contains('open')) closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(drawer);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Close on Escape when focus outside drawer
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });

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
