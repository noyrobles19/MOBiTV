const API_KEY = '4805fee141236fd075133fd593f71e48';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentItem = null; // Store currently selected movie

document.addEventListener('DOMContentLoaded', () => {
  fetchTrendingMovies();
});

// Fetch trending movies
async function fetchTrendingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
  }
}

// Display movie cards in a grid
function displayMovies(movies) {
  const container = document.getElementById('movies-list');
  container.innerHTML = '';

  movies.forEach(movie => {
    const tile = document.createElement('div');
    tile.className = 'movie-tile';

    const img = document.createElement('img');
    img.src = IMG_URL + movie.poster_path;
    img.alt = movie.title;
    img.addEventListener('click', () => showModal(movie));

    tile.appendChild(img);
    container.appendChild(tile);
  });
}

// Show modal with movie details
function showModal(movie) {
  currentItem = { ...movie, media_type: 'movie' }; // Store current movie

  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-description').textContent = movie.overview;
  document.getElementById('modal-image').src = IMG_URL + movie.poster_path;

  document.getElementById('modal').style.display = 'flex';

  changeServer(); // Set default server (vidsrc.cc)
}

// Close modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// Handle server switching
function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  const tmdbId = currentItem.id;

  let embedURL = '';

  if (server === 'vidsrc.cc') {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${tmdbId}`;
  } else if (server === 'vidsrc.me') {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${tmdbId}`;
  } else if (server === 'player.videasy.net') {
    embedURL = `https://player.videasy.net/${type}/${tmdbId}`;
  }

  const iframe = document.getElementById('modal-video');
  iframe.src = embedURL;
  iframe.style.display = 'block';
}
