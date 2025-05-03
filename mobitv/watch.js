const API_KEYI = window.API_KIFE;
const MOVIE_ENDPOINTS = [
    'https://player.vidsrc.co/embed/movie/',
    'https://vidlink.pro/movie/',
    'https://vidsrc.dev/embed/movie/',
    'https://111movies.com/movie/',
    'https://vidjoy.pro/embed/movie/',
    'https://vidsrc.io/embed/movie/',
    'https://vidsrc.cc/v2/embed/movie/',
    'https://vidsrc.xyz/embed/movie/',
    'https://www.2embed.cc/embed/',
    'https://moviesapi.club/movie/'
  ]; // Additional movie endpoints
  const SERIES_ENDPOINTS = [
    'https://player.vidsrc.co/embed/tv/',
    'https://vidsrc.dev/embed/tv/',
    'https://111movies.com/tv/',
    'https://www.2embed.cc/embedtvfull/',
    'https://vidlink.pro/tv/',
    'https://vidjoy.pro/embed/tv/',
    'https://vidsrc.me/embed/tv/',
    'https://vidsrc.cc/v2/embed/tv/',
    'https://vidsrc.xyz/embed/tv/'

  ];

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
            
        }
    }
    return null;
}

// Retrieve movieId
const movieId = getCookie('movieId');
const movieType = getCookie('movieType');
const modalPlayer = document.getElementById('modal-player');
console.log("Movie ID:", movieId);
console.log("Movie Type:", movieType);

window.onload = function(){
    if (movieId && movieType) {
        if (movieType === "movie") {
            watchMovie(movieId);
        } else if (movieType === "series") {
            watchSeries(movieId);
        } else {
            console.error("Unknown movieType:", movieType);
        }
    } else {
        console.warn("No movieId or movieType found in cookies.");
        window.location.href = "index.html"
    }
    fetchTopRatedMovies();
    fetchTopRatedSeries();
};

