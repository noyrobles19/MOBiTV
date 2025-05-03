
const API_KEY = window.API_KIFE;

const seriesGrid = document.getElementById('series-grid');
const pseriesGrid = document.getElementById('kseries-grid');
const genreList = document.getElementById('genre-list');
const searchBar = document.getElementById('searchBar');  
const searchResults = document.getElementById('searchResults');
const searchB = document.getElementById('searchBar-cont');
const searchY = document.getElementById('searchy');

searchY.onclick = () => {
  document.getElementById('searchBar').classList.toggle('expanded');
};

//HOME >>>>>>>>>>>>>>>>>>>>>>>>>
//TRENDING
async function fetchMovies() {
  //const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`);
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
  const data = await response.json();
  
  data.results.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    
    // Create star rating system based on movie vote_average
    const starRating = getStarRating(movie.vote_average);
    
    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
        <div class="rating-container">
          <div class="star">${starRating}</div> <!-- Stars for rating -->
          <div class="rating-number"> ${movie.vote_average.toFixed(1)}</div> <!-- Numeric score -->
        </div>
      </div>
    `;
    
    movieCard.onclick = () => watchNow(movie.id, 'movie');
    movieGrid.appendChild(movieCard);
  });
}

async function fetchSeries() {
  //const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`);
  const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`);
  const data = await response.json();

  seriesGrid.innerHTML = ''; // Clear previous content

  data.results.forEach((series) => {
    const seriesCard = document.createElement('div');
    seriesCard.className = 'series-card';
    
    // Create star rating system based on series vote_average
    const starRating = getStarRating(series.vote_average);

    seriesCard.innerHTML = `
      <div class="series-poster">
        <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="series-image">
        <div class="rating-container">
          <div class="star">${starRating}</div>
          <div class="rating-number"> ${series.vote_average}</div>
        </div>
      </div>
    `;

    seriesCard.onclick = () => watchNow(series.id, 'series');
    seriesGrid.appendChild(seriesCard);
  });
}

async function fetchPopularMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();

    if (!data.results) throw new Error("No results found");

    let filteredMovies = data.results.filter(movie => movie.poster_path !== null);

    // Fetch more pages if we don't have 20 valid movies
    let page = 2;
    while (filteredMovies.length < 20) {
      const moreResponse = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
      const moreData = await moreResponse.json();

      if (!moreData.results.length) break; // Stop if no more movies

      filteredMovies = [...filteredMovies, ...moreData.results.filter(movie => movie.poster_path !== null)];
      page++;
    }

    // Ensure only 20 movies are displayed
    filteredMovies = filteredMovies.slice(0, 20);

    filteredMovies.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      // Generate star rating
      const starRating = getStarRating(movie.vote_average);

      movieCard.innerHTML = `
        <div class="movie-poster">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
          <div class="rating-container">
            <div class="star">${starRating}</div> <!-- Stars for rating -->
            <div class="rating-number">${movie.vote_average.toFixed(1)}</div> <!-- Numeric score -->
          </div>
        </div>
      `;

      movieCard.onclick = () => watchNow(movie.id, 'movie');
      pmovieGrid.appendChild(movieCard);
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

async function fetchTrendingKseries() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=ko&with_genres=18&page=1`);
    const data = await response.json();

    if (!data.results) throw new Error("No results found");

    let filteredSeries = data.results.filter(series => series.poster_path !== null);

    // Fetch more pages if we don't have 20 valid series
    let page = 2;
    while (filteredSeries.length < 20) {
      const moreResponse = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=ko&with_genres=18&page=${page}`);
      const moreData = await moreResponse.json();

      if (!moreData.results.length) break; // Stop if no more series are available

      filteredSeries = [...filteredSeries, ...moreData.results.filter(series => series.poster_path !== null)];
      page++;
    }

    // Ensure only 20 series are displayed
    filteredSeries = filteredSeries.slice(0, 20);

    filteredSeries.forEach((series) => {
      const seriesCard = document.createElement('div');
      seriesCard.className = 'series-card';

      // Generate star rating
      const starRating = getStarRating(series.vote_average);

      seriesCard.innerHTML = `
        <div class="series-poster">
          <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="series-image">
          <div class="rating-container">
            <div class="star">${starRating}</div> <!-- Stars for rating -->
            <div class="rating-number">${series.vote_average.toFixed(1)}</div> <!-- Numeric score -->
          </div>
        </div>
      `;

      seriesCard.onclick = () => watchNow(series.id, 'series');
      pseriesGrid.appendChild(seriesCard);
    });
  } catch (error) {
    console.error("Error fetching popular series:", error);
  }
}

//UPCOMING
async function fetchUpcomingMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=2025-01-01&sort_by=first_air_date.asc&page=1`);
    const data = await response.json();

    if (!data.results) throw new Error("No results found");

    let filteredSeries = data.results.filter(series => series.poster_path !== null);

    // Fetch more pages if we don't have 20 valid series
    let page = 2;
    while (filteredSeries.length < 20) {
      const moreResponse = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=2025-01-01&sort_by=first_air_date.asc&page=${page}`);
      const moreData = await moreResponse.json();

      if (!moreData.results.length) break; // Stop if no more series are available

      filteredSeries = [...filteredSeries, ...moreData.results.filter(series => series.poster_path !== null)];
      page++;
    }

    // Ensure only 20 series are displayed
    filteredSeries = filteredSeries.slice(0, 20);
    const upcomingGrid = document.getElementById('upcoming-movies-grid');
    upcomingGrid.innerHTML = '';
    filteredSeries.forEach((series) => {
      const seriesCard = document.createElement('div');
      seriesCard.className = 'series-card';

      // Generate star rating
      const starRating = getStarRating(series.vote_average);

      seriesCard.innerHTML = `
        <div class="series-poster">
          <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="series-image">
          <div class="rating-container">
            <div class="star">${starRating}</div> <!-- Stars for rating -->
            <div class="rating-number">${series.vote_average.toFixed(1)}</div> <!-- Numeric score -->
          </div>
        </div>
      `;

      seriesCard.onclick = () => watchNow(series.id, 'series');
      upcomingGrid.appendChild(seriesCard);
    });
  } catch (error) {
    console.error("Error fetching popular series:", error);
  }
}

//HOME END >>>>>>>>>>>>>>>>>>>>

// Function to generate star ratings based on vote_average
function getStarRating(vote) {
  const stars = Math.round(vote / 2); // Convert 10-point scale to 5-star scale
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}
  
async function fetchTopAiringMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`);
    const data = await response.json();
  
    const movieGrid = document.getElementById('top-airing-movie-grid');
    movieGrid.innerHTML = ''; // Clear existing movies (if any)
  
    data.results.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      
      // Create star rating system for top airing movies
      const starRating = getStarRating(movie.vote_average);
      
      movieCard.innerHTML = `
        <div class="movie-poster">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie-image">
          <div class="rating-container">
            <div class="stars">${starRating}</div>
            <div class="rating-number">${movie.vote_average}</div>
          </div>
        </div>
      `;
      
      movieCard.onclick = () => watchNow(movie.id, 'movie');
      movieGrid.appendChild(movieCard);
    });
  }  

