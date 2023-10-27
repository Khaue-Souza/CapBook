async function fetchData() {
    const searchTerm = document.getElementById('searchTerm').value;
    const response = await fetch(`http://localhost:5114/api/Anilist/search/${searchTerm}`);
    const data = await response.json();

    if (!data || !data.data || !data.data.Page || !data.data.Page.media) {
        console.error('Resposta inesperada:', data);
        return;
    }

    const mediaList = data.data.Page.media;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Limpar resultados anteriores

    mediaList.forEach(media => {
        const mediaDiv = document.createElement('div');
        mediaDiv.innerHTML = `
            <a href="/views/mangaDetails2.html?id=${media.id}" target="_blank"> 
                <strong>Título Romaji:</strong> ${media.title.romaji} <br>
                <strong>Título Inglês:</strong> ${media.title.english || 'N/A'} <br>
                <img src="${media.coverImage.extraLarge}" alt="${media.title.romaji} cover image"><br>
            </a>
            <strong>Gêneros:</strong> ${media.genres.join(', ')} <br>
            <hr>
        `;
        resultsDiv.appendChild(mediaDiv);
    });
    
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    if (searchTerm) {
        document.getElementById('searchInput').value = searchTerm;
        searchManga();
    }
});