function watchMovie(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEYI}&append_to_response=credits`)
      .then((res) => res.json())
      .then((movie) => {
        const actors = movie.credits.cast.slice(0, 10); // Get first 10 actors
        
        // Create actor carousel HTML
        const actorCarousel = `
        <div class="actor-carousel">
            ${actors.map((actor) => {
              const profileImage = actor.profile_path 
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                : 'faceless.png'; // Default image if profile_path is missing

              return `
                <div class="actor-card">
                  <img src="${profileImage}" alt="${actor.name}" class="actor-img">
                  <p class="actor-name">${actor.name}</p>
                </div>
              `;
            }).join('')}
          </div>
        `;
        const genres = movie.genres.map(g => g.name).join(', ') || 'N/A';
        const countries = movie.production_countries.map(c => c.name).join(', ') || 'N/A';
        const imdbRating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  
        // Update modal content
        modalPlayer.innerHTML = `
          <div id="path"><span><a href="home.html">Home</a>  / <a href="movies.html">Movies</a> / ${movie.title}</span></div>
            <!-- Server Switch Message with Notification Icon -->
          <div class="alert mb-3" style="background: rgb(255, 170, 0); font-size: 16px; font-weight: 600;" bis_skin_checked="1">If you get any error message when trying to stream, please Refresh the page or switch to another streaming server.</div>
          <iframe src="${MOVIE_ENDPOINTS[0]}${movieId}" frameborder="0" allowfullscreen id="movie-player"></iframe>
          <div id="mediaOption">
            <div class="column">
              <div style="margin-left: 15px;margin-right: 15px;">
                <h3>Select Server</h3>
                <select id="server-select" class="server-select">
                  ${MOVIE_ENDPOINTS.map((endpoint, index) => `<option value="${endpoint}">Server ${index + 1}</option>`).join('')}
                </select>
                <div id="server-switch-message" class="server-switch-message">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>Please switch to other servers if default server doesn't work.</span>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="sub-col">
                <span id="wtcBtn" onclick="downloadNow()">WATCH NOW</span>
                <span id="dlBtn" onclick="downloadNow()">DOWNLOAD HERE</span>
              </div>
            </div>
          </div>
          
          <br>
          <div id="m-info" class="cont-bg">
            <div>
              <div class="poster">
                <img style="width: 100%; height:290px;" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
              </div>
              <div class="film-info"> 
                <div>
                  <h1 style="margin-bottom:10px;margin-top: 5px;">${movie.title}</h1>
                </div>
                <div style="margin-top:-10px">
                  <div>
                    <p>${movie.overview}</p>
                  </div>
                </div>
                <div class="meta">
                  <div class="col1">
                    <div>
                      <span><strong>Release Date:</strong></span> ${movie.release_date}
                    </div>
                    <div>
                      <span><strong>Genre:</strong></span> ${genres}
                    </div>
                    <div>
                      <span><strong>IMDb Rating:</strong></span> ${imdbRating}
                    </div>
                  </div>
                  <div class="col2">
                    <div>
                      <span><strong>Duration:</strong></span> ${movie.runtime ? movie.runtime + ' mins' : 'N/A'}
                    </div>
                    <div>
                      <span><strong>Country:</strong></span> ${countries}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="casts">
              <h3>Casts</h3>
              <div id="carou-casts">
              ${actorCarousel}
              </div>
            </div>
            
          </div>
        `;
  
        const serverSelect = document.getElementById('server-select');
        const moviePlayer = document.getElementById('movie-player');
  
        serverSelect.addEventListener('change', () => {
          const selectedServer = serverSelect.value;
          moviePlayer.src = `${selectedServer}${movieId}`;
        });
        
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
      });
  }

  function watchSeries(seriesId) {
    modalPlayer.innerHTML = `
      <div id="path"><span><a href="home.html">Home</a> / <a href="series.html">Series</a> / </span><span id="series-name"></span></div>
      <div class="alert mb-3" style="background: rgb(255, 170, 0); font-size: 16px; font-weight: 600;">If you get any error message when trying to stream, please Refresh the page or switch to another streaming server.</div>
      
      <div id="player-container" class="player-container">
        <iframe src="" frameborder="0" allowfullscreen id="episode-player"></iframe>
      </div>
      
      <div id="season-dropdown-container" class="season-dropdown-container cont-bg">
        <div style="text-align:left">
          <select id="season-select" class="season-select"></select>
        </div>
        <div id="episode-list" class="episode-list"></div>
      </div>
  
      <div id="mediaOption">
        <div class="column">
          <h3>Select Server</h3>
          <select id="server-select" class="server-select">
            ${SERIES_ENDPOINTS.map((endpoint, index) => `<option value="${endpoint}">Server ${index + 1}</option>`).join('')}
          </select>
          <div id="server-switch-message" class="server-switch-message">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Please switch to other servers if default server doesn't work.</span>
          </div>
        </div>
        <div class="column">
          <div class="sub-col">
            <span id="wtcBtn" onclick="downloadNow()">WATCH NOW</span>
            <span id="dlBtn" onclick="downloadNow()">DOWNLOAD HERE</span>
          </div>
        </div>
      </div>

      <div id="m-info" class="cont-bg">
        <div id="myDetails"></div>
        <div class="casts">
          <h3>Cast</h3>
          <div id="carou-casts" class="actor-carousel"></div>
        </div>
      </div>
    `;

    const seasonSelect = document.getElementById('season-select');
    const serverSelect = document.getElementById('server-select');
    const actorCarousel = document.getElementById('carou-casts');
    const mdetails = document.getElementById('myDetails');

    fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&append_to_response=credits`)
      .then((res) => res.json())
      .then((data) => {
        document.getElementById('series-name').textContent = data.name;
        
        data.seasons.forEach((season) => {
          const option = document.createElement('option');
          option.value = season.season_number;
          option.textContent = season.name;
          seasonSelect.appendChild(option);
        });

        const firstEpisodeYear = data.first_air_date ? new Date(data.first_air_date).getFullYear() : "N/A";
        const genres = data.genres.map(g => g.name).join(', ') || 'N/A';
        const episodeDuration = data.episode_run_time.length > 0 ? `${data.episode_run_time[0]} mins/ep` : 'N/A';
        const countries = data.production_countries.map(c => c.name).join(', ') || 'N/A';
        const imdbRating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';

        mdetails.innerHTML = `
          <div class="poster">
            <img style="width: 100%; height:290px;" src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="${data.name}" class="movie-image">
          </div>
          <div class="film-info"> 
            <div>
              <h1 id="series-title" style="margin-bottom:10px;margin-top: 5px;">${data.name}</h1>
            </div>
            <div style="margin-top:-10px; min-height: 100px;">
              <p>${data.overview}</p>
            </div>
            <div class="meta">
                  <div class="col1">
                    <div>
                      <span><strong>Release Date:</strong></span> ${firstEpisodeYear}
                    </div>
                    <div>
                      <span><strong>Genre:</strong></span> ${genres}
                    </div>
                    <div>
                      <span><strong>IMDb Rating:</strong></span> ${imdbRating}
                    </div>
                  </div>
                  <div class="col2">
                    <div>
                      <span><strong>Duration:</strong></span> ${episodeDuration}
                    </div>
                    <div>
                      <span><strong>Country:</strong></span> ${countries}
                    </div>
                  </div>
                </div>
              </div>
        `;

        // Fetch actors and display the carousel
        const actors = data.credits.cast.slice(0, 10); // Get top 10 actors
        console.log(actors);// Get top 10 actors
        if (actors.length === 0) {
            actorCarousel.innerHTML = `<p class="not-available">Not Available</p>`;
        } else {
            actorCarousel.innerHTML = actors.map((actor) => {
            const profileImage = actor.profile_path 
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                : 'faceless.png'; // Use fallback image if profile_path is missing
            
            return `
                <div class="actor-card">
                <img src="${profileImage}" alt="${actor.name}" class="actor-img">
                <p class="actor-name">${actor.name}</p>
                </div>
            `;
            }).join('');
        }    

        seasonSelect.addEventListener('change', () => fetchEpisodes(seriesId, seasonSelect.value));
        fetchEpisodes(seriesId, data.seasons[0].season_number);
      });

    serverSelect.addEventListener('change', () => {
      const iframe = document.getElementById('episode-player');
      const activeEpisode = document.querySelector('.episode-item.active');

      if (activeEpisode) {
        const episodeNumber = activeEpisode.dataset.episodeNumber;
        const seasonNumber = seasonSelect.value;
        iframe.src = `${serverSelect.value}${seriesId}/${seasonNumber}/${episodeNumber}`;
      }
    });
}