// This function can open a modal or display movie details based on its ID

// Call the function to fetch movies when the page loads
fetchTopAiringMovies();
  
  // Function to fetch and display Top Airing TV Shows
  async function fetchTopAiringSeries() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`);
  
      if (!response.ok) {
        throw new Error('Error fetching top airing TV shows: ' + response.statusText);
      }
  
      const data = await response.json();
      const airingGrid = document.getElementById('airing-grid');
      airingGrid.innerHTML = ''; // Clear previous results
  
      data.results.forEach((series) => {
        const seriesCard = document.createElement('div');
        seriesCard.className = 'series-card';
  
        // Create star rating system for airing series
        const starRating = getStarRating(series.vote_average);
  
        seriesCard.innerHTML = `
          <div class="series-poster">
            <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="series-image">
            <div class="rating-container">
              <div class="stars">${starRating}</div>
              <div class="rating-number">${series.vote_average}</div>
            </div>
          </div>
        `;
  
        seriesCard.onclick = () => openSeriesModal(series.id);
        airingGrid.appendChild(seriesCard);
      });
    } catch (error) {
      console.error('Error fetching top airing TV shows:', error);
    }
  }
  
  // Function to fetch and display Most Watched TV Shows (Trending TV Shows)
  async function fetchMostWatchedSeries() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=en-US`);
  
      if (!response.ok) {
        throw new Error('Error fetching trending TV shows: ' + response.statusText);
      }
  
      const data = await response.json();
      const mostWatchedGrid = document.getElementById('most-watched-grid');
      mostWatchedGrid.innerHTML = ''; // Clear previous results
  
      data.results.forEach((series) => {
        const seriesCard = document.createElement('div');
        seriesCard.className = 'series-card';
  
        // Create star rating system for trending series
        const starRating = getStarRating(series.vote_average);
  
        seriesCard.innerHTML = `
          <div class="series-poster">
            <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="series-image">
            <div class="rating-container">
              <div class="stars">${starRating}</div>
              <div class="rating-number">${series.vote_average}</div>
            </div>
          </div>
        `;
  
        seriesCard.onclick = () => watchNow(series.id, 'series');
        mostWatchedGrid.appendChild(seriesCard);
      });
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
    }
  }

