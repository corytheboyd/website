import anime from './lib/anime.es.js';

const targets = document.getElementsByClassName("anime")

anime({
    targets: targets,
    translateX: 100,
    duration: 500,
});
