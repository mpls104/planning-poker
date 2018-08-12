<template>
  <section class="section"> 
      <div id="wrapper" class="container">
          <article class="media">
              <div class="media-content">
                  <div class="field is-grouped">
                      <p classs="control is-expaned">
                          <input class ="input" type="text" v-model="message" @keyup.enter="sendMessage" placeholder="message">
                      </p>
                      <p class="control">
                          <button class="button is-info" @click="sendMessage">
                              Send
                          </button>
                      </p>
                  </div>
              </div>
          </article>    
          <article class="media" v-for="(message, index) in reverseMessages" :key="index">
              <figure class="media-left">
                  <p class="image is-64x64">
                      <img src="https://bulma.io/images/placeholders/128x128.png">
                 </p>
              </figure>
              <div class="media-content">
                 <div class="content">
                   <p>
                      <strong>id: {{ message.user }}</strong>
                      <br>
                      {{ message.text }}
                      <br>
                      <small><a>Like</a> · <a>Reply</a> · {{ message.date }}</small>
                   </p>
                 </div>
               </div>
             </article>
             <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
      </div>
  </section>
</template>

<script>
import io from 'socket.io-client'

export default {
    data() {
        return {
            message: '',
            messages: [],
            socket: '',
            isLoading: true
        }
    },
    computed: {
        // 配列の後ろ(新しいもの)から順に表示させたいので反転させる
        reverseMessages: function() {
            return this.messages.slice().reverse()
        },
    },
    mounted() {
        // VueインスタンスがDOMにマウントされたらSocketインスタンスを生成する
        this.socket = io()

        // サーバー側で保持しているメッセージを受信する
        this.socket.on('new-message', message => {
            this.messages.push( message || {} )
        })

        // コンポーネントがマウントされてから１秒間はローディングする
        setTimeout(() => {
            this.isLoading = false
        }, 1000)
    },
    methods: {
        sendMessage() {
            if(!this. message.trim()) {
                return
            }

            let now = new Date()
            now.setTime(now.getTime() + 1000 * 60 * 60 * 9)
            now = now.toJSON().split('T')[1].slice(0,5)

            // Create Message Object
            let message = {
                user: this.socket.id,
                date: now,
                text: this.message.trim()
            }

            // Add message to user's own vue data objecct
            this.messages.push(message)
            // Send message to server
            this.socket.emit('send-message', message)
            // make input element empty
            this.message = ''
        }
    }
}
</script>
