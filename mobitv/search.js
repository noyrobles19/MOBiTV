const API_KEYI = window.API_KIFE;

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


const allResults = document.getElementById('allResults'); 


async function searchingResults(query) {
    try {
        allResults.innerHTML = ''; 
        console.log(query);
        const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEYI}&query=${encodeURIComponent(query)}`);
        const movieData = await movieResponse.json();

        const seriesResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEYI}&query=${encodeURIComponent(query)}`);
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

         // Combine all movies & series, sorted by year (newest first)
         let combinedResults = [...movieResults, ...seriesResults].sort((a, b) => b.release_year - a.release_year);


        console.log("Final Sorted Results:", combinedResults); // Debugging

        if (combinedResults.length > 0) {
            await renderingResults(combinedResults);
        } else {
            allResults.innerHTML = `<div class="search-result-card"><p>No results found for: "${query}".</p></div>`;
        }

    } catch (error) {
        console.error('Error fetching search results:', error);
        allResults.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}

// Function to generate star ratings based on vote_average
function getStarRating(vote) {
    const stars = Math.round(vote / 2); // Convert 10-point scale to 5-star scale
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

async function renderingResults(results) {
    allResults.innerHTML = ''; // Clear previous results

    for (const item of results) {  // Fixed loop
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const resultDate = item.release_date || item.first_air_date;
        const resultYear = resultDate ? new Date(resultDate).getFullYear() : "TBA";

        let duration = "N/A";
        let mytype = '';
        
        // Ensure correct type classification
        if (item.type === 'movie') {
            try {
                const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`);
                const detailsData = await detailsResponse.json();
                duration = detailsData.runtime ? `${detailsData.runtime} min` : "TBA"; // Movie duration in minutes
                mytype = 'MOV' ;
            } catch (error) {
                console.error(`Error fetching movie details for ${item.id}:`, error);
            }
        } else if (item.type === 'series') {
            duration = "EPS"; // TV series always show "Play EPS"
            mytype = 'TV' ;
        }

        movieCard.innerHTML = `
        <div class="movie-poster">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="Movie Poster">
            <div class="overlay"></div>
            <div class="play-button"><i class="fa-solid fa-play"></i></div>
            <span class="quality-tag">
                <div class="star">${getStarRating(item.vote_average)}</div> <!-- Stars for rating -->
                <div class="rating-number">${item.vote_average}</div>
            </span>
        </div>

        <div class="movie-info">
            <h4>${item.title  || item.name}</h4>
            <span class="fdi-item">${resultYear}</span> 
            <span class="dot">•</span> 
            <span class="fdi-item">${duration}</span> 
            <span class="float-right fdi-type">${mytype}</span>
        </div>
        `;

        movieCard.onclick = () => watchNow(item.id, item.type);
        allResults.appendChild(movieCard);
    }
}



function watchNow(movieId, type) {
    document.cookie = `movieId=${movieId}; path=/`; 
    document.cookie = `movieType=${type}; path=/`;  // Set movieId in cookie
    window.location.href = "watch.html"; // Redirect to watch page
}

  

const searchQuery = getCookie('searchQuery');

if (searchQuery) {
    document.getElementById("searchResult").innerText = `You searched for: "${searchQuery}"`;
    searchingResults(searchQuery);
} else {
    document.getElementById("searchResult").innerText = "No search query found.";
}




function hideLoader() {
    // Immediately hide the loader after 1 second for smoother transition
    setTimeout(() => {
      document.getElementById('loader').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        
      }, 300); // Delay for fade-out effect
    }, 2000); // Loader visible for only 1 second
  }