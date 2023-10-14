// Função que confere a validação de login
async function confere() {

    // pega os valores dos campos
    let loginEmail = document.getElementById('login').value;
    let senhaUsuario = document.getElementById('senha').value;

    const data = {
      UsuarioEmail: loginEmail, UsuarioSenha: senhaUsuario
    };
    
    // fetch faz s solicitação em modo POST para verificar
    await fetch("http://localhost:5114/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        // caso retorne status 200(OK), ele redireciona
        if(data.status == 200)
          window.location.href = 'Manga.html'
        // Se não dispara um alerta que está errado
        else
          alert('Usuário ou senha incorretos!')
      })
      .catch((error) => {
        console.error("Error:", error);
      })
  
  }

  reincarnation of the strongest sword god