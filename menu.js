// ======================================================= //
// ===== PASO 3: REEMPLAZA EL CONTENIDO DE "menu.js" ===== //
// ======================================================= //

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos que vamos a animar
    const wrapper = document.querySelector('.staggered-menu-wrapper');
    const panel = document.querySelector('.staggered-menu-panel');
    const preLayers = document.querySelectorAll('.sm-prelayer');
    const toggleBtn = document.querySelector('.sm-toggle');
    const textInner = toggleBtn.querySelector('.sm-toggle-textInner');
    const icon = toggleBtn.querySelector('.sm-icon');
    const panelItems = document.querySelectorAll('.sm-panel-item');
    const itemLabels = document.querySelectorAll('.sm-panel-itemLabel');

    let isOpen = false;

    // --- CONFIGURACIÓN INICIAL ---
    // Posiciona todo fuera de la pantalla al cargar
    gsap.set([panel, ...preLayers], { xPercent: 100 });
    // Configura el ícono de "más"
    gsap.set(icon.children[0], { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(icon.children[1], { transformOrigin: '50% 50%', rotate: 90 });
    // Configura el texto de los enlaces para la animación de entrada
    gsap.set(itemLabels, { yPercent: 120 });
    // Configura la numeración para que sea invisible al inicio
    gsap.set(panelItems, { '--sm-num-opacity': 0 });
    // Crea el texto inicial del botón "Menu"
    textInner.innerHTML = '<span class="sm-toggle-line">Menu</span>';

    // --- FUNCIÓN PARA ANIMAR EL TEXTO DEL BOTÓN (MENU/CLOSE) ---
    const animateText = (opening) => {
        const currentText = opening ? 'Menu' : 'Close';
        const nextText = opening ? 'Close' : 'Menu';
        
        textInner.innerHTML = `
            <span class="sm-toggle-line">${currentText}</span>
            <span class="sm-toggle-line">${nextText}</span>
        `;
        
        gsap.fromTo(textInner, 
            { yPercent: opening ? 0 : -50 },
            { yPercent: opening ? -50 : 0, duration: 0.6, ease: 'power4.out' }
        );
    };
    
    // --- FUNCIÓN PARA ANIMAR EL ÍCONO DEL BOTÓN (+/X) ---
    const animateIcon = (opening) => {
        gsap.to(icon, { rotate: opening ? 225 : 0, duration: 0.8, ease: 'power4.out' });
    };

    // --- TIMELINE DE GSAP PARA ABRIR EL MENÚ ---
    const openTimeline = () => {
        const tl = gsap.timeline();

        tl.to(preLayers, {
            xPercent: 0,
            duration: 0.5,
            ease: 'power4.out',
            stagger: 0.07,
        })
        .to(panel, {
            xPercent: 0,
            duration: 0.65,
            ease: 'power4.out',
        }, "-=0.4") // Se superpone con la animación anterior
        .to(itemLabels, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.1,
        }, "-=0.6")
        .to(panelItems, {
            '--sm-num-opacity': 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
        }, "-=0.6");

        return tl;
    };

    // --- FUNCIÓN PARA CERRAR EL MENÚ ---
    const closeMenu = () => {
        gsap.to([panel, ...preLayers], {
            xPercent: 100,
            duration: 0.4,
            ease: 'power3.in',
            overwrite: true,
            onComplete: () => {
                // Resetea los estilos para la próxima vez que se abra
                gsap.set(itemLabels, { yPercent: 120 });
                gsap.set(panelItems, { '--sm-num-opacity': 0 });
            }
        });
    };

    // --- FUNCIÓN PRINCIPAL QUE CONTROLA TODO ---
    const toggleMenu = () => {
        isOpen = !isOpen;
        wrapper.setAttribute('data-open', isOpen ? 'true' : '');
        
        animateText(isOpen);
        animateIcon(isOpen);
        
        if (isOpen) {
            openTimeline().play();
        } else {
            closeMenu();
        }
    };

    // Asigna el evento de clic al botón
    toggleBtn.addEventListener('click', toggleMenu);
});