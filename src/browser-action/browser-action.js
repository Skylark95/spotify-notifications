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

      document.querySelector('.track-controls').style.display = 'block';
      let playElement = document.querySelector('.track-control-play'),
          pauseElement = document.querySelector('.track-control-pause'),
          previousElement = document.querySelector('.track-control-previous'),
          nextElement = document.querySelector('.track-control-next');

      playElement.style.display = 'none';
      playElement.addEventListener('click', () => {
        playElement.style.display = 'none';
        pauseElement.style.display = 'inline';
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performPlayAction"
        });
      });

      pauseElement.addEventListener('click', () => {
        pauseElement.style.display = 'none';
        playElement.style.display = 'inline';
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performPauseAction"
        });
      });

      previousElement.addEventListener('click', () => {
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performPreviousAction"
        });
      });

      nextElement.addEventListener('click', () => {
        chrome.tabs.sendMessage(tabId, {
          src: "spotifyNotifications.browserAction",
          action: "spotifyNotifications.performNextAction"
        });
      });

    }
  }

  chrome.tabs.sendMessage(tabId, {
    src: "spotifyNotifications.browserAction",
    action: "spotifyNotifications.notificationData"
  }, updateData);
});
