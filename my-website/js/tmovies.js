const API_KEY = '4805fee141236fd075133fd593f71e48';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentVideoId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchTrendingMovies();
});

async function fetchTrendingMovies() {
  const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  const container = document.getElementById('movies-list');
  container.innerHTML = '';

  movies.forEach(movie => {
    const tile = document.createElement('div');
    tile.classList.add('movie-tile');
    tile.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" />
    `;
    tile.addEventListener('click', () => openModal(movie));
    container.appendChild(tile);
  });
}

function openModal(movie) {
  currentVideoId = movie.id;

  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-description').textContent = movie.overview;
  document.getElementById('modal-image').src = IMG_URL + movie.poster_path;

  const defaultServer = document.getElementById('server').value;
  setVideoSource(defaultServer);
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function changeServer() {
  const selectedServer = document.getElementById('server').value;
  setVideoSource(selectedServer);
}

function setVideoSource(server) {
  if (!currentVideoId) return;

  let embedUrl = '';

  if (server.includes('vidsrc')) {
    embedUrl = `https://${server}/embed/movie?id=${currentVideoId}`;
  } else if (server.includes('videasy')) {
    embedUrl = `https://${server}/embed/${currentVideoId}`;
  }

  document.getElementById('modal-video').src = embedUrl;
}
