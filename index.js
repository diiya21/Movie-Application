const POPULAR_API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=5b538011b97521df1803976b401dbfa9';
const TOP_RATED_API_URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=5b538011b97521df1803976b401dbfa9';
const UPCOMING_API_URL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=5b538011b97521df1803976b401dbfa9';

let popularMovieInfo = [];
let topRatedMovieInfo = [];
let upcomingMovieInfo = [];

const movieContainer = document.getElementById('movie-container');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

async function getMovieInfo(apiURL, movieInfoArray) {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        movieInfoArray.push(...data.results);
    } catch(error) {
        console.log('There was an error fetching data:', error);
    }
}

Promise.all([
    getMovieInfo(POPULAR_API_URL, popularMovieInfo),
    getMovieInfo(TOP_RATED_API_URL, topRatedMovieInfo),
    getMovieInfo(UPCOMING_API_URL, upcomingMovieInfo)
]).then(() => {
    console.log('Popular Movies:', popularMovieInfo);
    console.log('Top Rated Movies:', topRatedMovieInfo);
    console.log('Upcoming Movies:', upcomingMovieInfo);
    
    generateAllTiles();
});

function createMovieTile(movie) {
    const tile = document.createElement('div');
    tile.classList.add('movie-tile');

    const imageUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : 'https://via.placeholder.com/1920x1080';
    const title = movie.title;
    const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
    const description = movie.overview ? movie.overview : 'No description available';
    const genres = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A';

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = title;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const yearElement = document.createElement('p');
    yearElement.textContent = `Year: ${year}`;

    const genresElement = document.createElement('p');
    genresElement.textContent = `Genres: ${genres}`;

    const truncatedDescription = truncateDescription(description, 100);

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('description');
    descriptionElement.textContent = truncatedDescription;

    tile.appendChild(image);
    tile.appendChild(titleElement);
    tile.appendChild(yearElement);
    tile.appendChild(descriptionElement);
    tile.appendChild(genresElement);

    tile.addEventListener('click', () => {
        showModal(title, description);
        expandTile(tile);
    });

    return tile;
}

function showModal(title, description) {
    modalContent.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="modal-close" onclick="hideModal()">&times;</button>
    `;
    modalOverlay.style.display = 'flex';
}

function hideModal() {
    modalOverlay.style.display = 'none';
}

function generateAllTiles() {
    const popularMoviesContainer = document.getElementById('popular-movies-container');
    const topRatedMoviesContainer = document.getElementById('top-rated-movies-container');
    const upcomingMoviesContainer = document.getElementById('upcoming-movies-container');

    popularMovieInfo.forEach(movie => {
        const tile = createMovieTile(movie);
        popularMoviesContainer.appendChild(tile);
    });

    topRatedMovieInfo.forEach(movie => {
        const tile = createMovieTile(movie);
        topRatedMoviesContainer.appendChild(tile);
    });

    upcomingMovieInfo.forEach(movie => {
        const tile = createMovieTile(movie);
        upcomingMoviesContainer.appendChild(tile);
    });
}

function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.substring(0, maxLength) + '...';
}

function expandTile(tile) {
    const allTiles = document.querySelectorAll('.movie-tile');
    allTiles.forEach(t => t.classList.remove('collapsed'));

    tile.classList.add('expanded');
    allTiles.forEach(t => {
        if (t !== tile) {
            t.classList.add('collapsed');
        }
    });
}
