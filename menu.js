// menu.js — con ícono animado y tooltip guiado
(function () {
  const wrapper   = document.querySelector('.staggered-menu-wrapper');
  const panel     = document.querySelector('#staggered-menu-panel');
  const toggleBtn = document.querySelector('.sm-toggle');
  const preLayers = document.querySelectorAll('.sm-prelayer');
  const panelItems= document.querySelectorAll('.sm-panel-item');
  const itemLabels= document.querySelectorAll('.sm-panel-itemLabel');
  const icon      = toggleBtn ? toggleBtn.querySelector('.sm-icon') : null;
  const hasGSAP   = typeof window.gsap === 'function';
  if (!wrapper || !panel || !toggleBtn) return;

  let isOpen = false;

  // ==== Tooltip ====
  const TOOLTIP_KEY = "menuTooltipSeen";
  function createTooltip() {
    if (localStorage.getItem(TOOLTIP_KEY)) return;
    const tip = document.createElement('div');
    tip.className = 'menu-tooltip';
    tip.textContent = 'Haz clic aquí para abrir el menú';
    toggleBtn.parentElement.appendChild(tip);
    requestAnimationFrame(() => tip.classList.add('visible'));
    setTimeout(() => {
      tip.classList.remove('visible');
      setTimeout(() => tip.remove(), 400);
      localStorage.setItem(TOOLTIP_KEY, '1');
    }, 4000);
  }

  // ==== Estado ====
  function applyState(open) {
    isOpen = !!open;
    wrapper.toggleAttribute('data-open', isOpen);
    panel.setAttribute('aria-hidden', !isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  // ==== Animación del ícono ====
  function animateIcon(opening) {
    if (!icon) return;
    const lines = icon.querySelectorAll('.sm-icon-line');
    if (hasGSAP) {
      const tl = gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.inOut' } });
      if (opening) {
        tl.to(lines[1], { opacity: 0 }, 0)
          .to(lines[0], { y: 8, rotate: 45 }, 0)
          .to(lines[2], { y: -8, rotate: -45 }, 0);
      } else {
        tl.to(lines[0], { y: 0, rotate: 0 }, 0)
          .to(lines[2], { y: 0, rotate: 0 }, 0)
          .to(lines[1], { opacity: 1 }, 0.1);
      }
    } else {
      lines[1].style.opacity = opening ? '0' : '1';
      lines[0].style.transform = opening ? 'translateY(8px) rotate(45deg)' : '';
      lines[2].style.transform = opening ? 'translateY(-8px) rotate(-45deg)' : '';
    }
  }

  // ==== Animaciones del panel ====
  function gsapInitPositions(){
    if (!hasGSAP) return;
    gsap.set([panel, ...preLayers], { xPercent:100 });
    gsap.set(itemLabels, { yPercent:120 });
  }
  function gsapOpen(){
    if (!hasGSAP) return;
    const tl = gsap.timeline();
    tl.to(preLayers,{xPercent:0,duration:0.45,stagger:0.06,ease:'power3.out'})
      .to(panel,{xPercent:0,duration:0.55,ease:'power3.out'},'-=0.35')
      .to(itemLabels,{yPercent:0,duration:0.6,stagger:0.08,ease:'power3.out'},'-=0.45');
  }
  function gsapClose(){
    if (!hasGSAP) return;
    gsap.to([panel,...preLayers],{
      xPercent:100,duration:0.35,ease:'power3.in',overwrite:true,
      onComplete:()=>gsap.set(itemLabels,{yPercent:120})
    });
  }

  // ==== Control principal ====
  function openMenu(){
    applyState(true);
    animateIcon(true);
    gsapOpen();
  }
  function closeMenu(){
    animateIcon(false);
    gsapClose();
    setTimeout(()=>applyState(false),hasGSAP?280:0);
  }
  function toggleMenu(){
    isOpen ? closeMenu() : openMenu();
  }

  toggleBtn.addEventListener('click', e=>{
    toggleMenu();
    localStorage.setItem(TOOLTIP_KEY, '1'); // si hace clic, ya no vuelve a mostrar el tooltip
    const tip = document.querySelector('.menu-tooltip');
    if (tip) tip.remove();
  });

  document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&isOpen)closeMenu(); });
  document.addEventListener('click', e=>{
    if(!isOpen) return;
    if(!panel.contains(e.target) && !toggleBtn.contains(e.target)) closeMenu();
  });

  gsapInitPositions();
  applyState(false);
  if (wrapper.hasAttribute('data-autopen')) setTimeout(openMenu, 100);

  // lanza el tooltip sólo si es la primera vez
  createTooltip();
})();

// === Mostrar el texto “Aquí está el menú” cada vez que se carga ===
document.addEventListener('DOMContentLoaded', () => {
  const guide = document.querySelector('.menu-guide');
  const toggleBtn = document.querySelector('.sm-toggle');

  if (!guide || !toggleBtn) return;

  // Mostrar al cargar
  setTimeout(() => guide.classList.add('visible'), 400);

  // Ocultar después de 4 segundos
  setTimeout(() => guide.classList.remove('visible'), 4000);

  // Si el usuario abre el menú, ocultarlo inmediatamente
  toggleBtn.addEventListener('click', () => {
    guide.classList.remove('visible');
  });
});

