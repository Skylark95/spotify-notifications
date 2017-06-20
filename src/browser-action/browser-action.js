chrome.storage.local.get('spotifyNotifications.tab.id', items => {
  let tabId = items['spotifyNotifications.tab.id'];
  chrome.tabs.sendMessage(tabId, {src: "spotifyNotifications.browserAction"}, response => {
    if (response.data) {
      document.querySelector('.cover-art-image').style.backgroundImage = `url('${response.data.image}')`;
      document.querySelector('.track-info-name').innerHTML = response.data.name;
      document.querySelector('.track-info-artists').innerHTML = response.data.artists;
    }
 });
 document.querySelector('body').addEventListener('click', () => {
   chrome.tabs.update(tabId, {active: true});
 });
});
