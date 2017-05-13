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
    let observer = this.mutationObserver();
    this.querySelector('.now-playing').then(nowPlaying => {
      observer.observe(nowPlaying, observerConfig);
    });
  },

  mutationObserver() {
    return new MutationObserver(() => {
      Promise.all([
        this.querySelector('.now-playing .track-info__name'),
        this.querySelector('.now-playing .track-info__artists'),
        this.querySelector('.now-playing .cover-art-image-loaded')
      ]).then(elements => {
        let name = elements[0].textContent,
            artists = elements[1].textContent,
            image = elements[2].style.backgroundImage.slice(5, -2);
        this.notify(name, artists, image);
      });
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

  notify(name, artists, image) {
    let options = {body: artists, icon: image};
    let n = new Notification(name, options);
    setTimeout(n.close.bind(n), 8000);
  }
};

spotifyNotifications.run();
