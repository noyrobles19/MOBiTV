const API_KEY = '4805fee141236fd075133fd593f71e48';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentItem = null;

document.addEventListener('DOMContentLoaded', async () => {
  const trendingMovies = await fetchMovies('/trending/movie/week');
  const popularMovies = await fetchMovies('/movie/popular');

  if (trendingMovies.length > 0) {
    displayBanner(trendingMovies[0]);
  }

  displayList(trendingMovies, 'movies-list');
  displayList(popularMovies, 'popular-list');
});

async function fetchMovies(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

function displayBanner(movie) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${movie.backdrop_path})`;
  document.getElementById('banner-title').textContent = movie.title;
}

function displayList(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  movies.forEach(movie => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${movie.poster_path}`;
    img.alt = movie.title;
    img.onclick = () => showDetails(movie);
    container.appendChild(img);
  });
}

function showDetails(movie) {
  currentItem = { ...movie, media_type: 'movie' };
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-description').textContent = movie.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${movie.poster_path}`;
  document.getElementById('modal').style.display = 'flex';
  changeServer();
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  const id = currentItem.id;
  let embedURL = '';

  if (server === 'vidsrc.cc') {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
  } else if (server === 'vidsrc.me') {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
  } else if (server === 'player.videasy.net') {
    embedURL = `https://player.videasy.net/${type}/${id}`;
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  if (!query.trim()) return;

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';

  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
  });
}
