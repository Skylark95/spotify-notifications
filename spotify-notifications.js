let observerConfig = { characterData: true, subtree: true };

let nowPlaying = document.querySelector('.now-playing');
let name = nowPlaying.querySelector('.track-info__name');
let artists = nowPlaying.querySelector('.track-info__artists');
let image = nowPlaying.querySelector('.cover-art-image');

let observer = new MutationObserver(() => {
    console.log(`Name: ${name.textContent}`);
    console.log(`Artists: ${artists.textContent}`);
});
observer.observe(nowPlaying, observerConfig);
