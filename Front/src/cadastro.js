
// Verifica se existe varíavel na URL
var loc = window.location.search.substring(1, window.location.search.length);
var idPet = loc.split("=")[1];

// Dispara Função Inicio
inicio()

function inicio() {
  // Verifica se o IdPet é maior que 0, ou seja se veio algum Id de pet pela URL para Editar
  // se tiver executa a função idUrl, se não continua zerado
  if (idPet > 0)
    idUrl()
}

// Função GET para buscar os dados do id vindo do URL (se tiver) e distribuir pelos seus respectivos campos
async function idUrl() {
  
  // Fetch faz a requisição para o BackEnd para retornar os valores do Banco,
  // a variável data está tratando a resposta vinda do Back para virar um Json para ler melhor
  let response = await fetch(`http://localhost:5114/api/Pets/${idPet}`);
  let data = await response.json();

  // Pega o caminho dos campos pelo Id e insere o valor dele de acordo com a resposta do banco

  // Pet
  cod = document.getElementById('cod').value = idPet;
  nomePet = document.getElementById('nomePet').value = data.petName;
  idadePet = document.getElementById('idadePet').value = data.petIdade;
  racaPet = document.getElementById('racaPet').value = data.petRaca;
  pesoPet = document.getElementById('pesoPet').value = data.petWeight;
  sexoPet = document.getElementById('sexoPet').value = data.petGender;
  obsPet = document.getElementById('obsPet').value = data.petObs;

  // Tutor
  nomeTutor = document.getElementById('nomeTutor').value = data.petTutorNome;
  cpfTutor = document.getElementById('CPFTutor').value = data.petTutorCPF;
  contatoTutor = document.getElementById('ContatoTutor').value = data.petTutorContato;
  cepTutor = document.getElementById('CepTutor').value = data.petTutorCEP;
  enderecoTutor = document.getElementById('EnderecoTutor').value = data.petTutorEndereco;
  numeroTutor = document.getElementById('numeroTutor').value = data.petTutorNumero;
  cidadeTutor = document.getElementById('cidadeTutor').value = data.petTutorCidade;
}

// Função que requisita a API de cep
async function cep() {

  // // Pega o valor do campo de cep
  // var valuecep = document.getElementById('CepTutor').value;
  // // Fetch faz a requisição PAra a API e data transforma para Json
  // let response = await fetch(`https://brasilapi.com.br/api/cep/v1/${valuecep}`);
  // let data = await response.json();

  // // Atribui os valores retornados para os respectivos campos (Concatenando para ficar mais facil, numa situação real cada um teria seu campo)
  // document.getElementById("EnderecoTutor").value = `${data.street}, ${data.neighborhood}`;
  // document.getElementById("cidadeTutor").value = `${data.city} - ${data.state}`;
  var request = new XMLHttpRequest();

request.open('GET', `https://kitsu.io/api/edge/manga?filter[text]=${cepTutor}`);

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

request.send();

}
// Declarando variáveis do Pet
var nomePet;
var idadePet;
var racaPet;
var pesoPet;
var sexoPet;
var obsPet;

// Declarando variáveis do Tutor
var nomeTutor;
var cpfTutor;
var contatoTutor;
var cepTutor;
var enderecoTutor;
var numeroTutor;
var cidadeTutor;


// Função que Pega os Valores dos campos pelo Id (é Chamada pelo onChangeCampos)
function onChangeCampos(e) {
  // Pet
  nomePet = document.getElementById('nomePet').value;
  idadePet = document.getElementById('idadePet').value;
  racaPet = document.getElementById('racaPet').value;
  pesoPet = document.getElementById('pesoPet').value;
  sexoPet = document.getElementById('sexoPet').value;
  obsPet = document.getElementById('obsPet').value;

  // Tutor
  nomeTutor = document.getElementById('nomeTutor').value;
  cpfTutor = document.getElementById('CPFTutor').value;
  contatoTutor = document.getElementById('ContatoTutor').value;
  cepTutor = document.getElementById('CepTutor').value;
  enderecoTutor = document.getElementById('EnderecoTutor').value;
  numeroTutor = document.getElementById('numeroTutor').value;
  cidadeTutor = document.getElementById('cidadeTutor').value;

}

