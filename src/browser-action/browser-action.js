chrome.storage.local.get('spotifyNotifications.tab.id', items => {
  let tabId = items['spotifyNotifications.tab.id'];

  function updateData(response) {
    if (response.data) {
      let coverArtElement = document.querySelector('.cover-art-image');
      coverArtElement.style.backgroundImage = `url('${response.data.image}')`;
      coverArtElement.classList.add('track-info-action');
      coverArtElement.addEventListener('click', () => {
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performCoverArtAction"
        });
        chrome.tabs.update(tabId, {active: true});
      });

      let nameElement = document.querySelector('.track-info-name');
      nameElement.textContent = response.data.name;
      nameElement.classList.add('track-info-action');
      nameElement.addEventListener('click', () => {
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performNameAction"
        });
        chrome.tabs.update(tabId, {active: true});
      });

      let artistsElement = document.querySelector('.track-info-artists');
      artistsElement.classList.add('track-info-action');
      artistsElement.textContent = response.data.artists;
      artistsElement.addEventListener('click', () => {
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performArtistsAction"
        });
        chrome.tabs.update(tabId, {active: true});
      });
    }
  }

  chrome.tabs.sendMessage(tabId, {
    src: "spotifyNotifications.browserAction",
    action: "spotifyNotifications.notificationData"
  }, updateData);
});
