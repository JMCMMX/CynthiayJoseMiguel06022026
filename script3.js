import { animate, svg, stagger } from 'animejs';

// Asegúrate de que el DOM esté cargado si el script no tiene 'defer' o está en el head
// Con 'defer' en el script tag, esto usualmente no es necesario, pero no hace daño.
document.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.animated-header-container .line');

  if (lines.length > 0) {
    // Nota: La sintaxis animate(svg.createDrawable('.line'), ...) y la importación
    // específica de 'animate' y 'svg' pueden depender de una versión
    // o configuración particular de animejs.
    // La versión estándar de anime.js (v3+) usualmente se usa así:
    // import anime from 'animejs';
    // anime({ targets: '.line', ... });
    // Y anime.stagger() para el delay.
    // La propiedad 'draw' como ['0 0', '0 1', '1 1'] no es estándar en anime.js.
    // Anime.js usa 'strokeDashoffset' para animaciones de dibujo de línea.

    // Usando tu código tal como lo proporcionaste:
    try {
      animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', '1 1'], // Esta propiedad 'draw' es inusual para anime.js estándar
        ease: 'inOutQuad',
        duration: 2000,
        delay: stagger(100), // Para que stagger funcione, debe ser anime.stagger(100) con el import estándar.
        loop: true
      });
    } catch (error) {
      console.error("Error al iniciar la animación con animejs. Verifica la sintaxis de importación y las funciones/propiedades utilizadas:", error);
      // Fallback o mensaje de error alternativo si la animación falla.
      // Por ejemplo, podrías intentar una animación más estándar de anime.js aquí si es apropiado.
    }
  } else {
    console.warn("No se encontraron elementos con la clase '.line' dentro de '.animated-header-container' para animar.");
  }
});