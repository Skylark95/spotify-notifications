/**
 * Notifcations for Spotify
 * https://github.com/Skylark95/spotify-notifications
 *
 * 2017 Skylark95
 * GNU General Public License v3.0
 */
var snBackground = {

  init() {
    this.installTabIdListener();
    this.installPlayPauseCommandListener();
  },

  installTabIdListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.src === "spotifyNotifications.run" && sender.tab) {
        chrome.storage.local.set({'spotifyNotifications.tab.id': sender.tab.id});
        sendResponse({result: "OK"});
      }
    });
  },

  installPlayPauseCommandListener() {
    chrome.commands.onCommand.addListener(function(command) {
      console.log(command);
      if ("spotify-notifications-play-pause" === command) {
        chrome.storage.local.get('spotifyNotifications.tab.id', items => {
          let tabId = items['spotifyNotifications.tab.id'];
          chrome.tabs.sendMessage(tabId, {
            src: "spotifyNotifications.background",
            action: "spotifyNotifications.performPlayPauseAction"
          });
        });
      } else if ("spotify-notifications-show-notification" === command) {
        chrome.storage.local.get('spotifyNotifications.tab.id', items => {
          let tabId = items['spotifyNotifications.tab.id'];
          chrome.tabs.sendMessage(tabId, {
            src: "spotifyNotifications.background",
            action: "spotifyNotifications.performShowNotification"
          });
        });
      }
    });
  }

};

snBackground.init();
