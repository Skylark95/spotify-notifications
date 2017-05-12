var spotifyNotifications = {
  run() {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        this.observe();
      }
    });
  },

  observe() {
    let observerConfig = { characterData: true, subtree: true };

    let nowPlaying = document.querySelector('.now-playing');
    let name = nowPlaying.querySelector('.track-info__name');
    let artists = nowPlaying.querySelector('.track-info__artists');
    let image = nowPlaying.querySelector('.cover-art-image-loaded');

    let observer = new MutationObserver(() => {
      let interval = setInterval(() => {
        if (image) {
          clearInterval(interval);
          let imageSrc = image.style.backgroundImage.slice(5, -2);
          this.notify(name.textContent, artists.textContent, imageSrc);
        }
      }, 50);
    });
    
    observer.observe(nowPlaying, observerConfig);
  },

  notify(name, artists, image) {
    let options = {body: artists, icon: image};
    let n = new Notification(name, options);
    setTimeout(n.close.bind(n), 8000);
  }
};

spotifyNotifications.run();
