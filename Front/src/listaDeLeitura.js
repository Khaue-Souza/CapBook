document.addEventListener("DOMContentLoaded", function() {
  fetchListaDeLeitura().then(() => {
    createGenreFilterOptions(); // Chama após a lista de leitura estar disponível
  });
});

async function fetchListaDeLeitura() {
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
      console.error('Usuário não está logado');
      return;
  }

  try {
      const response = await fetch(`http://localhost:5114/api/ListaDeLeitura/usuario/${usuarioId}`);
      if (!response.ok) {
          throw new Error('Falha ao buscar lista de leitura');
      }
      const listaDeLeitura = await response.json();
      window.allMangas = listaDeLeitura; 
      createGenreFilterOptions(window.allMangas);
      createStatusSelect(window.allMangas);
      applyFilters();
  } catch (error) {
      console.error('Erro:', error);
  }
}

function createGenreFilterOptions() {
  if (!window.allMangas) return; // Verifica se allMangas está definido

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

// Não esqueça de chamar createGenreFilterOptions depois de definir window.allMangas
createGenreFilterOptions();

// Função para obter os gêneros selecionados
function getSelectedGenres() {
  return $('#genres-filter').val(); // Isso dependerá da biblioteca específica que você está usando
}

function createStatusSelect(mangas) {
  const statusSelect = document.getElementById('status-filter');
  statusSelect.innerHTML = '<option value="all">Todos</option>'; // Opção padrão

  // Obter status únicos
  const uniqueStatus = [...new Set(mangas.map(manga => manga.statusManga || 'Outros'))];
  uniqueStatus.forEach(status => {
    const option = document.createElement('option');
    option.value = status.toLowerCase();
    option.textContent = status;
    statusSelect.appendChild(option);
  });
}

function applyFilters() {
  // Inicialize a variável filteredMangas com a lista completa de mangás
  let filteredMangas = window.allMangas;

  // Obter os valores atuais dos filtros
  const statusFilter = document.getElementById('status-filter').value.toLowerCase();
  const formatFilter = document.getElementById("format-filter").value.toLowerCase();
  const countryFilter = document.getElementById("country-filter").value.toLowerCase();
  const selectedGenres = getSelectedGenres();

  // Aplicar filtragem por status
  if (statusFilter !== 'all') {
    filteredMangas = filteredMangas.filter(manga => manga.statusManga.toLowerCase() === statusFilter);
  }

  // Aplicar filtragem por formato
  if (formatFilter) {
    filteredMangas = filteredMangas.filter(manga => manga.formatoManga.toLowerCase() === formatFilter);
  }

  // Aplicar filtragem por país
  if (countryFilter) {
    filteredMangas = filteredMangas.filter(manga => manga.paisDeOrigem.toLowerCase() === countryFilter);
  }

  // Aplicar filtragem por gêneros selecionados
  if (selectedGenres.length > 0) {
    filteredMangas = filteredMangas.filter(manga => {
      // Converter gêneros para array se eles estiverem em formato de string
      let genresArray = typeof manga.generos === 'string' ? manga.generos.split(',').map(g => g.trim().toLowerCase()) : manga.generos.map(g => g.toLowerCase());
      // Verificar se algum dos gêneros selecionados está presente
      return selectedGenres.some(genre => genresArray.includes(genre));
    });
  }

  // Atualizar a lista de mangás na página com os mangás filtrados
  atualizarListaDeMangasPorStatus(filteredMangas);
}


document.getElementById("format-filter").addEventListener("change", applyFilters);
document.getElementById("country-filter").addEventListener("change", applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);
document.getElementById("genres-filter").addEventListener("change", applyFilters);





function atualizarListaDeMangasPorStatus(listaDeLeitura) {
  // console.log("listaDeLeitura")
  // console.log(listaDeLeitura)
  const statusContainer = document.getElementById('status-container');
  statusContainer.innerHTML = ''; // Limpar conteúdo anterior

  const categorias = listaDeLeitura.reduce((acc, manga) => {
      const status = manga.statusManga || 'Outros'; // Categoriza como 'Outros' se não houver status
      if (!acc[status]) acc[status] = [];
      acc[status].push(manga);
      return acc;
  }, {});


  const countryMapping = {
    'TW': 'Taiwan',
    'JP': 'Japão',
    'CN': 'China',
    'KR': 'Coreia do Sul',
    // Adicione mais siglas e nomes conforme necessário
  };
  
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
        originTd.textContent = countryMapping[manga.paisDeOrigem] || manga.paisDeOrigem || 'Desconhecido';

        // Célula para o formato
        const formatTd = document.createElement('td');
        formatTd.textContent = formatMapping[manga.formatoManga] || manga.formatoManga || 'Desconhecido';


        // Adicione as células à linha
        tr.appendChild(originTd);
        tr.appendChild(formatTd);

          // console.log("corpo da tabela")
          // console.log(manga)

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
              <td><a href="mangadetails2.html?id=${manga.mangaId}">
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
