<template>
    <section class="section">
        <div id="wrapper" class="container">
            <p class="media">
                Attendee: {{attendee}}
                <br>
                Selected: {{showSelected}}
            </p>
           <div class="tile flex">
           <div class="tile" v-for="(point, index) in dflpoints" :key="index">
            <button class="button rounded-img-container  is-info is-large" @click="sendPoint(index)" :disabled="submitted">
            {{point}}
            </button>
           </div> 
           </div>
            <div class="media inline">
           <div class="flex">
            <button class="button is-medium is-primary" @click="showResult()" :disabled="!submitted">
            Show Result
            </button>
            <button class="button is-medium is-primary" @click="clearPoint()" :disabled="!submitted">
            Clear Select
            </button>            
            </div>
            </div>     
        </div>
    </section>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      selectedPoint: "",
      dflpoints: ["1pt", "2pt", "3pt", "5pt", "8pt", "13pt"],
      attendee: 0,
      socket: "",
      isLoading: true,
      submitted: false,
      results : []
    };
  },
  computed: {
    showSelected: function() {
      return this.selectedPoint;
    }
  },
  mounted() {
    // VueインスタンスがDOMにマウントされたらSocketインスタンスを生成する
    this.socket = io();

    // サーバー側で保持しているattendeeを受信する
    this.socket.on("show-attendee", attendee => {
      this.attendee = attendee;
    });

    // コンポーネントがマウントされてから１秒間はローディングする
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    sendPoint(index) {
        console.log(this)
    this.selectedPoint = this.dflpoints[index]
    // disable another button
    this.submitted = true
      // Create Point Object
      let result = {
        user: this.socket.id,
        point: this.index
      };
      console.log(this.selectedPoint);
      this.attendee++;

      // Send message to server
      this.socket.emit("commit-point", result);
    },
    clearPoint() {
        this.attendee--;
        // enable another button
        this.submitted = false
        this.selectedPoint =  ""
        this.socket.emit("remove-point", this.selectedPoint);
    },
    showResult() {
    //   console.log()
    this.socket.emit("show-result");
    },
  }
};
</script>
<style>
.rounded-img-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 5px;
}
.rounded-img {
  width: inherit;
  height: inherit;
  border-radius: inherit;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: 20px;
  justify-content: space-around;
}
.inline {
  display: inline;
  margin: 20px;
}
</style>
