function formatValue(value, isPercentage = false) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return isPercentage ? `${value}%` : value;
}
function openModal() {
    console.log("passei aqui")
    $('#mangaModal').modal('show');
    document.getElementById('#mangaModal').style.display = 'flex';
    console.log(document.getElementById)
}

const countryMapping = {
    'TW': 'Taiwan',
    'JP': 'Japão',
    'CN': 'China',
    'KR': 'Coreia do Sul',

};

function formatCountryOfOrigin(countryCode) {
    return countryMapping[countryCode] || 'Desconhecido';
}


const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const mangaId = id;
const usuarioId = localStorage.getItem('usuarioId');


var globalMangaId = mangaId; 
var globalUsuarioId = localStorage.getItem('usuarioId');
let mediaGlobal; 
console.log(usuarioId, id)

function formatValue(value, isPercentage = false) {
    return value === null || value === undefined ? 'N/A' : isPercentage ? `${value}%` : value;
}


async function atualizarInterfaceUsuario() {
    try {
        verificarSeMangaEstaNaLista();
    } catch (error) {
        console.error('Erro ao atualizar a interface do usuário:', error);
    
    }
}

async function fetchDetails() {
    if(id === null){
        return null;
    }
    const response = await fetch(`https://safemangaread.azurewebsites.net/api/Anilist/details/${id}`);

    const data = await response.json();

    mediaGlobal = data.data.Media; 
    NomeMangaRomaji = mediaGlobal.title.romaji;
    NomeMangaEnglish = mediaGlobal.title.english;
    NomeMangaNative = mediaGlobal.title.native;
    
    document.getElementById('cover-image').src = mediaGlobal.coverImage.large;
    document.getElementById('title-romaji').textContent = mediaGlobal.title.romaji;
    document.getElementById('description').innerHTML = mediaGlobal.description;

    document.getElementById('modal-image').src = mediaGlobal.coverImage.large;
    document.getElementById('modal-title').textContent = mediaGlobal.title.romaji;

    if (mediaGlobal.bannerImage) {
        document.getElementById('banner-image').src = mediaGlobal.bannerImage;
    }
        
    const additionalInfoDiv = document.getElementById('additional-info');
    const countryOfOrigin = mediaGlobal.countryOfOrigin === 'JP' ? 'Japão' :
    mediaGlobal.countryOfOrigin === 'KR' ? 'Coreia do Sul' :
    mediaGlobal.countryOfOrigin === 'CN' ? 'China' :
    mediaGlobal.countryOfOrigin === 'TW' ? 'Taiwan' : 'Desconhecido';

    additionalInfoDiv.innerHTML = `
        <strong>Formato:</strong> ${formatValue(mediaGlobal.format)} (${countryOfOrigin})<br>
        <strong>Capítulos:</strong> ${formatValue(mediaGlobal.chapters)} <br>
        <strong>Volumes:</strong> ${formatValue(mediaGlobal.volumes)} <br>
        <strong>Status:</strong> ${formatValue(mediaGlobal.status === 'FINISHED' ? 'Finalizado' : mediaGlobal.status)} <br>
        <strong>Pontuação Média:</strong> ${formatValue(mediaGlobal.averageScore, true)} <br>
        <strong>Popularidade:</strong> ${formatValue(mediaGlobal.popularity)} <br>
        <strong>Favoritos:</strong> ${formatValue(mediaGlobal.favourites)} <br>
        <strong>Título Romaji:</strong> ${formatValue(mediaGlobal.title.romaji)} <br>
        <strong>Título Inglês:</strong> ${formatValue(mediaGlobal.title.english)} <br>
        <strong>Título Nativo:</strong> ${formatValue(mediaGlobal.title.native)} <br>
        <strong>Sinônimos:</strong> ${mediaGlobal.synonyms ? mediaGlobal.synonyms.join(', ') : 'N/A'} <br>
        <strong>Gêneros:</strong> ${mediaGlobal.genres ? mediaGlobal.genres.join(', ') : 'N/A'} <br>
    `;


    verificarSeMangaEstaNaLista();
}

function configurarEventListeners(manga) {
    console.log(manga)
    const botaoAdicionar = $('#botao-adicionar');
    const botaoExcluir = $('#botao-excluir');

    botaoAdicionar.off('click').on('click', () => preencherModalComDados(manga));
    botaoAdicionar.text(manga.statusManga || 'Adicionar à Lista de Leitura');


    if (manga.listaDeLeituraId && manga.listaDeLeituraId !== 0) {
        botaoExcluir.show();
    } else {
        botaoExcluir.hide();
    }
}

let mangaIdDaLista;

async function verificarSeMangaEstaNaLista() {
    const usuarioId = globalUsuarioId;
    const response = await fetch(`https://safemangaread.azurewebsites.net/api/ListaDeLeitura/usuario/${usuarioId}/manga/${mangaId}`);
    
    if (response.ok) {
        const mangaNaLista = await response.json();
        mangaIdDaLista = mangaNaLista.listaDeLeituraId;  
        
        configurarEventListeners(mangaNaLista);
    } else {
        configurarEventListeners({statusManga: 'Adicionar à Lista de Leitura', listaDeLeituraId: 0});
    }
}

function openUpdateModal(mangaId) {
    // Encontre o mangá pelo ID
    const manga = window.allMangas.find(m => m.mangaId == mangaId);
    if (manga) {
      preencherModalComDados(manga); // Supondo que 'preencherModalComDados' espera um objeto de mangá
      $('#mangaModal').modal('show'); // Usando jQuery para mostrar o modal
    } else {
      console.error('Mangá não encontrado');
    }
  }

