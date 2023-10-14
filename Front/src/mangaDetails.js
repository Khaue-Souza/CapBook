document.addEventListener("DOMContentLoaded", function() {
    loadMangaDetails();
});

async function loadMangaDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('id');

    if (!mangaId) {
        console.error("ID do mangá não fornecido.");
        return;
    }

    const query = {
        query: `
            query ($id: Int) {
                Media(id: $id, type: MANGA) {
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                    }
                    format
                    chapters
                    volumes
                    status
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    averageScore
                    meanScore
                    popularity
                    favourites
                    source
                    genres
                    synonyms
                }
            }`,
        variables: { id: parseInt(mangaId) }
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    };

    try {
        const response = await fetch('https://graphql.anilist.co', requestOptions);
        const data = await response.json();
        displayMangaDetails(data.data.Media);
    } catch (error) {
        console.error('Erro ao buscar detalhes do mangá:', error);
    }
}

function displayMangaDetails(manga) {
    if (!manga) {
        console.error("Detalhes do mangá não fornecidos.");
        return;
    }

    const detailsDiv = document.getElementById('mangaDetails');


    const Romaji = manga.title.romaji ? `<h1><p>${manga.title.romaji}</p></h1>` : '';
    const titleRomaji = manga.title.romaji ? `<p>Romaji:  ${manga.title.romaji}</p>` : '';
    const titleNative = manga.title.native ? `<p>native:  ${manga.title.native}</p>` : '';
    const titleEnglish = manga.title.english ? `<p>English:  ${manga.title.english}</p>` : '';
    const description = manga.description ? `<p class="description">${manga.description}</p>` : '';
    const formatInfo = manga.format ? `<p>Formato: ${manga.format}</p>` : '';
    const chaptersInfo = manga.chapters ? `<p>Capítulos: ${manga.chapters}</p>` : '';
    const volumesInfo = manga.volumes ? `<p>Volumes: ${manga.volumes}</p>` : '';
    const statusInfo = manga.status ? `<p>Status: ${manga.status}</p>` : '';
    const meanScoreInfo = manga.meanScore ? `<p>Pontuação Média: ${manga.meanScore}%</p>` : '';
    const popularityInfo = manga.popularity ? `<p>Popularidade: ${manga.popularity}</p>` : '';
    const favouritesInfo = manga.favourites ? `<p>Favoritos: ${manga.favourites}</p>` : '';
    const sourceInfo = manga.source ? `<p>Fonte: ${manga.source}</p>` : '';
    const genresInfo = manga.genres && manga.genres.length > 0 ? `<p>Gêneros: ${manga.genres.join(', ')}</p>` : '';
    const synonyms = manga.synonyms && manga.genres.length > 0 ? `<p>Sinonimos: ${manga.synonyms.join(', ')}</p>` : '';
    
    const startDateInfo = (manga.startDate && manga.startDate.year && manga.startDate.month && manga.startDate.day) 
    ? `<p>Data de Início: ${manga.startDate.year}-${manga.startDate.month}-${manga.startDate.day}</p>` 
    : '';

    const endDateInfo = (manga.endDate && manga.endDate.year && manga.endDate.month && manga.endDate.day) 
        ? `<p>Data de Término: ${manga.endDate.year}-${manga.endDate.month}-${manga.endDate.day}</p>` 
        : '';


    const detailsHTML = `
        <div class="details-container">
            <img src="${manga.coverImage.large}" alt="${manga.title.english}" class="cover">
            <div class="content-container">
                <div class="title-description">
                    ${Romaji}
                    ${description}
                </div>
                <div class="actions">
                    <div class="list">
                        <div class="add">Add to List</div>
                    </div>
                </div>
                <!-- Adicione mais detalhes conforme necessário -->
                <div class="extra-info">
                    ${formatInfo}
                    ${chaptersInfo}
                    ${volumesInfo}
                    ${statusInfo}
                    ${startDateInfo}
                    ${endDateInfo}
                    ${meanScoreInfo}
                    ${popularityInfo}
                    ${favouritesInfo}
                    ${sourceInfo}
                    ${genresInfo}
                    ${titleRomaji}
                    ${titleNative}
                    ${titleEnglish}
                    ${synonyms}
                </div>
            </div>
        </div>
    `;

    detailsDiv.innerHTML = detailsHTML;
}



