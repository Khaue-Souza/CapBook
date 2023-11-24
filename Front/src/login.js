async function confere() {
  let loginEmail = document.getElementById('login').value;
  let senhaUsuario = document.getElementById('senha').value;
  console.log(loginEmail, senhaUsuario)

  

  const data = {
      UsuarioEmail: loginEmail, UsuarioSenha: senhaUsuario
  };
  
  try {
      const response = await fetch("https://safemangaread.azurewebsites.net/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });

      // Verifique o status da resposta
      if (response.status !== 200) {
          showErrorModal('Email ou senha incorretos!');
          return;
      }

      const responseData = await response.json();

    
      // Supondo que o servidor retorne um token quando o login for bem-sucedido
      if (responseData.token && responseData.usuarioId) {
          localStorage.setItem('userToken', responseData.token);
          localStorage.setItem('usuarioId', responseData.usuarioId);
          window.location.href = 'inicio.html';
      } else {
          alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
      }
  } catch (error) {
      console.error("Error:", error);
      alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
  }
}

function usuario(){
    window.location.href = '../views/usuario.html'
}


function showErrorModal(errorMessage) {
    const errorModal = document.getElementById('errorModal');
    const errorMessageElement = document.getElementById('errorMessage');
  
    errorMessageElement.textContent = errorMessage;
    errorModal.style.display = 'block';
  }
  
  function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    errorModal.style.display = 'none';
  }