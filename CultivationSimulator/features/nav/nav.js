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
