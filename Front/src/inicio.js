// Função para buscar os mangás populares
function fetchPopularMangas() {
    // URL da sua API que retorna os mangás populares
    const apiUrl = 'http://localhost:5114/api/Anilist/popular';
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        displayMangas(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
  
  // Função para exibir os mangás na página
  function displayMangas(data) {
    const mangas = data.data.Page.media; 
    console.log(mangas)

    const container = document.getElementById('manga-container'); // O elemento onde você quer inserir os mangás
  
    mangas.forEach(manga => {
      // Crie o elemento do cartão do manga
      const card = document.createElement('div');
      card.className = 'manga-card';
  
      // Adicione a imagem
      const img = document.createElement('img');
      img.src = manga.coverImage.extraLarge;
      img.alt = manga.title.romaji;
      card.appendChild(img);
  
      // Adicione o título
      const titleLink = document.createElement('a');
      titleLink.href = `mangaDetails2.html?id=${manga.id}`;
      titleLink.textContent = manga.title.romaji;
      card.appendChild(titleLink);  
      container.appendChild(card);
    });
  }
  
  // Chame a função fetchPopularMangas quando a janela carregar
  window.onload = fetchPopularMangas;
  