// Function to handle the modal (optional)
// You can implement this to show more details about the series when clicked
// Call the functions to load the data when the page loads
fetchTopAiringSeries();
fetchMostWatchedSeries();

async function searchMoviesAndSeries(query) {
  try {
      searchResults.innerHTML = ''; 
      console.log(query);
      const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const movieData = await movieResponse.json();

      const seriesResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const seriesData = await seriesResponse.json();

      // Assign explicit type to each result
      let movieResults = movieData.results.map(item => ({
          ...item,
          type: 'movie',
          release_year: item.release_date ? new Date(item.release_date).getFullYear() : 0
      })).filter(item => item.poster_path);

      let seriesResults = seriesData.results.map(item => ({
          ...item,
          type: 'series',
          release_year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0
      })).filter(item => item.poster_path);

      // Sort by release year (newest first)
      movieResults.sort((a, b) => b.release_year - a.release_year);
      seriesResults.sort((a, b) => b.release_year - a.release_year);

      // Pick 3 newest movies & 3 newest series
      let selectedMovies = movieResults.slice(0, 3);
      let selectedSeries = seriesResults.slice(0, 3);

      // If not enough series, fill with movies (total max 6)
      if (selectedSeries.length < 3) {
          selectedMovies = movieResults.slice(0, 6 - selectedSeries.length);
      }

      // If not enough movies, fill with series (total max 6)
      if (selectedMovies.length < 3) {
          selectedSeries = seriesResults.slice(0, 6 - selectedMovies.length);
      }

      // Combine movies & series, sorted by year (newest first)
      let combinedResults = [...selectedMovies, ...selectedSeries].sort((a, b) => b.release_year - a.release_year);

      console.log("Final Sorted Results:", combinedResults); // Debugging

      if (combinedResults.length > 0) {
          await renderSearchResults(combinedResults);
      } else {
          searchResults.innerHTML = `<div class="search-result-card"><p>No results found for: "${query}".</p></div>`;
      }

  } catch (error) {
      console.error('Error fetching search results:', error);
      searchResults.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

async function renderSearchResults(results) {
  searchResults.innerHTML = ''; 

  for (const [index, item] of results.entries()) {
      const resultCard = document.createElement('div');
      resultCard.className = 'search-result-card';

      const resultDate = item.release_date || item.first_air_date;
      const resultYear = resultDate ? new Date(resultDate).getFullYear() : "TBA";

      let duration = "Unknown";
      
      // Ensure correct type classification
      if (item.type === 'movie') {
          try {
              const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`);
              const detailsData = await detailsResponse.json();
              duration = detailsData.runtime ? `${detailsData.runtime} min` : "TBA"; // Movie duration in minutes
          } catch (error) {
              console.error(`Error fetching movie details for ${item.id}:`, error);
          }
      } else if (item.type === 'series') {
          duration = "EPS"; // TV series always show "Play EPS"
      }

      // Ensure type is displayed correctly
      const formattedType = item.type === 'movie' ? 'Movie' : 'TV Series';

      resultCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title || item.name}">
          <div>
              <h3>
                  ${item.title || item.name}
              </h3>
              <span class="searchDate">${resultYear}</span>
              <span> • </span>
              <span class="searchDuration">${duration}</span>
              <span> • </span>
              <span class="searchType">${formattedType}</span>
          </div>
      `;

      resultCard.style.animationDelay = `${index * 0.1}s`;

      // Remove any click event on the result card itself
      resultCard.onclick = () => watchNow(item.id, item.type);

      searchResults.appendChild(resultCard);
  }
}

function watchNow(movieId, type){
  document.cookie = `movieId=${movieId}; path=/`; 
  document.cookie = `movieType=${type}; path=/`;  // Set movieId in cookie
  window.location.href = "watch.html";
}

searchBar.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  searchResults.innerHTML = ''; 
  if (query) {
    searchMoviesAndSeries(query); 
  } else {
    searchResults.innerHTML = '';
  }
});


let currentIndex = 0;
let spotlightList = [];
const contentElement = document.getElementById("spot-details");

async function fetchSpotlightMoviesAndSeries() {
  try {
    // Fetching top-rated series and upcoming movies (or any other criteria you prefer)
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`);
    const moviesResponse = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);

    const seriesData = await seriesResponse.json();
    const moviesData = await moviesResponse.json();

    // Combine series and movies into one list
    spotlightList = [...seriesData.results, ...moviesData.results];

  // Remove 'show' class to restart animation
    contentElement.classList.remove("show");

    // Shuffle the list
    shuffleArray(spotlightList);
    fadeIn(contentElement);
    // Call to initially update spotlight content
    updateSpotlightContent();
    
    // Start automatic switching
    setInterval(() => {
      fadeOut(contentElement, () => {
        showNextSpotlight();
        fadeIn(contentElement);
      });
    }, 10000);
  } catch (error) {
    console.error('Error fetching spotlight content:', error);
  }
}

function fadeOut(element, callback) {
  element.classList.remove("show");
  setTimeout(callback, 500); // Wait for fade-out before changing content
}

function fadeIn(element) {
  setTimeout(() => {
    element.classList.add("show");
  }, 50); // Small delay to trigger CSS transition
}
// Shuffle function to randomize the order of the spotlight list
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

function updateSpotlightContent() {
  if (spotlightList.length > 0) {
    const spotlight = document.getElementById('spotlight');
    const spotlightTitle = document.getElementById('spotlight-title');
    const spotlightRating = document.getElementById('spotlight-rating');
    const spotlightReleaseDate = document.getElementById('spotlight-release-date');
    const spotlightDescription = document.getElementById('spotlight-description');
    const spotlightButton = document.getElementById('spotlight-button');
    const spotlightmediaType = document.getElementById('spotlight-mediatype');

    const currentSpotlight = spotlightList[currentIndex];
    const releaseDate = currentSpotlight.release_date || currentSpotlight.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "TBA";

    // Set title, release date, and rating
    const formattedRating = currentSpotlight.vote_average ? currentSpotlight.vote_average.toFixed(2) : "N/A";
    spotlightTitle.textContent = currentSpotlight.title || currentSpotlight.name;
    spotlightRating.textContent = `IMDb: ${formattedRating}`;
    spotlightReleaseDate.textContent = `${releaseYear}`;

    //Media Type
    const mediaType = currentSpotlight.title ? "Movie" : "Series";
    spotlightmediaType.textContent = mediaType;
    const fullDescription = currentSpotlight.overview || "No description available.";
    const truncatedDescription = fullDescription.length > 200 ? fullDescription.substring(0, 200) + '...' : fullDescription;

    // Show only the truncated description without the See More/See Less button
    spotlightDescription.textContent = truncatedDescription;

    // Keep the "Watch Now" button visible and functional
    spotlightButton.style.display = 'inline-block';  // Make sure the Watch Now button is visible
    
    spotlightButton.onclick = () => {
      if (currentSpotlight.id) {
        // Open movie or series modal based on type
        if (currentSpotlight.title) {
          watchNow(currentSpotlight.id, mediaType.toLowerCase());
        } else {
          watchNow(currentSpotlight.id, mediaType.toLowerCase());
        }
      }
    };

    // Set the background image for spotlight
    const backdropUrl = `https://image.tmdb.org/t/p/w1280/${currentSpotlight.backdrop_path || currentSpotlight.poster_path}`;
    spotlight.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${backdropUrl})`;
  }
}

function showNextSpotlight() {
  currentIndex = (currentIndex + 1) % spotlightList.length;
  updateSpotlightContent();
}

window.onload = () => {
  fetchSpotlightMoviesAndSeries(); // Fetch movies and series for spotlight
};


/// Fetch and display general Animation TV Shows
async function fetchAnimationTVShows() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16`);
  
      if (!response.ok) {
        throw new Error('Error fetching animation TV shows: ' + response.statusText);
      }
  
      const data = await response.json();
      const animationGrid = document.getElementById('animation-tv-shows-grid');
      animationGrid.innerHTML = ''; // Clear previous results
  
      if (data.results.length > 0) {
        data.results.forEach((series) => {
          const seriesCard = document.createElement('div');
          seriesCard.className = 'movie-card';
  
          // Generate star rating based on series vote_average
          const starRating = getStarRating(series.vote_average);
  
          seriesCard.innerHTML = `
            <div class="movie-poster">
              <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="movie-image">
              <div class="rating-container">
                <div class="stars">${starRating}</div>
                <div class="rating-number">${series.vote_average}</div>
              </div>
            </div>
          `;
  
          seriesCard.onclick = () => openSeriesModal(series.id); // Implement modal for series details
          animationGrid.appendChild(seriesCard);
        });
      } else {
        animationGrid.innerHTML = '<p>No animation TV shows available.</p>';
      }
    } catch (error) {
      console.error('Error fetching Animation TV shows:', error);
    }
  }
  
  // Function to fetch and display Top Rated Sci-Fi Animation TV Shows
  async function fetchTopRatedAnimations() {
    try {
      // Fetching top-rated Sci-Fi Animation TV shows (combining genres 16 for Animation and 10765 for Sci-Fi)
      const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16,10765&sort_by=vote_average.desc&language=en-US`);
      
      if (!response.ok) {
        throw new Error('Error fetching Sci-Fi Animation TV shows: ' + response.statusText);
      }
  
      const data = await response.json();
      const animationGrid = document.getElementById('top-rated-grid');
      animationGrid.innerHTML = ''; // Clear previous results
  
      if (data.results.length > 0) {
        data.results.forEach((series) => {
          const seriesCard = document.createElement('div');
          seriesCard.className = 'movie-card';
  
          // Generate star rating based on series vote_average
          const starRating = getStarRating(series.vote_average);
  
          seriesCard.innerHTML = `
            <div class="movie-poster">
              <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="movie-image">
              <div class="rating-container">
                <div class="stars">${starRating}</div>
                <div class="rating-number">${series.vote_average}</div>
              </div>
            </div>
          `;
  
          seriesCard.onclick = () => openSeriesModal(series.id); // Open modal on click
          animationGrid.appendChild(seriesCard);
        });
      } else {
        animationGrid.innerHTML = '<p>No top-rated Sci-Fi Animation TV shows available.</p>';
      }
    } catch (error) {
      console.error('Error fetching Sci-Fi Animation TV shows:', error);
    }
  }
  
  // Function to fetch and display Airing Today Animation TV Shows
  async function fetchTopAiringAnimations() {
    try {
      // Fetching airing today animation TV shows (genre 16 for Animation)
      const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16&air_date.gte=${new Date().toISOString().split('T')[0]}&language=en-US`);
  
      if (!response.ok) {
        throw new Error('Error fetching animation TV shows: ' + response.statusText);
      }
  
      const data = await response.json();
      const animationGrid = document.getElementById('top-airing-grid');
      animationGrid.innerHTML = ''; // Clear previous results
  
      if (data.results.length > 0) {
        data.results.forEach((series) => {
          const seriesCard = document.createElement('div');
          seriesCard.className = 'movie-card';
  
          // Generate star rating based on series vote_average
          const starRating = getStarRating(series.vote_average);
  
          seriesCard.innerHTML = `
            <div class="movie-poster">
              <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="movie-image">
              <div class="rating-container">
                <div class="star">${starRating}</div>
                <div class="rating-number">${series.vote_average}</div>
              </div>
            </div>
          `;
  
          seriesCard.onclick = () => watchNow(series.id, 'series'); // You can implement this modal logic
          animationGrid.appendChild(seriesCard);
        });
      } else {
        animationGrid.innerHTML = '<p>No animation TV shows available.</p>';
      }
    } catch (error) {
      console.error('Error fetching Animation TV shows:', error);
    }
  }
  
  // Helper function to generate star ratings based on the vote_average
  // function getStarRating(voteAverage) {
  //   const fullStars = Math.floor(voteAverage / 2);
  //   const emptyStars = 5 - fullStars;
    
  //   let stars = '';
    
  //   for (let i = 0; i < fullStars; i++) {
  //     stars += '<span class="star full">★</span>';
  //   }
    
  //   for (let i = 0; i < emptyStars; i++) {
  //     stars += '<span class="star empty">★</span>';
  //   }
    
  //   return stars;
  // }

