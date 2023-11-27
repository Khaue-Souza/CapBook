document.addEventListener("DOMContentLoaded", function () {

    footerDivCorrect();
});

async function searchManga() {
    const searchTerm = document.getElementById('searchInput').value;
    footerDivCorrect()
    if (!searchTerm) return;

    history.replaceState(null, '', `?q=${encodeURIComponent(searchTerm)}`);

    try {
        const response = await fetch(`https://safemangaread.azurewebsites.net/api/Anilist/search/${searchTerm}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseBody = await response.text();

        const data = JSON.parse(responseBody);

        if (!data || !data.data || !data.data.Page || !data.data.Page.media) {
            console.error('Resposta inesperada:', data);
            return;
        }

        displayResults(data.data.Page.media);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function footerDivCorrect() {
    var searchTerm = document.getElementById('searchInput').value;
    var div = document.getElementById('divMeio');
    var divOnOff = document.getElementById('middleDivOnOff');

    if (div && divOnOff) {
        if (searchTerm != null && searchTerm.length > 0) {
            div.classList.remove('ajeita');
            divOnOff.classList.remove('middleDivOff');
            divOnOff.classList.add('middleDivOn');
        } else {
            div.classList.add('ajeita');
            divOnOff.classList.remove('middleDivOn');
            divOnOff.classList.add('middleDivOff');
        }
    }
}


function displayResults(mediaList) {
    console.log(mediaList)
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (mediaList && mediaList.length > 0) {
        mediaList.forEach(media => {
            // Correção: Coloque esta linha aqui dentro do forEach
            const genres = media.genres ? media.genres.join(', ') : 'Não informado';

            const mangaElement = `
                <div>
                    <div class="alinha" style="display: flex; flex-direction: row;">

                    
                        <div>
                            <a href="mangaDetails2.html?id=${media.id}"> 
                                <img src="${media.coverImage.large}" width="150">
                            </a>
                        </div>
                        <div style="margin: 5px;">
                            <div>
                                <a href="mangaDetails2.html?id=${media.id}"> 
                                    <h3>${media.title.romaji}</h3>
                                </a>
                            </div>

                        
                            <div>
                                <p class="manga-genres">Gêneros: ${genres}</p>
                            </div>

                            <div>
                                <p class="manga-id">ID: ${media.id}</p>
                            </div>
                        </div>

                    </div>
                        <hr style="border: 2px solid black;">  
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