function fetchEpisodes(seriesId, seasonNumber) {
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = ''; 

    fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        data.episodes.forEach((episode, index) => {
          const episodeItem = document.createElement('div');
          episodeItem.className = 'episode-item';
          episodeItem.dataset.episodeNumber = episode.episode_number;

          if (index === 0) {
            episodeItem.classList.add('active');
          }

          episodeItem.innerHTML = `
            <div class="episode-details" id="ep${episode.episode_number}" title="${episode.name}">
              ${episode.episode_number}
            </div>
          `;

          episodeList.appendChild(episodeItem);
        });

        episodeList.addEventListener('click', (event) => {
          const selectedEpisode = event.target.closest('.episode-item');
          if (!selectedEpisode) return;

          const episodeNumber = selectedEpisode.dataset.episodeNumber;
          if (!episodeNumber) return;

          playEpisode(seriesId, seasonNumber, episodeNumber);

          document.querySelectorAll('.episode-item').forEach(item => item.classList.remove('active'));
          selectedEpisode.classList.add('active');
        });
      })
      .catch(error => console.error("Error fetching episodes:", error));
}

function playEpisode(seriesId, seasonNumber, episodeNumber) {
    const serverSelect = document.getElementById('server-select');
    const iframe = document.getElementById('episode-player');

    if (serverSelect && serverSelect.value) {
        iframe.src = `${serverSelect.value}${seriesId}/${seasonNumber}/${episodeNumber}`;
    }

    const playerContainer = document.getElementById('player-container');
    playerContainer.classList.remove('hidden');
}



  async function fetchTopRatedMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
      );
      const data = await response.json();
  
      const movieUl = document.getElementById("top-movies");
      movieUl.innerHTML = ""; // Clear existing movies (if any)
  
      data.results.slice(0, 10).forEach((movie, index) => {
        if (!movie.poster_path) return; // Skip movies without a poster
  
        const movieLi = document.createElement("li");
        movieLi.className = "movie-li";
  
        // Create star rating system for top-rated movies
        const starRating = getStarRating(movie.vote_average);
  
        movieLi.innerHTML = `
          <div class="movielister">
            <span class="rank-number">${index + 1}</span>
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
            <div class="c-info">
              <div class="c-title">${movie.title}</div>
              <div class="stars">${starRating} <span class="rating-number">${movie.vote_average.toFixed(1)}</span></div>

            </div>
          </div>
        `;
        movieLi.onclick = () => watchNow(movie.id, 'movie');
        movieUl.appendChild(movieLi);
      });
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
    }
  }

  async function fetchTopRatedSeries() {
    try{
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&first_air_date.gte=2023-01-01`);
    const data = await response.json();
  
    const seriesUl = document.getElementById("top-series");
      seriesUl.innerHTML = ""; // Clear existing movies (if any)
  
      data.results.slice(0, 10).forEach((series, index) => {
        if (!series.poster_path) return; // Skip movies without a poster
  
        const seriesLi = document.createElement("li");
        seriesLi.className = "movie-li";
  
        // Create star rating system for top-rated movies
        const starRating = getStarRating(series.vote_average);
  
        seriesLi.innerHTML = `
          <div class="movielister">
            <span class="rank-number">${index + 1}</span>
            <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.title}" class="movie-image">
            <div class="c-info">
              <div class="c-title">${series.name}</div>
              <div class="stars">${starRating} <span class="rating-number">${series.vote_average.toFixed(1)}</span></div>

            </div>
          </div>
        `;
        seriesLi.onclick = () => watchNow(series.id, 'series');
        seriesUl.appendChild(seriesLi);
      });
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
    }
  }

function getStarRating(vote) {
    const stars = Math.round(vote / 2); // Convert 10-point scale to 5-star scale
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.cont').forEach(tab => {
      tab.addEventListener('click', function(event) {
          selectTab(event, this.id === 'TopMovies' ? 'topMov' : 'topSer');
      });
  });
});

function selectTab(event, tabId) {
  // Remove 'selected' from all content sections
  document.querySelectorAll('.sel').forEach(content => {
      content.classList.remove('selected');
  });

  // Add 'selected' to the chosen tab content
  document.getElementById(tabId).classList.add('selected');

  // Remove 'actived' from all tabs
  document.querySelectorAll('.cont').forEach(tab => {
      tab.classList.remove('actived');
  });

  // Add 'actived' class to the clicked tab
  event.target.classList.add('actived');
}

function watchNow(movieId, type) {
  document.cookie = `movieId=${movieId}; path=/`; 
  document.cookie = `movieType=${type}; path=/`;  // Set movieId in cookie
  window.location.href = "watch.html"; // Redirect to watch page
}