/**
 * Notifcations for Spotify
 * https://github.com/Skylark95/spotify-notifications
 *
 * 2017 Skylark95
 * GNU General Public License v3.0
 */
var snBrowserAction = {

  tabId: null,

  init() {
    chrome.storage.local.get('spotifyNotifications.tab.id', items => {
      snBrowserAction.tabId = items['spotifyNotifications.tab.id'];
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.notificationData"
      }, snBrowserAction.updateData);
    });
  },

  sendMessage(message, callback) {
    chrome.tabs.sendMessage(snBrowserAction.tabId, message, callback);
  },

  focusTab() {
    chrome.tabs.update(snBrowserAction.tabId, {active: true});
  },

  installMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.src === "spotifyNotifications.showNotification" && request.data) {
        snBrowserAction.updateTrackInfo(request.data);
        sendResponse({src: "spotifyNotifications.browserAction"});
      }
    });
  },

  updateData(response) {
    if (response.data) {
      snBrowserAction.updateTrackInfo(response.data);
      snBrowserAction.updateControls(response.data.isPlaying);
      snBrowserAction.installMessageListener();
    }
  },

  updateTrackInfo(data) {
    snBrowserAction.updateCoverArt(data.image);
    snBrowserAction.updateName(data.name);
    snBrowserAction.updateArtists(data.artists);
  },

  updateControls(isPlaying) {
    let controls = {
      container: document.querySelector('.track-controls'),
      play: document.querySelector('.track-control-play'),
      pause: document.querySelector('.track-control-pause'),
      previous: document.querySelector('.track-control-previous'),
      next: document.querySelector('.track-control-next')
    };

    controls.container.style.display = 'block';

    if (isPlaying) {
      controls.play.style.display = 'none';
    } else {
      controls.pause.style.display = 'none';
    }

    snBrowserAction.updatePlay(controls);
    snBrowserAction.updatePause(controls);
    snBrowserAction.updatePrevious(controls);
    snBrowserAction.updateNext(controls);
  },

  updateCoverArt(image) {
    let coverArtElement = document.querySelector('.cover-art-image');
    coverArtElement.style.backgroundImage = `url('${image}')`;
    coverArtElement.classList.add('track-info-action');
    coverArtElement.addEventListener('click', () => {
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performCoverArtAction"
      });
      snBrowserAction.focusTab();
    });
  },

  updateName(name) {
    let nameElement = document.querySelector('.track-info-name');
    nameElement.textContent = name;
    nameElement.classList.add('track-info-action');
    nameElement.addEventListener('click', () => {
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performNameAction"
      });
      snBrowserAction.focusTab();
    });
  },

  updateArtists(artists) {
    let artistsElement = document.querySelector('.track-info-artists');
    artistsElement.classList.add('track-info-action');
    artistsElement.textContent = artists;
    artistsElement.addEventListener('click', () => {
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performArtistsAction"
      });
      snBrowserAction.focusTab();
    });
  },

  updatePlay(controls) {
    controls.play.addEventListener('click', () => {
      controls.play.style.display = 'none';
      controls.pause.style.display = 'inline';
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performPlayAction"
      });
    });
  },

  updatePause(controls) {
    controls.pause.addEventListener('click', () => {
      controls.pause.style.display = 'none';
      controls.play.style.display = 'inline';
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performPauseAction"
      });
    });
  },

  updatePrevious(controls) {
    controls.previous.addEventListener('click', () => {
      controls.play.style.display = 'none';
      controls.pause.style.display = 'inline';
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performPreviousAction"
      });
    });
  },

  updateNext(controls) {
    controls.next.addEventListener('click', () => {
      controls.play.style.display = 'none';
      controls.pause.style.display = 'inline';
      snBrowserAction.sendMessage({
        src: "spotifyNotifications.browserAction",
        action: "spotifyNotifications.performNextAction"
      });
    });
  }

};

snBrowserAction.init();
