var data = {
  name: 'Spoonman',
  artists: 'Soundgarden',
  image: 'https://i.scdn.co/image/4f26396a6ab946e4df08a144372b1b2c60a6cb89'
};
document.querySelector('.cover-art-image').style.backgroundImage = `url('${data.image}')`;
document.querySelector('.track-info-name').innerHTML = data.name;
document.querySelector('.track-info-artists').innerHTML = data.artists;
