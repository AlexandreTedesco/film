require('dotenv').config(); // Charge les variables d'environnement

const apiKey = process.env.OMDB_API_KEY; // Utilise la clé API depuis le fichier .env

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rafraîchissement de la page

    const searchQuery = document.getElementById('search-input').value;
    const apiUrl = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Response === 'True') {
        displayMovies(data.Search);
    } else {
        document.getElementById('movies-list').innerHTML = `<p>Aucun film trouvé pour "${searchQuery}"</p>`;
    }
});

// Déclaration unique de la fonction displayMovies
function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Vider les résultats précédents

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        movieItem.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h2>${movie.Title}</h2>
            <p>Date de sortie : ${movie.Year}</p>
            <button class="read-more" data-imdbid="${movie.imdbID}">Read More</button>
        `;

        movieItem.style.opacity = 0;
        movieItem.style.transform = 'translateX(-100px)';
        moviesList.appendChild(movieItem);

        // Ajout à l'Intersection Observer
        observer.observe(movieItem);
    });

    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', showMovieDetails);
    });
}

async function showMovieDetails(event) {
    const imdbID = event.target.getAttribute('data-imdbid');
    const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    
    const response = await fetch(apiUrl);
    const movie = await response.json();
    
    // Afficher la description dans une popup/modal
    alert(`
        Titre : ${movie.Title}
        Synopsis : ${movie.Plot}
        Réalisateur : ${movie.Director}
        Acteurs : ${movie.Actors}
    `);
}

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateX(0)';
            observer.unobserve(entry.target); // On n'observe plus l'élément une fois qu'il est visible
        }
    });
}, {
    threshold: 0.1
});

