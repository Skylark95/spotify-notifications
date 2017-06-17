/**
 * Notifcations for Spotify
 * https://github.com/Skylark95/spotify-notifications
 *
 * 2017 Skylark95
 * GNU General Public License v3.0
 */
var spotifyNotifications = {

  notificationObserver: null,

  run() {
    console.log('%c Notifications for Spotify ' + '%c https://github.com/Skylark95/spotify-notifications', 'background: #1db954; color: #fff; font-weight: bold', '');
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        this.findCoverArt();
        this.findTrackInfo().then(trackInfo => {
          let nameAndArtist = this.getNameAndArtist(trackInfo);
          this.findCoverArtImage().then(image => {
            this.showNotification(Object.assign(nameAndArtist, image));
          });
          this.notificationObserver = this.createNotificationObserver(trackInfo);
          this.notificationObserver.observe(trackInfo, {characterData: true, subtree: true});
        });
      }
    });
  },

  showNotification(data) {
    let notification = new Notification(data.name, {body: data.artists, icon: data.image});
    setTimeout(notification.close.bind(notification), 8000);
  },

  createNotificationObserver(trackInfo) {
    return new MutationObserver(records => {
      let nameAndArtist = this.getNameAndArtist(trackInfo);
      this.findCoverArtImage().then(image => {
        this.showNotification(Object.assign(nameAndArtist, image));
      });
    });
  },

  getNameAndArtist(trackInfo) {
    return {
      name: trackInfo.querySelector('.track-info__name').textContent,
      artists: trackInfo.querySelector('.track-info__artists').textContent
    };
  },

  findTrackInfo() {
    return new Promise(resolve => {
      let observer = new MutationObserver((records, instance) => {
        records.forEach(record => {
          record.addedNodes.forEach(node => {
            if (node.classList.contains('track-info')) {
              instance.disconnect();
              resolve(node);
            }
          });
        });
      });
      let body = document.querySelector('body');
      observer.observe(body, {childList: true, subtree: true});

      let node = document.querySelector('.track-info');
      if (node) {
        observer.disconnect();
        resolve(node);
      }
    });
  },

  findCoverArtImage() {
    return new Promise(resolve => {
      this.findCoverArt().then(coverArt => {
        let observer = new MutationObserver((records, instance) => {
          records.forEach(record => {
            if (record.target.style && record.target.style.backgroundImage) {
              instance.disconnect();
              resolve({
                image: record.target.style.backgroundImage.slice(5, -2)
              });
            }
          });
        });
        observer.observe(coverArt, {attributes: true, attributeFilter: ['style'], subtree: true});

        let node = coverArt.querySelector('.cover-art-image-loaded');
        if (node) {
          observer.disconnect();
          resolve({
            image: node.style.backgroundImage.slice(5, -2)
          });
        }
      });
    });
  },

  findCoverArt() {
    return new Promise(resolve => {
      let observer = new MutationObserver((records, instance) => {
        records.forEach(record => {
          record.addedNodes.forEach(node => {
            node.childNodes.forEach(child => {
              if (child.classList && child.classList.contains('now-playing__cover-art')) {
                instance.disconnect();
                resolve(child);
              }
            });
          });
        });
      });
      let body = document.querySelector('body');
      observer.observe(body, {childList: true, subtree: true});

      let node = body.querySelector('.now-playing__cover-art');
      if (node) {
        observer.disconnect();
        resolve(node);
      }
    });
  }

};

spotifyNotifications.run();
