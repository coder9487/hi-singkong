<template>
  <div id="IndexPageGroup">
    <img id="StartBackgroung" src="images/start.jpg" v-show="hideFlag" />
    <div
      v-show="hideFlag"
      class="start_btn text-h5 text-weight-bolder"
      @click="playVideo()"
    >
      走！去成功
    </div>
  </div>
  <video
    id="startUpVedio"
    @ended="videoFinish"
    @dblclick="videoDblcilck"
    playsinline
    preload
  >
    <source src="../../public/startupVideo.mp4" type="video/mp4" />
  </video>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    return {};
  },
  data() {
    return {
      hideFlag: true,
      clickEnable: false,
    };
  },
  methods: {
    videoFinish() {
      this.clickEnable = true;
      this.$store.commit("gameStart")
      this.$router.push("Market");
    },
    videoDblcilck() {},
    playVideo() {
      this.hideFlag = false;
      var myVideo = document.getElementById("startUpVedio");
      myVideo.play();
    },
  },
});
</script>
<style lang="scss" scoped>
#startUpVedio {
  width: 100vw;
  height: auto;
  position: absolute;
  z-index: 2;
}

.start_btn {
  width: 20%;
  height: 15%;
  border-radius: 50px;
  position: absolute;
  bottom: 16%;
  right: 40vw;
  border: 20px;
  display: flex;
  background-color: #ffffff;
  color: #1aa4b1;
  z-index: 5;
  text-align: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  transition: 1s;
  font-size: large;

  @media screen and (min-width: 1024px) {
    padding: 1%;
    height: 10%;
    font-size:x-large;
  }

  &:hover {
    border-radius: 50px;
    transition: 1s;
    background-color: #1aa4b1;
    color: white;
  }
}

#StartBackgroung {
  z-index: 4;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  position: absolute;
}
</style>
