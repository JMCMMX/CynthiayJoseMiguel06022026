// ======================================================= //
// ===== SCRIPT PARA EL EFECTO ZOOM & PAN (hero-effect.js) ===== //
// ======================================================= //

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        // Creamos animaciones "quickTo" para las variables CSS de la posición del fondo.
        // Esto crea el efecto de paneo suave que sigue al ratón.
        const xTo = gsap.quickTo(heroSection, "--zoom-x", { duration: 0.8, ease: "power3" });
        const yTo = gsap.quickTo(heroSection, "--zoom-y", { duration: 0.8, ease: "power3" });

        heroSection.addEventListener('mousemove', e => {
            // Calculamos la posición del ratón como un porcentaje
            const xPercent = (e.clientX / window.innerWidth) * 100;
            const yPercent = (e.clientY / window.innerHeight) * 100;

            // Actualizamos las variables CSS con la nueva posición
            xTo(`${xPercent}%`);
            yTo(`${yPercent}%`);
        });

        // Cuando el ratón sale de la sección, la imagen vuelve al centro
        heroSection.addEventListener('mouseleave', () => {
            xTo('50%');
            yTo('50%');
        });
    }
});