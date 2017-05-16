var spotifyNotifications = {
  run() {
    console.log('%c Notifications for Spotify ' + '%c https://gitlab.com/Skylark95/spotify-notifications', 'background: #1db954; color: #fff; font-weight: bold', '');
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        this.observe();
        this.notify();
      }
    });
  },

  observe() {
    let observer = new MutationObserver(() => { this.notify(); });
    let observerConfig = { characterData: true, subtree: true };
    this.querySelector('.now-playing').then(nowPlaying => {
      observer.observe(nowPlaying, observerConfig);
    });
  },

  querySelector(selector) {
    return new Promise(resolve => {
      let value;
      setTimeout(function query() {
        value = document.querySelector(selector);
        if (!value) {
          setTimeout(query, 200);
        } else {
          resolve(value);
        }
      }, 200);
    });
  },

  notify() {
    Promise.all([
      this.querySelector('.now-playing .track-info__name'),
      this.querySelector('.now-playing .track-info__artists'),
      this.querySelector('.now-playing .cover-art-image-loaded')
    ]).then(elements => {
      let name = elements[0].textContent,
          artists = elements[1].textContent,
          image = elements[2].style.backgroundImage.slice(5, -2);
      this.doNotify(name, artists, image);
    });
  },

  doNotify(name, artists, image) {
    let options = {body: artists, icon: image};
    let n = new Notification(name, options);
    setTimeout(n.close.bind(n), 8000);
  }
};

spotifyNotifications.run();
