const socket = io();

let name; // variavel identificar o usuário
let textarea = document.querySelector('#textarea'); // elemento para escrever a mensagem
let messageArea = document.querySelector('.message__area'); // elemento para renderizar a mensagem

do {
  name = prompt('Please enter your name: ');
} while (!name);

textarea.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e.target.value); // passando o valor da mensagem para tratamento
  }
});

const sendMessage = (message) => {
  let msg = {
    user: name,
    message: message.trim(),
  };

  appendMessage(msg, 'outgoing'); // Pega o objeto contendo o user e a mensagem

  textarea.value = '';
  scrolltoBottom(); // função para rolagem das mensagens
  socket.emit('message', msg); // O Servidor ouve o objeto com o user e a mensagem
};

const appendMessage = (msg, type) => {
  let mainDiv = document.createElement('div'); // Criar uma div
  let className = type; // Cria uma class recebendo o valor de entrada ou saída
  mainDiv.classList.add(className, 'message'); // Adicionando a class para a div

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
  `; // Criando elementos para renderizar o user e sua mensagem

  mainDiv.innerHTML = markup; // Adicionando os elementos para a div
  messageArea.appendChild(mainDiv); // Adicionando a div para o elemento TextArea
};

socket.on('message', (msg) => {
  appendMessage(msg, 'incoming');
  scrolltoBottom(); // função para rolagem das mensagens
});

const scrolltoBottom = () => {
  messageArea.scrollTop = messageArea.scrollHeight;
};