// document.addEventListener('contextmenu', function(event) {
//   event.preventDefault();
// });

// document.addEventListener('keydown', function(event) {
//   if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
//       event.preventDefault();
//   }
// });

// SEARCH ALL RESULTS
function handleSearch() {
  const searching = searchBar.value.trim();
  
  if (searching !== "") {
      document.cookie = `searchQuery=${encodeURIComponent(searching)}; path=/; SameSite=Lax`;
      window.location.href = "search.html";
  }
};

searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      handleSearch(); // Trigger function on Enter key press
  }
});


document.getElementById('hamburger-menu').addEventListener('click', function() {
  const navbarLinks = document.getElementById('navbar-links');
  navbarLinks.classList.toggle('active'); // Toggle the active class to show/hide menu
});

function hideLoader() {
  // Immediately hide the loader after 1 second for smoother transition
  setTimeout(() => {
    document.getElementById('loader').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
    }, 300); // Delay for fade-out effect
  }, 2000); // Loader visible for only 1 second
}

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // ✅ Read dark mode preference from localStorage
  const isDarkMode = localStorage.getItem("dark-mode") === "true";

  // ✅ Apply dark mode immediately if stored preference is true
  if (isDarkMode) {
      body.classList.add("dark-mode");
      if (darkModeToggle) {
          darkModeToggle.checked = true;
      }
  }

  // ✅ Event listener for toggling dark mode
  if (darkModeToggle) {
      darkModeToggle.addEventListener("change", function () {
          if (this.checked) {
              body.classList.add("dark-mode");
              localStorage.setItem("dark-mode", "true");
          } else {
              body.classList.remove("dark-mode");
              localStorage.setItem("dark-mode", "false");
          }
      });
  }
});
console.log(localStorage.getItem("dark-mode"));

//FOR TABBING Movie & Series
function switchTab(tabId, containerId) {
  const container = document.getElementById(containerId); // Scope to specific container

  // Remove 'active' class from all contents inside this container
  container.querySelectorAll('.content').forEach(content => {
      content.classList.remove('active');
  });

  // Activate the selected content
  container.querySelector(`#${tabId}`).classList.add('active');

  // Remove 'active' class from all tabs inside this container
  container.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
  });

  // Activate the clicked tab
  event.target.classList.add('active');
}


window.onload = () => {
  fetchSpotlightMoviesAndSeries();
  fetchSeries();
  fetchUpcomingMovies();
  fetchTopAiringAnimations()
  fetchTrendingKseries();
  hideLoader();
};
