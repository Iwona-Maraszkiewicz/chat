const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
let userName;

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({ user, id }) => {
    console.log('User ' + user + ' with id ' + id);
});
socket.on('newUser', ({ user }) => addMessage('Chat Bot', `${user} has joined the conversation!`));
socket.on('removeUser', ({ user }) => addMessage('Chat Bot', `${user} has left the conversation:(`));

const login = (e) => {
    e.preventDefault();
    if(userNameInput.value.length < 1) {
        alert('error')
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', { user: userName, id: socket.id });
    }
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) {
        message.classList.add('message--self');
      } else if (author === 'Chat Bot') {
          message.classList.add('message--chat');
      }
    message.innerHTML = `
    <h3 class="message__author">${userName === author ? "You": author}</h3>
    <div class="message__content">${content}</div>
    `;
    messagesList.appendChild(message);
}

const sendMessage = (e) => {
    e.preventDefault();
    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('Type your message!');
    }
    else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
