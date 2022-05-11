<template>
  <div id="IndexPageGroup">
    <img id="StartBackgroung" src="images/challengeIndex.jpeg" v-show="hideFlag" />
    <div
      v-show="hideFlag"
      class="start_btn text-h5 text-weight-bolder"
      @click="videoFinish()"
    >
      開始體驗
    </div>
  </div>
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
  mounted(){

},
  methods: {
    videoFinish() {
      this.clickEnable = true;
      this.$router.push("swordfishChallenge");
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

@media screen and (orientation: portrait) {
  #IndexPageGroup {
    transform: rotate(-90deg);
    transform-origin: left top;
    // width: 100vh;
    // overflow-x: hidden;
    // position: absolute;
    // top: 100%;
    // left: 0;
  }
}

#startUpVedio {
  width: 100vw;
  height: auto;
  position: absolute;
  z-index: 2;
}

.start_btn {
  width: 15%;
  height: 15%;
  border-radius: 50px;
  position: absolute;
  bottom: 7vh;
  left: 8vw;
  border: 20px;
  display: flex;
  background-color: #F49D1A;
  color: #ffffff;
  z-index: 5;
  text-align: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-size: large;
  transition: 1s;

  @media screen and (min-width: 1024px) {
    padding: 1%;
    height: 10%;
    font-size:x-large;
  }

  &:hover {
    border-radius: 50px;
    transition: 1s;
    background-color: #FF7A00;
    color: white;
  }
}

#StartBackgroung {
  z-index: 4;
  min-width: 100vw;
  height: 120vh;
  overflow-y: hidden;
  display: flex;
  position: absolute;
}
</style>
