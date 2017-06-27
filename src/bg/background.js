/**
 * Notifcations for Spotify
 * https://github.com/Skylark95/spotify-notifications
 *
 * 2017 Skylark95
 * GNU General Public License v3.0
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.src === "spotifyNotifications.run" && sender.tab) {
    chrome.storage.local.set({'spotifyNotifications.tab.id': sender.tab.id});
    sendResponse({result: "OK"});
  }
});
