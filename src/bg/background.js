chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.src === "spotifyNotifications.run" && sender.tab) {
    chrome.storage.local.set({'spotifyNotifications.tab.id': sender.tab.id});
    sendResponse({result: "OK"});
  }
});
