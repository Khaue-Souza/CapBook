document.addEventListener("DOMContentLoaded", function() {
  fetchListaDeLeitura().then(() => {
  });
});

async function fetchListaDeLeitura() {
  const usuarioId = localStorage.getItem('usuarioId');

console.log(usuarioId)
  if (!usuarioId) {
      console.error('Usuário não está logado');
      return ;
  }

  try {
      const response = await fetch(`https://safemangaread.azurewebsites.net/api/ListaDeLeitura/usuario/${usuarioId}`);
      if (!response.ok) {
          return;
      }
      
      const listaDeLeitura = await response.json();
      window.allMangas = listaDeLeitura; 
      createGenreFilterOptions();
      createStatusSelect(window.allMangas);
      applyFilters();
  } catch (error) {
      console.error('Erro:', error);
  }
}

function createGenreFilterOptions() {
  if (!window.allMangas) return;

  const genresSet = new Set();
  window.allMangas.forEach(manga => {
    let genres = manga.generos;
    if (typeof genres === 'string') genres = genres.split(',').map(genre => genre.trim());
    if (Array.isArray(genres)) {
      genres.forEach(genre => genresSet.add(genre.trim()));
    }
  });

  console.log(genresSet)
  // Mapeamento de gêneros do inglês para o português
  const genreTranslations = {
    'Action': 'Ação',
    'Adventure': 'Aventura',
    'Comedy': 'Comédia',
    'Fantasy': 'Fantasia',
    'Horror': 'Horror',
    'Supernatural': 'Sobrenatural',
    'Slice of Life': 'Vida Cotidiana',
    'Mystery': 'Mistério',
    'Hentai': 'Hentai',
    'Drama': 'Drama',
    'Psychological': 'Psicológico',
    'Romance': 'Romance',
    'Sci-Fi': 'Ficção Científica',
    'Music': 'Música',
    'Sports': 'Esportes',
    'Thriller': 'Suspense',
  };

  const genresFilterSelect = document.getElementById('genres-filter');
  genresFilterSelect.innerHTML = '';
  genresSet.forEach(genre => {
    const translatedGenre = genreTranslations[genre] || genre;
    const option = new Option(translatedGenre, genre.toLowerCase());
    option.setAttribute("data-genre", genre); // Para usar na filtragem
    genresFilterSelect.appendChild(option);
  });

  // Inicializa o Select2 ou outra biblioteca similar aqui
  $('#genres-filter').select2();
}

function getSelectedGenres() {
  return $('#genres-filter').val(); 
}

function createStatusSelect(mangas) {
  const statusSelect = document.getElementById('status-filter');
  statusSelect.innerHTML = '<option value="all">Todos</option>'; 

  const uniqueStatus = [...new Set(mangas.map(manga => manga.statusManga || 'Outros'))];
  uniqueStatus.forEach(status => {
    const option = document.createElement('option');
    option.value = status.toLowerCase();
    option.textContent = status;
    statusSelect.appendChild(option);
  });
}

function applyFilters() {
  let filteredMangas = window.allMangas;

  const statusFilter = document.getElementById('status-filter').value.toLowerCase();
  const formatFilter = document.getElementById("format-filter").value.toLowerCase();
  const countryFilter = document.getElementById("country-filter").value.toLowerCase();
  const nameFilter = document.getElementById("filter-input").value.toLowerCase();
  
  console.log('Filtrando por nome:', nameFilter); // Isso deve mostrar o que está sendo digitado no filtro


  const selectedGenres = getSelectedGenres();

  if (statusFilter !== 'all') {
    filteredMangas = filteredMangas.filter(manga => manga.statusManga.toLowerCase() === statusFilter);
  }

  if (formatFilter) {
    filteredMangas = filteredMangas.filter(manga => manga.formatoManga.toLowerCase() === formatFilter);
  }

  if (countryFilter) {
    filteredMangas = filteredMangas.filter(manga => manga.paisDeOrigem.toLowerCase() === countryFilter);
  }

  if (selectedGenres.length > 0) {
    filteredMangas = filteredMangas.filter(manga => {
      let genresArray = typeof manga.generos === 'string' ? manga.generos.split(',').map(g => g.trim().toLowerCase())
       : manga.generos.map(g => g.toLowerCase());
      return selectedGenres.some(genre => genresArray.includes(genre));
    });
  }
    if (nameFilter) {
      filteredMangas = filteredMangas.filter(manga => {
        
        return manga.nomeMangaRomaji.toLowerCase().includes(nameFilter);
      });
    }
  atualizarListaDeMangasPorStatus(filteredMangas);
}

document.getElementById("format-filter").addEventListener("change", applyFilters);
document.getElementById("country-filter").addEventListener("change", applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);
document.getElementById("genres-filter").addEventListener("change", applyFilters);


