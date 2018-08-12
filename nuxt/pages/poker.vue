<template>
    <section class="section">
        <div id="wrapper" class="container">
            <p class="media">
                Attendee: {{attendee}}
                <br>
                Selected: {{showSelected}}
            </p>
           <div class="tile" v-for="(point, index) in dflpoints" :key="index">
            <button class="button rounded-img-container  is-info is-large" @click="sendPoint">
            {{point}}
            </button>
           </div> 
            <p class="media">
            <button class="button is-medium is-primary" @click="sendMessage">     
            Show Result
            </button>
            <button class="button is-medium is-primary" @click="sendMessage">     
            Clear Select
            </button>            
            </p>           
        </div>    
    </section>
</template>

<script>
import io from 'socket.io-client'

export default {
    data() {
        return {
            selectedPoint: '',
            dflpoints: ['1pt', '2pt', '3pt', '5pt', '7pt'],
            attendee: 0,
            socket: '',
            isLoading: true
        }
    },
    computed: {
        showSelected: function() {
            return this.selectedPoint
        },
    },
    mounted() {
        // VueインスタンスがDOMにマウントされたらSocketインスタンスを生成する
        this.socket = io()

        // サーバー側で保持しているattendeeを受信する
        this.socket.on('show-attendee', attendee => {
            this.attendee = attendee
        })

        // コンポーネントがマウントされてから１秒間はローディングする
        setTimeout(() => {
            this.isLoading = false
        }, 1000)
    },
    methods: {
        sendPoint() {
            // Create Point Object
            let result = {
                user: this.socket.id,
                point: this.index
            }
            console.log(this.selectedPoint)
            this.attendee ++
            
            // Send message to server
            this.socket.emit('commit-point', result)
            // Add user's own attendee & point
  
            
        }
    }
}
</script>
<style>
.rounded-img-container {
  display: inline-block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
.rounded-img {
  width: inherit;
  height: inherit;
  border-radius: inherit;
  
  object-fit: cover;
  object-position: center;
}
</style>
