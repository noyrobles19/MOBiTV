const API_KEY = window.API_KIFE;

const searchBar = document.getElementById('searchBar');  
const searchResults = document.getElementById('searchResults'); 


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
  
  // Hide search results when clicking outside search-result-card
document.addEventListener('click', (e) => {
    const isClickInsideSearch = searchBar.contains(e.target) || searchResults.contains(e.target);
    
    if (!isClickInsideSearch) {
        searchResults.innerHTML = ''; // Clear results
    }
});


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