function atualizarListaDeMangasPorStatus(listaDeLeitura) {
  const statusContainer = document.getElementById('status-container');
  statusContainer.innerHTML = '';

  const categorias = listaDeLeitura.reduce((acc, manga) => {
      const status = manga.statusManga || 'Outros';
      if (!acc[status]) acc[status] = [];
      acc[status].push(manga);
      return acc;
  }, {});

  
  const formatMapping = {
    'ONE_SHOT': 'ONE SHOT',
    // Qualquer outro mapeamento de formato necessário
  };
  
  Object.entries(categorias).forEach(([status, mangas]) => {
      // Cria o cabeçalho do status
      const statusHeader = document.createElement('h2');
      statusHeader.textContent = status;
      
      // Cria a div que envolve cada tabela de status
      const statusDiv = document.createElement('div');
      statusDiv.classList.add('status-div');
      statusDiv.appendChild(statusHeader);

      // Cria a tabela
      const table = document.createElement('table');

      // Cabeçalho da tabela
      const thead = document.createElement('thead');
      thead.innerHTML = `
      <tr>
          <th class="cover-column"></th>
          <th class="name-column">Nome</th>
          <th class="chapters-column">Capitulos</th>
          <th class="origin-column">Pais de Origem</th>
          <th class="format-column">Formato</th>
      </tr>
  `;
      table.appendChild(thead);

      // Corpo da tabela
      const tbody = document.createElement('tbody');
      mangas.forEach(manga => {
          const tr = document.createElement('tr');
          
            // Célula para o país de origem
        const originTd = document.createElement('td');
        originTd.textContent = manga.paisDeOrigem;

        // Célula para o formato
        const formatTd = document.createElement('td');
        formatTd.textContent = formatMapping[manga.formatoManga] || manga.formatoManga || 'Desconhecido';


        // Adicione as células à linha
        tr.appendChild(originTd);
        tr.appendChild(formatTd);

          const coverBtnCell = document.createElement('td');
          coverBtnCell.classList.add('cover-btn-cell');
      
          // Imagem da capa
          const coverImg = document.createElement('img');
          coverImg.src = manga.images || '/public/imagens/imag.jpeg';
          coverImg.alt = 'Cover';
          coverImg.classList.add('cover-img');
          coverImg.setAttribute('data-manga-id', manga.mangaId);
          coverImg.onclick = () => openUpdateModal(coverImg);
          coverBtnCell.appendChild(coverImg);
      
          // Botão de Atualizar
          const updateBtn = document.createElement('button');
          updateBtn.textContent = 'Atualizar';
          updateBtn.classList.add('btn', 'btn-primary', 'btn-block');
          updateBtn.setAttribute('data-manga-id', manga.mangaId);
          updateBtn.onclick = () => openUpdateModal(updateBtn);
          coverBtnCell.appendChild(updateBtn);
          updateBtn.onclick = function() {
            openUpdateModal(manga.mangaId); // A função 'openUpdateModal' agora espera um ID de mangá, não um elemento
          };
     
          tr.appendChild(coverBtnCell);

          tr.innerHTML = `
              <td>
                  <div class="image-container">
                      <img src="${manga.images || '/public/imagens/imag.jpeg'}" alt="Cover" class="cover-img" style="cursor:pointer;"/>
                      <div class="update-button-container">
                          <button   type="button" id="botao-adicionar" class="btn btn-primary btn-update" data-toggle="modal" data-target="#mangaModal" data-manga-id="${manga.mangaId}">Atualizar</button>
                      </div>
                  </div>
              </td>
              <td><a href="mangaDetails2.html?id=${manga.mangaId}">
                    ${manga.nomeMangaRomaji}
                  </a>
              </td>
              <td>${manga.progressoCapitulo}</td>
              <td>${manga.paisDeOrigem}</td>
              <td>${manga.formatoManga}</td>
          `;

          // Agora adicione o evento de clique ao botão "Atualizar"
          const btnUpdate = tr.querySelector('.btn-update');
          btnUpdate.onclick = function() {
              openUpdateModal(manga.mangaId); // 'this' se refere ao elemento do botão que foi clicado
          };

          tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      statusDiv.appendChild(table);
      statusContainer.appendChild(statusDiv);
  });
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
  mediaGlobal = manga;
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
          modalTitle.textContent = manga.nomeMangaRomaji || 'Nome Indisponível';
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
  console.log(" ID do usuario:" + globalUsuarioId + "Id do manga:" + globalMangaId)
  
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
    
  let successMessageDiv = $('#successMessage');
  successMessageDiv.text(message);
  successMessageDiv.fadeIn();

  setTimeout(function() {
      successMessageDiv.fadeOut();
  }, 4000);  
}


async function addMangaToList() {

  const statusManga = document.getElementById('status-manga').value;
  const progressoCapitulo = document.getElementById('progresso-capitulo').value;
  const dataInicio = document.getElementById('data-inicio').value || new Date().toISOString().substr(0, 10);
  const dataConclusao = document.getElementById('data-conclusao').value;
  const notas = document.getElementById('notas').value;

  const nomeMangaRomaji  = mediaGlobal.nomeMangaRomaji  ;


  
  let messageNomeManga   = nomeMangaRomaji;
  
  const userToken = localStorage.getItem('userToken');
  const usuarioId = localStorage.getItem('usuarioId');

  console.log(userToken)

  if (!userToken) {
      window.location.href = 'login.html';
      return;
  }
  const listaDeLeitura = {
      UsuarioId: parseInt(usuarioId),  
      MangaId: parseInt(mediaGlobal.mangaId),
      StatusManga: statusManga,
      nomeMangaRomaji: mediaGlobal.nomeMangaRomaji,
      ProgressoCapitulo: parseInt(progressoCapitulo) || 0,
      DataInicio: dataInicio,
      DataConclusao: dataConclusao || null,
      Notas: notas,
  };
 

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
      
  
      if (response.status !== 204) {
          const data = await response.json();
          console.log(data);
         
      } else {
          $('#mangaModal').modal('hide');
        
          showSuccessMessage(`${messageNomeManga} atualizado na lista de leitura!`);
      }
  } catch (error) {
      console.error('Erro na requisição:', error);
      alert(`Erro na requisição: ${error.message || 'Erro desconhecido'}`);
  }
  
}
