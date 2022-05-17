<template>
  <div class="loading">
    <div>
      <q-img id="loading-mask" src="loading/loading.png"></q-img>
    </div>

    <div id="loading-video-container" v-if="LOTTIE"></div>
    <video
      id="loading-video-container"
      v-if="!LOTTIE"
      src="loading/wave.mp4"
      autoplay
      muted
      playsinline
      loop
    ></video>
  </div>
</template>

<script>
import lottie from "lottie-web";


export default {
  name: "loading",
  setup() {
    let WindowObject = window;
    let LOTTIE = false;
    return {
      WindowObject,
      LOTTIE,
    };
  },
  mounted() {
    if (this.LOTTIE) {
      const animation = lottie.loadAnimation({
        container: document.getElementById("loading-video-container"),
        renderer: "svg", // 渲染方式:svg、canvas
        loop: true, //循环播放，默认：false
        autoplay: true, //自动播放 ，默认true
        path: "loading/loading.json", // json 路径
      });
      animation.play();
    } else {
      let image = document.getElementById("loading-mask");
       let vid = document.getElementById("loading-video-container");
      // vid.canplay = function () {
      //   vid.style.display = "show";
      // };
      if(image.complete)
      {
        vid.style.display = "show";
      };

    }
  },
  data() {
    return {};
  },
  props: ["LoadingProgress"],
  watch: {
    LoadingProgress: function (val) {
      console.log("recieve ",val,"in loading page ");
      let videoObject = this.WindowObject.document.getElementById(
        "loading-video-container"
      );
      if (videoObject != null)
        if (val < 1) {
          videoObject.style.top = (1 - val) * 50 + "%";
        } else {
        }
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  z-index: 100;
  height: 100vh;
  width: 100vw;
  &-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 110;
  }
}
#loading{
    &-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 110;
  }
  &-video-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 105;
  top: 50%;
}
}

</style>
