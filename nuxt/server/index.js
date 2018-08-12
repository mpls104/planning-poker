
const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  let server = app.listen(port, host)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
  
  // WebSocketを起動する
  soketStart(server)
  console.log('Socket.IO starts')
}

let messageQueue = []
let attendee = 0
let estimatedPoint = []

function soketStart(server) {
  // Websocketサーバーインスタンスを生成する 
  const io = require('socket.io').listen(server)

  // クライアントからサーバーに接続があった場合のイベントを作成する
  io.on('connection', socket => {
    //接続されたクライアントのidをコンソールに表示する
    console.log('id: ' + socket.id + 'is connected')

    //サーバー側で保持しているメッセージをクラアント側に送信する。
    if (messageQueue.length > 0) {
      messageQueue.forEach(message => {
        socket.emit('new-message', message)
      })
    }
    //サーバー側で保持している参加者の数をクライアント側に送信する。
    if (attendee > 0) {
        socket.emit('show-attendee', attendee)
      }

    // クライアントから送信があった場合のイベントを作成する
    socket.on('send-message', message => {
      console.log(message)

      //サーバーで保持している変数にメッセージを格納する
      messageQueue.push(message)
      //送信を行なったクライアント以外のクライアントに対してメッセージを送信する。
      socket.broadcast.emit('new-message', message)

      // サーバー側で保持しているメッセージが10を超えたら古いものから削除する。
      if (messageQueue.length > 10) {
        messageQueue = messageQueue.slice(-10)
      }
    })
    socket.on('commit-point', result => {
      console.log(result)
      estimatedPoint.push(result)
      attendee ++
    })
  })

}
start()
