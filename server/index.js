require('dotenv').config();
const http = require('http')
const express = require('express')
const socketIO  = require('socket.io')
const path = require('path')
const {Configuration, OpenAIApi} = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let messages = []

// Serve hosted index.html
app.use(express.static(path.join(__dirname, '../client')))

io.on('connection', (socket) => {
  // Generate a random ID for the next client
  const clientID = 'User-' + Math.random().toString(36).substring(2,9)

  // Send existing messages to the new client
  messages.forEach(msg=>{
    socket.emit('message', msg)
  })

  socket.on('message', async (msg)=>{
    const fullMsg = {id: clientID, text: msg}
    messages.push(msg)
    io.emit('message', fullMsg)



    // Generate an AI response and send it
    const aiResponse = await generateAiResponse(msg)
    const aiMsg = {id: 'ChatG', text: aiResponse}
    messages.push(aiMsg)
    io.emit('message', aiMsg)
  })

  socket.on('disconnect', () =>{
    console.log(clientID + ' disconnected')
  })
})


server.listen(3000, () => console.log('listening on *:3000'))

// Function to generate an AI response
async function generateAiResponse(input) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: input,
  })

  return response.data.choices[0].text.trim()
}