// Função que irá salvar no Banco
function submit() {

  // Pega os Valores pelo Id
  nomePet = document.getElementById('nomePet').value;
  idadePet = document.getElementById('idadePet').value;
  racaPet = document.getElementById('racaPet').value;
  pesoPet = document.getElementById('pesoPet').value;
  sexoPet = document.getElementById('sexoPet').value;
  obsPet = document.getElementById('obsPet').value;
  
  nomeTutor = document.getElementById('nomeTutor').value;
  cpfTutor = document.getElementById('CPFTutor').value;
  contatoTutor = document.getElementById('ContatoTutor').value;
  cepTutor = document.getElementById('CepTutor').value;
  enderecoTutor = document.getElementById('EnderecoTutor').value;
  numeroTutor = document.getElementById('numeroTutor').value;
  cidadeTutor = document.getElementById('cidadeTutor').value;

  // Verifica se algum campo esta vázio
  if(nomePet == '' || idadePet == '' || racaPet == '' || pesoPet == '' || sexoPet == '' || obsPet == '' || nomePet == ''|| 
     nomeTutor == '' || cpfTutor == '' || contatoTutor == '' || cepTutor == '' || enderecoTutor == '' || numeroTutor == ''|| cidadeTutor == '') {
    return alert('Todos os campos devem ser preenchidos!')
  }
  else {
    const data = {
      PetName: nomePet, PetWeight: pesoPet, PetGender: sexoPet, PetRaca: racaPet, PetIdade: idadePet, PetObs: obsPet,
      PetTutorNome: nomeTutor, PetTutorCPF: cpfTutor, PetTutorContato: contatoTutor, PetTutorCEP: cepTutor,
      PetTutorEndereco: enderecoTutor, PetTutorNumero: numeroTutor, PetTutorCidade: cidadeTutor
    };

    const dataPut = {
      PetName: nomePet, PetWeight: pesoPet, PetGender: sexoPet, PetRaca: racaPet, PetIdade: idadePet, PetObs: obsPet,
      PetTutorNome: nomeTutor, PetTutorCPF: cpfTutor, PetTutorContato: contatoTutor, PetTutorCEP: cepTutor,
      PetTutorEndereco: enderecoTutor, PetTutorNumero: numeroTutor, PetTutorCidade: cidadeTutor, PetId: idPet,
    };

    // Verifica se ja tem Id, se tiver ele Chama o PUT se não o POST
    if (idPet > 0)
      putData(dataPut)
    else
      postData(data)

  }

}

// Função de Post para salvar no Banco
async function postData(data) {
  // Fetch faz a solicitação e envio ao Back do metodo post com o corpo construido com o valor dos campos
  await fetch("http://localhost:5114/api/Pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    // Irá fazer isso se der tudo certo
    .then((data) => {
      console.log("Success:", data);
      if (data.status != 404) {
        // Função que limpa os campos e que dispará mensagem de salvo
        limpa()
        inserido()
      }
    })
    // Caso tenha algum erro, dispara o Catch
    .catch((error) => {
      console.error("Error:", error);
    })


}

// Função que irá Atualizar os dados (PUT)
async function putData(data) {
// Fetch faz a solicitação e envio ao Back do metodo put com o corpo construido com o valor dos campos
  await fetch(`http://localhost:5114/api/Pets/${idPet}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    // Irá fazer isso se der tudo certo
    .then((data) => {
      console.log("Success:", data);
      if (data.status != 404) {
        limpa()
        alterado()
      }

    })
    // Caso tenha algum erro, dispara o Catch
    .catch((error) => {
      console.log(data)
      console.error("Error:", error);
    })



}

// Função que limpa os campos atribuindo valor nulo
function limpa() {

  nomePet = document.getElementById('nomePet').value = null;
  idadePet = document.getElementById('idadePet').value = null;
  racaPet = document.getElementById('racaPet').value = null;
  pesoPet = document.getElementById('pesoPet').value = null;
  sexoPet = document.getElementById('sexoPet').value = null;
  obsPet = document.getElementById('obsPet').value = null;

  nomeTutor = document.getElementById('nomeTutor').value = null;
  cpfTutor = document.getElementById('CPFTutor').value = null;
  contatoTutor = document.getElementById('ContatoTutor').value = null;
  cepTutor = document.getElementById('CepTutor').value = null;
  enderecoTutor = document.getElementById('EnderecoTutor').value = null;
  numeroTutor = document.getElementById('numeroTutor').value = null;
  cidadeTutor = document.getElementById('cidadeTutor').value = null;
}

// Mensagem De inserído
function inserido() {

  // Pega o valor da Div
  var div = document.getElementById('divSpan');
  // Cria um paragrafo
  const paragrafo = document.createElement("p");
  // Atribui Id a ela
  paragrafo.id = "inserido";
  //  Cria o texto que irá aparecer
  const conteudo = document.createTextNode('Cliente cadastrado com sucesso!');
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

// Mensagem De inserído
function alterado() {

  // Pega o valor da Div
  var div = document.getElementById('divSpan');
  // Cria um paragrafo
  const paragrafo = document.createElement("p");
  // Atribui Id a ela
  paragrafo.id = "inserido";
  //  Cria o texto que irá aparecer
  const conteudo = document.createTextNode('Cliente alterado com sucesso!');
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
