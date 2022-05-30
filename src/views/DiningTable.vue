<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" id="loadingPage-mask" />

    <div class="loadingPage-text">
      <div
        class="loadingPage-text-content"
        v-if="(ENABLE_FOR_MOBILE && IS_MOBILE) || !IS_MOBILE"
      >
        <div>{{ loading_text[loading_text_index] }}</div>
      </div>

      <div v-else class="loadingPage-text-dev">
        手機版尚未完成系統測試，請使用電腦版以獲得最佳體驗
        <div>
          Mobile and VR version are not supported now, please try Hi！ Chenggong
          on desktop.
        </div>
      </div>
    </div>

    <div class="loadingPage-text-1">
      <div class="loadingPage-text-content">
        <p>
          <b>{{ this.loading}}%</b>
        </p>
      </div>
    </div>
    <div class="loadingPage-loading-video" id="loading-video">
      <video
        src="../../public/loading/wave.mp4"
        autoplay
        muted
        playsinline
        loop
        style="display: inline"
      ></video>
    </div>
  </div>
  <div id="colorSlide">
    <DiningTable3D
      id="DiningTable3D-tag"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="1"
      v-show="showingFlag"
    ></DiningTable3D>
    <DiningTable2D id="DiningTable2D-tag" v-if="showingFlag"></DiningTable2D>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import DiningTable3D from "../components/DiningTable/DiningTable3D";
import DiningTable2D from "../components/DiningTable/DiningTable2D";
import gsap from "gsap";

export default defineComponent({
  name: "DiningTable",
  components: {
    DiningTable3D,
    DiningTable2D,
  },
  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    let ENABLE_FOR_MOBILE = 1;
    return {
      IS_MOBILE,
      ENABLE_FOR_MOBILE,
    };
  },
  mounted() {
    let vid = document.getElementById("loading-video");
    // let photo = document.getElementById("loadingPage-mask");
    let image = document.getElementById("loadingPage-mask");
    image.onload = () => {
      vid.style.opacity = 1;
    };
    image.src = "../loading/loading2.png";
    this.timer = setInterval(() => {
      this.increaseLoadingText();
    }, 3000);
  },

  watch: {
    lightBoxEffectMode: function () {
      switch (this.lightBoxEffectMode) {
        case true:
          gsap.fromTo(
            "#DiningTable3D-tag",
            { webkitFilter: "brightness(1) blur(0px)", filter: "brightness(1) blur(0px)" },
            {
              webkitFilter: "brightness(0.6) blur(4px)",
              filter: "brightness(0.6) blur(4px)",
              duration: 1,
            }
          );
          break;
        case false:
          gsap.fromTo(
            "#DiningTable3D-tag",
            { webkitFilter: "brightness(0.6) blur(4px)", filter: "brightness(0.6) blur(4px)" },
            {
              webkitFilter: "brightness(1) blur(0px)",
              filter: "brightness(1) blur(0px)",
              duration: 1,
            }
          );
          break;
      }
    },
    loading: function () {
       console.log("loading progress ", this.loading);
      let loadingWave = document.getElementById("loading-video");
      if (this.IS_MOBILE)
        loadingWave.style.bottom = this.loading  * 0.1 +10+ "%";
      else loadingWave.style.bottom = this.loading * 0.1+ 30 + "%";
      if (
        this.loading >= 98 &&
        ((this.ENABLE_FOR_MOBILE && this.IS_MOBILE) || !this.IS_MOBILE) &&
        !this.DEV_FOR_LOADING
      ) {
        setTimeout(() => {
          this.showingFlag = true;
        }, 5000);
      }
    },
    sceneObject: function () {},
  },
  beforeUnmount() {
    window.clearInterval(this.timer);
  },
  computed: {
    returnloadingProgress() {
      return this.loadingProgress;
    },
    lightBoxEffectMode() {
      return this.$store.state.Fozzy3D;
    },
  },
  data() {
    return {
      audio: null,
      sceneObject: null,
      loading: ref(0),
      showingFlag: false,
      MobileMoving: reactive({}),
      progressPercent: ref(0),
      showEnable: ref(true),
      DEBUG: 1,
      golbalEvent: { dblclick: false },
      loading_text: [
        "不同季節可以吃到不同種類的旗魚，下次來成功歡迎跟老闆聊聊今天吃什麼旗魚喔!",
        " 海豬腳其實不是豬腳而是旗魚尾，因為吃起來很有膠質所以稱為海豬腳",
        " 肚臍橙香甜多汁籽又少，不論大人小孩都喜歡，是成功的冬季產季熱銷農產",
      ],
      loading_text_index: 0,
    };
  },
  methods: {
    increaseLoadingText() {
      this.loading_text_index++;
      if (this.loading_text_index >= this.loading_text.length - 1)
        this.loading_text_index = 0;
    },
    fullScreen(id_tag) {
      let elem = document.getElementById(id_tag);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    },
    loadingProgressPercentage(val) {
      this.loading = (val * 99).toFixed(2);
    },
    sceneRecieve(val) {
      this.sceneObject = val;
    },

    //111356897
  },
});
</script>
<style lang="scss">
// @media screen and (min-device-width: 1024px) {
// }
// .loadingPage {
//   width: 100vw;
//   height: 100vh;
//   //  background-color: cadetblue;
//   &-mask {
//     //  opacity: 0.3;
//     position: fixed;
//     width: 100%;
//     z-index: 10;
//     height: auto;
//     top: -5vh;
//   }
//   &-text {
//     left: 50vw;
//     transform: translateX(-50%);
//     display: flex;
//     justify-content: space-around;
//     align-items: center;
//     z-index: 20;
//     position: fixed;
//     text-align: center;
//     bottom: 25%;
//     font-size: 10px;
//     color: #174275;
//     margin: 0 auto;
//     @media screen and (min-device-width: 1024px) {
//       bottom: 30%;
//       font-size: 20px;
//     }
//     &-content {
//       display: flex;
//       align-content: center;
//       align-items: center;
//       justify-content: center;
//     }
//     &-dev {
//       transform: translateX(-10%);
//     }
//   }
//   &-percentage {
//     z-index: 20;
//     position: fixed;
//     font-size: 50px;
//     color: darkorange;
//     bottom: 10%;
//     left: 40%;
//     @media screen and (min-device-width: 1024px) {
//       bottom: 10%;
//       left: 40%;
//     }
//   }
//   &-loading-video {
//     opacity: 0;
//     position: absolute;
//     // left: 15%;
//     bottom: -70%;
//     @media screen and (min-device-width: 1024px) {
//       left: 15%;
//       bottom: -50vh;
//     }
//     z-index: 8;
//   }
// }
#DiningTable3D-tag {
  position: fixed;
  // background-color: #35909c;
}

#Navigate {
  position: absolute;
  // background-color: chartreuse;
  // opacity: 0.3;
  z-index: 100;
  width: 100vw;
  height: 100vh;
}
#colorSlide {
  background-color: black;
}
// @media screen and (orientation: portrait) {
//   .loadingPage {
//     &-loading-video {
//       top: 20vh;
//     }
//     &-mask {
//       top: 20vh;
//       height: 100vh;
//       width: auto;
//       transform: translateX(-25%);
//     }
//   }
// }
</style>
