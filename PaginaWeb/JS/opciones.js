// Referencias
const musicToggle = document.getElementById('music-toggle');
const music = document.getElementById('background-music');
const brightnessSlider = document.getElementById('brightness-slider');

// Cargar preferencias
let isMusicOn = localStorage.getItem('musicOn') === 'true';
let brightness = localStorage.getItem('brightness') || 100;

document.body.style.filter = `brightness(${brightness}%)`;
brightnessSlider.value = brightness;

if (isMusicOn) {
    music.play();
    musicToggle.textContent = 'Desactivar Música';
} else {
    music.pause();
    musicToggle.textContent = 'Activar Música';
}

// Alternar música
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = 'Desactivar Música';
        localStorage.setItem('musicOn', true);
    } else {
        music.pause();
        musicToggle.textContent = 'Activar Música';
        localStorage.setItem('musicOn', false);
    }
});

// Ajustar brillo
brightnessSlider.addEventListener('input', () => {
    const value = brightnessSlider.value;
    document.body.style.filter = `brightness(${value}%)`;
    localStorage.setItem('brightness', value);
});
