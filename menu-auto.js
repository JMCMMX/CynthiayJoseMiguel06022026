/* ==========================================================
  MENU AUTO — Aplica estilos/animaciones del botón MENU/CERRAR
  a TODAS las páginas, sin editar cada HTML.
  - Inyecta CSS necesario
  - Normaliza markup (crea spans MENU/CERRAR si faltan)
  - Maneja abrir/cerrar, ESC, clic fuera y bloqueo de scroll
========================================================== */

(function(){
  // --- CSS inyectado (idéntico en todas las páginas) ---
  const CSS = `
/* ====== BOTÓN DE MENÚ — Proporcionado y centrado ====== */
.sm-toggle{
  position:relative; display:inline-flex; align-items:center; justify-content:center;
  height:2.6em; min-width:8ch; padding:0 .9em;
  background:rgba(0,0,0,0.25); color:#F2EEE9; border:none; cursor:pointer;
  border-radius:999px; backdrop-filter:blur(6px);
  font:700 0.95rem/1 'Lato',system-ui,sans-serif; letter-spacing:.5px; text-transform:uppercase;
  overflow:hidden; transition:background .25s ease,color .25s ease,transform .08s ease;
  -webkit-tap-highlight-color:transparent;
}
.sm-toggle:hover{ background:rgba(0,0,0,0.35) }
.sm-toggle:active{ transform:translateY(1px) scale(.99) }
.staggered-menu-wrapper[data-open] .sm-toggle{ background:rgba(255,255,255,.85); color:#3F3A36 }

.sm-icon,.sm-icon-line,.menu-tip,.menu-guide{ display:none !important }

.sm-toggle-text-open,.sm-toggle-text-close{
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  width:100%; line-height:1; backface-visibility:hidden;
  transition:transform .35s ease, opacity .35s ease;
}
.sm-toggle-text-open{ opacity:1; transform:translateY(0%) }
.sm-toggle-text-close{ opacity:0; transform:translateY(100%) }
.staggered-menu-wrapper[data-open] .sm-toggle-text-open{ opacity:0; transform:translateY(-100%) }
.staggered-menu-wrapper[data-open] .sm-toggle-text-close{ opacity:1; transform:translateY(0%) }

/* ====== PANEL LATERAL (por si en alguna página faltan reglas) ====== */
.staggered-menu-wrapper{ position:fixed; inset:0; height:100vh; width:100%; z-index:999; pointer-events:none; }
.staggered-menu-header{ position:absolute; top:0; left:0; width:100%; display:flex; align-items:center; justify-content:space-between; padding:1.5em; z-index:20; }
.staggered-menu-header>*{ pointer-events:auto; }
.sm-logo-img{ height:56px; width:auto; display:block; transition:filter .3s ease }
.menu-open .sm-logo-img{ filter:none; }

.staggered-menu-panel,.sm-prelayers{ position:absolute; top:0; right:0; width:clamp(300px,38vw,420px); height:100%; }
.staggered-menu-panel{
  background:#F2EEE9; display:flex; flex-direction:column; padding:7em 2em 2em;
  overflow-y:auto; z-index:10; pointer-events:auto; transform:translateX(100%); transition:transform .55s ease;
}
.staggered-menu-wrapper[data-open] .staggered-menu-panel{ transform:translateX(0) }
.sm-prelayers{ pointer-events:none; z-index:5 }
.sm-prelayer{ position:absolute; inset:0; transform:translateX(100%); transition:transform .5s ease }
.staggered-menu-wrapper[data-open] .sm-prelayer{ transform:translateX(0) }

.sm-panel-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.6rem; counter-reset:smItem; }
.sm-panel-item{
  position:relative; color:#3F3A36; font-weight:700; text-decoration:none;
  font-size:clamp(2rem,5vw,3rem); text-transform:uppercase; letter-spacing:-2px;
  padding-right:1.6em; display:inline-block; transition:color .25s ease;
}
.sm-panel-item:hover{ color:var(--sm-accent) }
.sm-panel-item::after{
  counter-increment:smItem; content:counter(smItem,decimal-leading-zero);
  position:absolute; top:.1em; right:0; font-size:16px; color:var(--sm-accent); opacity:.9;
}

@media (max-width:640px){
  .staggered-menu-header{ padding:1.1em }
  .staggered-menu-panel,.sm-prelayers{ width:100%; left:0; right:0 }
  .staggered-menu-panel{ padding-left:1.4em; padding-right:1.4em }
  .sm-logo-img{ height:50px }
}
/* Respeta reducción de movimiento */
@media (prefers-reduced-motion: reduce){
  .sm-toggle, .sm-toggle-text-open, .sm-toggle-text-close{ transition:none !important; }
}
`;

  // Inyecta CSS una única vez
  if(!document.getElementById('sm-menu-css')){
    const style = document.createElement('style');
    style.id = 'sm-menu-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // Inicializa TODOS los wrappers que existan en la página
  function initWrapper(wrapper){
    const panel = wrapper.querySelector('.staggered-menu-panel');
    let toggle = wrapper.querySelector('.sm-toggle');

    // Si no existe toggle, créalo y colócalo en el header
    let header = wrapper.querySelector('.staggered-menu-header');
    if(!header){
      header = document.createElement('div');
      header.className = 'staggered-menu-header';
      wrapper.appendChild(header);
    }
    if(!toggle){
      toggle = document.createElement('button');
      toggle.className = 'sm-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label','Abrir menú');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML = '<span class="sm-toggle-text-open">MENU</span><span class="sm-toggle-text-close">CERRAR</span>';
      header.appendChild(toggle);
    }else{
      // Normaliza contenido del botón (crea spans si faltan)
      const txt = (toggle.textContent || '').trim();
      const hasOpen = toggle.querySelector('.sm-toggle-text-open');
      const hasClose = toggle.querySelector('.sm-toggle-text-close');
      if(!hasOpen || !hasClose){
        const open = document.createElement('span');
        open.className = 'sm-toggle-text-open';
        open.textContent = 'MENU';
        const close = document.createElement('span');
        close.className = 'sm-toggle-text-close';
        close.textContent = 'CERRAR';
        toggle.textContent = '';
        toggle.append(open, close);
      }
      toggle.setAttribute('aria-expanded','false');
      toggle.type = 'button';
      toggle.setAttribute('aria-label','Abrir menú');
    }

    // Si no hay panel, no podemos continuar (evita errores)
    if(!panel) return;

    // Estado
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const apply = (open) => {
      if(open) wrapper.setAttribute('data-open',''); else wrapper.removeAttribute('data-open');
      panel.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };

    // Eventos
    toggle.addEventListener('click', () => apply(!isOpen()));

    // Cerrar con clic fuera
    document.addEventListener('click', (e)=>{
      if(!isOpen()) return;
      if(!panel.contains(e.target) && !toggle.contains(e.target)) apply(false);
    });

    // Cerrar con ESC
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && isOpen()) apply(false);
    });

    // Trap de foco básico dentro del panel
    panel.addEventListener('keydown', (e)=>{
      if(e.key !== 'Tab') return;
      const focusables = panel.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if(!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });

    // Asegura estado cerrado al cargar
    requestAnimationFrame(()=>apply(false));
  }

  // Busca TODOS los wrappers y los inicializa
  function boot(){
    const wrappers = document.querySelectorAll('.staggered-menu-wrapper');
    wrappers.forEach(initWrapper);
  }

  // Arranque
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
