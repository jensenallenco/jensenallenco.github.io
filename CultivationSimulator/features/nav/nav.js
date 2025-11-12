// Navigation interactions (drawer + dropdown) and active state handling.
// This file is loaded dynamically after the nav partial is injected.
(function(){
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('nav-close');
  const backdrop = document.getElementById('drawer-backdrop');
  const toolsToggle = document.querySelector('nav button[aria-haspopup="true"]');
  const toolsMenu = toolsToggle ? toolsToggle.parentElement.querySelector('div.absolute') : null;
  let lastFocused = null;

  // Drawer may be absent on some pages, but dropdown logic can still run.
  // Don't return early so desktop dropdown still wires up.

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

  // Tools dropdown accessibility (desktop)
  if (toolsToggle && toolsMenu) {
    let hoverTimer = null;
    function openTools() {
      clearTimeout(hoverTimer);
      toolsMenu.classList.remove('hidden');
      toolsToggle.setAttribute('aria-expanded','true');
    }
    function closeToolsDelayed(delay=120) {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(()=>{
        toolsMenu.classList.add('hidden');
        toolsToggle.setAttribute('aria-expanded','false');
      }, delay);
    }

    // Click toggles
    toolsToggle.addEventListener('click', (e)=>{
      e.preventDefault();
      const expanded = toolsToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeToolsDelayed(0) : openTools();
    });

    // Hover persistence: keep open while hovering button or menu
    toolsToggle.addEventListener('mouseenter', openTools);
    toolsToggle.addEventListener('mouseleave', ()=>closeToolsDelayed());
    toolsMenu.addEventListener('mouseenter', openTools);
    toolsMenu.addEventListener('mouseleave', ()=>closeToolsDelayed());

    // Focus management for keyboard users
    toolsToggle.addEventListener('focus', openTools);
    toolsMenu.addEventListener('focusin', openTools);
    toolsMenu.addEventListener('focusout', ()=>closeToolsDelayed());

    // Click outside to close
    document.addEventListener('click', (e)=>{
      if (!toolsMenu.contains(e.target) && !toolsToggle.contains(e.target)) {
        closeToolsDelayed(0);
      }
    });
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') closeToolsDelayed(0);
    });
  }

  // Drawer wiring (guard if absent)
  if (drawer) {
    if (toggleBtn) {
      toggleBtn.addEventListener('click', ()=>{
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
        closeDrawer();
        return;
      }
    });

    // Focus trap
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

    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  }

})();

// Active link logic encapsulated for manual invocation when dynamically loaded
function setActiveNavLinks() {
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
    const toolsToggle = document.querySelector('nav button[aria-haspopup="true"]');
    if (matched && /elixir|upgrades/.test(path) && toolsToggle) {
      toolsToggle.classList.add('nav-current');
    }
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
}

if (document.readyState !== 'loading') {
  setActiveNavLinks();
} else {
  document.addEventListener('DOMContentLoaded', setActiveNavLinks);
}
