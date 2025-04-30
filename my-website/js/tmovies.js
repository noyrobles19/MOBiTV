const API_KEY = '4805fee141236fd075133fd593f71e48';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

document.addEventListener('DOMContentLoaded', () => {
  loadTrendingMovies();
});

async function loadTrendingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error loading trending movies:', error);
  }
}

function displayMovies(movies) {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '';

  movies.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie-tile');
    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" />
    `;
    div.addEventListener('click', () => openModal(movie));
    grid.appendChild(div);
  });
}

async function openModal(movie) {
  document.getElementById('modal-image').src = IMG_URL + movie.poster_path;
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-description').textContent = movie.overview;
  document.getElementById('modal-rating').innerHTML = `⭐ ${movie.vote_average.toFixed(1)} / 10`;
  document.getElementById('video-error').style.display = 'none';

  try {
    const imdb = await fetch(`${BASE_URL}/movie/${movie.id}/external_ids?api_key=${API_KEY}`);
    const imdbData = await imdb.json();
    const imdbId = imdbData.imdb_id;

    if (imdbId) {
      const videoUrl = `https://vidsrc.to/embed/movie/${imdbId}`;
      const iframe = document.getElementById('modal-video');
      iframe.src = videoUrl;
      iframe.onload = () => {
        // hide error if loads
        document.getElementById('video-error').style.display = 'none';
      };
      iframe.onerror = () => {
        document.getElementById('video-error').style.display = 'block';
      };
    } else {
      throw new Error('IMDB ID not found');
    }
  } catch (err) {
    document.getElementById('modal-video').src = '';
    document.getElementById('video-error').style.display = 'block';
  }

  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}
