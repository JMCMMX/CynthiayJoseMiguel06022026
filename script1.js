document.addEventListener('DOMContentLoaded', function() {
    const parallaxElement = document.querySelector('.parallax-container');

    if (parallaxElement) {
        window.addEventListener('scroll', function() {
            let scrollOffset = window.pageYOffset;
            parallaxElement.style.backgroundPositionY = scrollOffset * 0.5 + 'px';
        });
    } else {
        console.warn('Elemento parallax con clase ".parallax-container" no encontrado.');
    }
});