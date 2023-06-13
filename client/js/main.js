const chatLog = document.getElementById('chat-log')
const chatMessage = document.getElementById('chat-message')
const sendButton = document.getElementById('send-button')


// Listen for messages from the server
socket.on('message', (msg) => {
  console.log(msg)
  chatLog.value += msg.id + ':' + msg.text + '\n'
})


// Listen for click event on send button

sendButton.addEventListener('click', () => {
  socket.emit('message', chatMessage.value)
  // chatLog.value += chatMessage.value + '\n'
  chatMessage.value = ""
})