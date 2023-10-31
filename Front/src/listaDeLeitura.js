document.addEventListener("DOMContentLoaded", function() {
  fetchListaDeLeitura();
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
      atualizarListaDeMangas(listaDeLeitura);
  } catch (error) {
      console.error('Erro:', error);
  }
}

function atualizarListaDeMangas(listaDeLeitura) {
  const listaMangas = document.getElementById('listaMangas');
  listaMangas.innerHTML = ''; 
  listaDeLeitura.forEach(manga => {
      const li = document.createElement('li');
      li.textContent = manga.nomeManga; 
      listaMangas.appendChild(li);
  });
}