function preencherModalComDados(manga) {
    console.log("Dados recebidos no preencherModalComDados:", manga);
    if (manga) {
        // Atualiza os valores dos campos de texto
        document.getElementById('status-manga').value = manga.statusManga || '';
        document.getElementById('progresso-capitulo').value = manga.progressoCapitulo || 0;
        document.getElementById('notas').value = manga.notas || '';
        document.getElementById('data-inicio').value = manga.dataInicio ? manga.dataInicio.substr(0, 10) : '';
        document.getElementById('data-conclusao').value = manga.dataConclusao ? manga.dataConclusao.substr(0, 10) : '';

         // Atualiza o nome do mangá na modal
        let modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = mediaGlobal.title.romaji || 'Nome Indisponível';
        }

        // Atualiza a imagem
        let modalImage = document.getElementById('modal-image');
        if (modalImage && manga.images) {
            modalImage.src = manga.images;
            modalImage.alt = manga.nomeMangaRomaji || 'Capa do mangá';
        }
    }
}

function confirmDelete(usuarioId, id) {
    globalUsuarioId = usuarioId;
    globalMangaId = id;
    console.log("ID do usuario:" +globalUsuarioId +"         Id do manga:" + globalMangaId)
    
    $('#deleteConfirmationModal').modal('show');
}

function executeDelete() {
    // Chama deleteManga com os IDs que foram salvos anteriormente
    deleteManga(globalUsuarioId, globalMangaId);
}

function deleteManga(usuarioId, mangaId) {

    if (!globalUsuarioId || !globalMangaId) {
        alert("Erro: Não foi possível obter o ID do usuário ou do mangá.");
        return;
    }
    const endpoint = `https://safemangaread.azurewebsites.net/api/ListaDeLeitura/usuario/${usuarioId}/manga/${mangaId}`;
    
    fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao excluir o mangá da lista de leitura');
        }
        $('#deleteConfirmationModal').modal('hide');
        $('#mangaModal').modal('hide');

        
        showSuccessMessage('Entrada da lista excluída com sucesso.');

    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro. Por favor, tente novamente.');
    });
}

function showSuccessMessage(message) {
    
    atualizarInterfaceUsuario(); 
    var successMessageDiv = $('#successMessage');
    successMessageDiv.text(message);
    successMessageDiv.fadeIn();

    setTimeout(function() {
        successMessageDiv.fadeOut();
    }, 4000);  
}

let isNewEntry;


async function addMangaToList() {

    const statusManga = document.getElementById('status-manga').value;
    const progressoCapitulo = document.getElementById('progresso-capitulo').value;
    const dataInicio = document.getElementById('data-inicio').value || new Date().toISOString().substr(0, 10);
    const dataConclusao = document.getElementById('data-conclusao').value;
    const notas = document.getElementById('notas').value;
    console.log("mediaGlobal")
    console.log(mediaGlobal)

    const nomeMangaEnglish = mediaGlobal.title.english ||  'Nome não disponível';
    const nomeMangaRomaji  = mediaGlobal.title.romaji  ||  'Nome não disponível';
    const nomeMangaNative  = mediaGlobal.title.native  ||  'Nome não disponível';
    let messageNomeManga   = mediaGlobal.title.english || nomeMangaRomaji;
    
    const userToken = localStorage.getItem('userToken');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!userToken) {
        window.location.href = 'login.html';
        return;
    }
    const listaDeLeitura = {
        UsuarioId: parseInt(usuarioId),  
        MangaId: parseInt(mangaId),
        NomeMangaRomaji: nomeMangaRomaji,
        NomeMangaEnglish: nomeMangaEnglish,
        NomeMangaNative: nomeMangaNative,
        StatusManga: statusManga,
        FormatoManga: mediaGlobal.format,
        ProgressoCapitulo: parseInt(progressoCapitulo) || 0,
        DataInicio: dataInicio,
        DataConclusao: dataConclusao || null,
        Notas: notas,
        Generos: mediaGlobal.genres.join(', '),
        Images: mediaGlobal.coverImage.large,
        Banner: mediaGlobal.bannerImage || '', 
        PaisDeOrigem: formatCountryOfOrigin(mediaGlobal.countryOfOrigin),
        AnoDePublicacao: mediaGlobal.startDate.year || 0,
        NomesAlternativos: mediaGlobal.synonyms.join(', ')
    };

    isNewEntry = !mangaIdDaLista;
   

    const endpoint = `https://safemangaread.azurewebsites.net/api/ListaDeLeitura`;
    const method = 'PUT';


    console.log("Enviando dados para a API:", listaDeLeitura);
    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(listaDeLeitura),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText);
            alert(`Erro: ${errorText}`);
            return;
        }
        
        const botaoAdicionar = document.getElementById('botao-adicionar');
        console.log(botaoAdicionar)
        if (botaoAdicionar) {
            botaoAdicionar.textContent = listaDeLeitura.StatusManga || 'Status Desconhecido';
        }
    
        if (response.status !== 204) {
            const data = await response.json();
            console.log(data);
           
        } else {
            $('#mangaModal').modal('hide');
            const messageAction = isNewEntry ? 'adicionado' : 'atualizado';
            showSuccessMessage(`${messageNomeManga} ${messageAction} na lista de leitura!`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert(`Erro na requisição: ${error.message || 'Erro desconhecido'}`);
    }
    
}

document.addEventListener("DOMContentLoaded", fetchDetails);

document.addEventListener("DOMContentLoaded", function() {
    var dataAtual = new Date();
    var dataFormatada = dataAtual.toISOString().substr(0, 10);
    document.getElementById("data-inicio").value = dataFormatada;
    
});


function abrirModalDetalhes(mangaId) {
    const manga = window.allMangas.find(m => m.id === mangaId);
    if (manga) {
        preencherModalComDados(manga); 
        openModal(); 
    }
}