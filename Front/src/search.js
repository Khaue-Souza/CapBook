// Pega o termo de pesquisa da URL
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('q');

// Chama a função de pesquisa se houver um termo de pesquisa
if (searchTerm) {
    document.getElementById('searchInput').value = searchTerm;
    searchManga();
}

async function searchManga() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) return;

    const query = {
        query: `
            query ($search: String) {
                Page {
                media(search: $search, type: MANGA) {
                    id
                    title {
                    romaji
                    }
                    coverImage {
                    large
                    }
                    genres
                }
                }
            }`,
        variables: { search: searchTerm }
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    };

    try {
        const response = await fetch('https://graphql.anilist.co', requestOptions);
        const data = await response.json();

        displayResults(data.data.Page.media);  // Ajustando para capturar a lista correta de mangás
    } catch (error) {
        console.error('Error fetching data:', error);

    }
}

function displayResults(mediaList) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (mediaList && mediaList.length > 0) {
        mediaList.forEach(media => {
            // Correção: Coloque esta linha aqui dentro do forEach
            const genres = media.genres ? media.genres.join(', ') : 'Não informado';

            const mangaElement = `
                <div>
                    <a href="mangaDetails.html?id=${media.id}">  <!-- Adicione este link -->
                        <img src="${media.coverImage.large}" alt="${media.title.romaji}" width="150">
                        <h3>${media.title.romaji}</h3>
                    </a>
                    <p class="manga-genres">Gêneros: ${genres}</p>
                    <p class="manga-id">ID: ${media.id}</p>
                </div>
            `;

            resultsDiv.innerHTML += mangaElement;
        });
    } else {
        resultsDiv.innerHTML = 'No results found.';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    if (searchTerm) {
        document.getElementById('searchInput').value = searchTerm;
        searchManga();
    }
});

