const API_KEY = '4805fee141236fd075133fd593f71e48';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

document.addEventListener('DOMContentLoaded', async () => {
  const movies = await fetchTrendingMovies();
  displayMovies(movies);
});

async function fetchTrendingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

function displayMovies(movies) {
  const list = document.getElementById('movies-list');
  list.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const img = document.createElement('img');
    img.src = `${IMG_URL}${movie.poster_path}`;
    img.alt = movie.title;
    img.addEventListener('click', () => openModal(movie));

    card.appendChild(img);
    list.appendChild(card);
  });
}

function openModal(movie) {
  document.getElementById('modal-image').src = `${IMG_URL}${movie.poster_path}`;
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-description').textContent = movie.overview;
  document.getElementById('modal-rating').innerHTML = `⭐ ${movie.vote_average.toFixed(1)} / 10`;

  // Default server embed
  changeServerEmbed('vidsrc.cc', movie.id);

  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

document.getElementById('close-modal').addEventListener('click', closeModal);

function changeServer() {
  const selected = document.getElementById('server').value;
  const title = document.getElementById('modal-title').textContent;
  fetchMovieIdByTitle(title).then(id => {
    if (id) changeServerEmbed(selected, id);
  });
}

function changeServerEmbed(server, movieId) {
  const iframe = document.getElementById('modal-video');
  iframe.src = `https://${server}/embed/movie?tmdb=${movieId}`;
}

// Optional: Resolve movie ID by title if needed (for fallback)
async function fetchMovieIdByTitle(title) {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    return data.results[0]?.id;
  } catch (error) {
    console.error('Error fetching movie ID by title:', error);
    return null;
  }
}
