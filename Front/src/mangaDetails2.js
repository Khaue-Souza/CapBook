function formatValue(value, isPercentage = false) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return isPercentage ? `${value}%` : value;
}
function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}




const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mangaId = id;





async function fetchDetails() {
    const response = await fetch(`http://localhost:5114/api/Anilist/details/${id}`);
    const data = await response.json();
    
    const media = data.data.Media;
    console.log(mangaId)
    
    document.getElementById('cover-image').src = media.coverImage.large;
    document.getElementById('title-romaji').textContent = media.title.romaji;
    document.getElementById('title-english').textContent = media.title.english;
    document.getElementById('description').innerHTML = media.description;

    document.getElementById('modal-image').src = media.coverImage.large;
    document.getElementById('modal-title').textContent = media.title.romaji;
    
    
    const additionalInfoDiv = document.getElementById('additional-info');
    additionalInfoDiv.innerHTML = `
    <strong>Formato:</strong> ${formatValue(media.format)} <br>
    <strong>Capítulos:</strong> ${formatValue(media.chapters)} <br>
    <strong>Volumes:</strong> ${formatValue(media.volumes)} <br>
    <strong>Status:</strong> ${formatValue(media.status === 'FINISHED' ? 'Finalizado' : media.status)} <br>
    <strong>Pontuação Média:</strong> ${formatValue(media.averageScore, true)} <br>
    <strong>Popularidade:</strong> ${formatValue(media.popularity)} <br>
    <strong>Favoritos:</strong> ${formatValue(media.favourites)} <br>
    <strong>Título Romaji:</strong> ${formatValue(media.title.romaji)} <br>
    <strong>Título Nativo:</strong> ${formatValue(media.title.native)} <br>
    <strong>Sinônimos:</strong> ${media.synonyms ? media.synonyms.join(', ') : 'N/A'} <br>
    `;
    
}

async function addMangaToList() {

        const statusManga = document.getElementById('status-manga').value;
        const progressoCapitulo = document.getElementById('progresso-capitulo').value;
        const dataInicio = document.getElementById('data-inicio').value;
        const dataConclusao = document.getElementById('data-conclusao').value;
        const notas = document.getElementById('notas').value;
    
    const userToken = localStorage.getItem('userToken');
    const usuarioId = localStorage.getItem('usuarioId');
    if (!userToken) {
        window.location.href = 'login.html';
        return;
    }

    const listaDeLeitura = {
        UsuarioId: usuarioId,  
        MangaId: mangaId,
        StatusManga: statusManga,
        ProgressoCapitulo: progressoCapitulo,
        DataInicio: dataInicio,
        DataConclusao: dataConclusao,
        Notas: notas
    };


    await fetch("http://localhost:5114/api/ListaDeLeitura/addManga", {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(listaDeLeitura),
        

    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Response Body:', text);
                throw new Error('Falha ao adicionar mangá à lista de leitura');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        alert('Mangá adicionado à lista de leitura com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro. Por favor, tente novamente.');
    });
}

document.addEventListener("DOMContentLoaded", fetchDetails);