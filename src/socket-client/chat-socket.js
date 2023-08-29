/* eslint-disable prettier/prettier */

const socket = io('https://swap-server.cyclic.cloud/');

const message = document.getElementById('message');

const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
  socket.emit('message', { data: message.value });
};

socket.on('message', ({ data }) => {
  hendleNewMessage(data);
});

const hendleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
