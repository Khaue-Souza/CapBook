// Declara variáveis
var nomeUsuario;
var nascimentoUsuario;
var emailUsuario;
var senhaUsuario;

// Pega os valores dos campos e salva nas variáveis
function onChangeCampos(e) {
  nomeUsuario = document.getElementById('usuarioNome').value;
  nascimentoUsuario = document.getElementById('usuarioNascimento').value;
  emailUsuario = document.getElementById('usuarioEmail').value;
  senhaUsuario = document.getElementById('usuarioSenha').value;
  confirmaSenhaUsu = document.getElementById('confirmaSenha').value;


}

// Chama a função que faz o Post
function submit() {
  const data = { UsuarioName: nomeUsuario, UsuarioNascimento: nascimentoUsuario, UsuarioEmail: emailUsuario, UsuarioSenha: senhaUsuario };
  postData(data)
}

// Função de POST
async function postData(data) {
  // Fetch faz o post dos dados no servidor
  await fetch("https://safemangaread.azurewebsites.net/api/Usuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Corpo do Json
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      // Caso de certo
      if (data.status != 404) {
        // Limpa os campos
        limpa()
        // Mensagem de inserido
        inserido()
        
        setTimeout(function() {
          window.location.href = "../views/login.html";
        }, 3000);
        // window.location.href = "../views/login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    })

}



// Função para verificar se os dois campos de senha correspondem
function confirmaSenha() {
  // pega valores dos campos
  let senha = document.getElementById('usuarioSenha').value;
  let confirmaSenha = document.getElementById('confirmaSenha').value;

  // Condição para verificar se são iguais
  if (senha != confirmaSenha) {
    alert('As senhas são diferentes!');
    return false;
  }
  // Se forem Salva no Banco
  submit();
  return true;
}

// Função que limpa os campos
function limpa() {
  nomeUsuario = document.getElementById('usuarioNome').value = null;
  nascimentoUsuario = document.getElementById('usuarioNascimento').value = null;
  emailUsuario = document.getElementById('usuarioEmail').value = null;
  senhaUsuario = document.getElementById('usuarioSenha').value = null;
  confirmaSenhaUsu = document.getElementById('confirmaSenha').value = null;
}

// Exibe a mensagem se inserido
function inserido() {

 // Pega o valor da Div
  var div = document.getElementById('divSpan');
  // Cria um paragrafo
  const paragrafo = document.createElement("p");
  // Atribui Id a ela
  paragrafo.id = "inserido";
  //  Cria o texto que irá aparecer
  const conteudo = document.createTextNode('Usuário cadastrado com sucesso! Redirecionando para tela de login');
  // Atribui o texto dentro do paragrafo
  paragrafo.appendChild(conteudo);
  // Atribui uma classe de css no paragrafo
  paragrafo.classList.add('span');
  // Atribui o Paragrafo dentro da div
  div.appendChild(paragrafo);

  // Função para aparecer na tela somente por 2 segundos
  setTimeout(function () {
    var div = document.getElementById('divSpan');
    var para = document.getElementById('inserido');
    div.removeChild(para);
  }, 2000);

}
