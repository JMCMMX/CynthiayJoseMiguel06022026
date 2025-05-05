document.addEventListener('DOMContentLoaded', () => {

    // --- Configuración de la Fecha Objetivo ---
    // Formato: AÑO-MES-DIA T HORA:MINUTOS:SEGUNDOS
    // ¡Importante! Los meses en JavaScript van de 0 (Enero) a 11 (Diciembre).
    // Por lo tanto, Febrero es el mes 1.
    // O puedes usar el formato 'YYYY-MM-DDTHH:mm:ss' que es más estándar
    const targetDate = new Date('2026-02-06T18:00:00').getTime();
    // Alternativa usando números (mes 1 es Febrero):
    // const targetDate = new Date(2026, 1, 6, 18, 0, 0).getTime();

    // --- Elementos del DOM ---
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const timerEl = document.getElementById('countdown-timer');
    const messageEl = document.getElementById('message');

    // Guarda los valores anteriores para detectar cambios
    let previousValues = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
    };

    // --- Función para actualizar el temporizador ---
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // --- Si el tiempo ha terminado ---
        if (difference <= 0) {
            clearInterval(intervalId); // Detiene el intervalo
            timerEl.style.display = 'none'; // Oculta el temporizador
            messageEl.style.display = 'block'; // Muestra el mensaje final
            // Opcional: Poner todos los números a 0 si no ocultas el timer
            // updateElement(daysEl, 0, 'days');
            // updateElement(hoursEl, 0, 'hours');
            // updateElement(minutesEl, 0, 'minutes');
            // updateElement(secondsEl, 0, 'seconds');
            return;
        }

        // --- Cálculos del tiempo restante ---
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // --- Actualizar DOM y aplicar animación ---
        updateElement(daysEl, days, 'days');
        updateElement(hoursEl, hours, 'hours');
        updateElement(minutesEl, minutes, 'minutes');
        updateElement(secondsEl, seconds, 'seconds');
    }

    // --- Función auxiliar para actualizar un elemento y animarlo si cambia ---
    function updateElement(element, value, key) {
        // Añade un 0 al principio si es menor de 10
        const formattedValue = value < 10 ? '0' + value : value;

        // Comprueba si el valor ha cambiado
        if (previousValues[key] !== formattedValue) {
            element.textContent = formattedValue;
            previousValues[key] = formattedValue; // Actualiza el valor anterior

            // Aplica la animación
            element.classList.add('tick');

            // Elimina la clase después de que termine la animación para poder reutilizarla
            element.addEventListener('animationend', () => {
                element.classList.remove('tick');
            }, { once: true }); // 'once: true' asegura que el listener se quite solo
        } else {
            // Si no ha cambiado, solo asegura que el texto sea correcto (redundante pero seguro)
            element.textContent = formattedValue;
        }
    }

    // --- Iniciar el temporizador ---
    // Llama una vez inmediatamente para evitar el retraso inicial de 1s
    updateCountdown();
    // Establece el intervalo para actualizar cada segundo
    const intervalId = setInterval(updateCountdown, 1000);

}); // Fin del DOMContentLoaded