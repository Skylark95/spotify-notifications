/**
 * Notifcations for Spotify
 * https://github.com/Skylark95/spotify-notifications
 *
 * 2017 Skylark95
 * GNU General Public License v3.0
 */
var spotifyNotifications = {

  notificationObserver: null,
  notificationData: null,

  actions: {
    performNameAction() {
      document.querySelector('.track-info .track-info__name a').click();
    },

    performArtistsAction() {
      document.querySelector('.track-info .track-info__artists a').click();
    },

    performCoverArtAction() {
      document.querySelector('.now-playing__cover-art').click();
    },

    performPlayAction() {
      document.querySelector("button.control-button[title='Play']").click();
    },

    performPauseAction() {
      document.querySelector("button.control-button[title='Pause']").click();
    },

    performNextAction() {
      document.querySelector("button.control-button[title='Next']").click();
    },

    performPreviousAction() {
      document.querySelector("button.control-button[title='Previous']").click();
    }
  },

  run() {
    console.log('%c Notifications for Spotify ' + '%c https://github.com/Skylark95/spotify-notifications', 'background: #15843c; color: #fff; font-size: 110%;', '');
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        this.findTrackInfo().then(trackInfo => {
          this.notificationObserver = this.createNotificationObserver(trackInfo);
          this.notificationObserver.observe(trackInfo, {characterData: true, subtree: true});
          this.buildAndShowNotification(trackInfo);
        });
      }
    });
    this.installMessageListener();
  },

  installMessageListener() {
    chrome.runtime.sendMessage({src: "spotifyNotifications.run"});
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.src === "spotifyNotifications.browserAction") {
        if (request.action === "spotifyNotifications.notificationData") {
          sendResponse({
            src: "spotifyNotifications.run",
            data: Object.assign({isPlaying: this.isPlaying()}, this.notificationData)
          });
        } else if (request.action) {
          let action = request.action.replace("spotifyNotifications.", "");
          let fn = this.actions[action];
          if (fn) {
            sendResponse({src: "spotifyNotifications.run"});
            fn();
          }
        }
      }
    });
  },

  isPlaying() {
    return !!document.querySelector("button.control-button[title='Pause']");
  },

  buildAndShowNotification(trackInfo) {
    let nameAndArtist = this.getNameAndArtist(trackInfo);
    this.findCoverArtImage().then(image => {
      this.showNotification(Object.assign(nameAndArtist, image));
    });
  },

  showNotification(data) {
    this.notificationData = data;
    let notification = new Notification(data.name, {body: data.artists, icon: data.image});
    setTimeout(notification.close.bind(notification), 8000);
  },

  createNotificationObserver(trackInfo) {
    return new MutationObserver(records => {
      this.buildAndShowNotification(trackInfo);
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

      let node = body.querySelector('.track-info');
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
