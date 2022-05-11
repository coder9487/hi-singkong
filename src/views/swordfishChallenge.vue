<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" id="loadingPage-mask" />
    <div class="loadingPage-text">
      <div v-if="(ENABLE_FOR_MOBILE && IS_MOBILE) || !IS_MOBILE">
        {{ loading_text[loading_text_index] }}
      </div>
      <div v-else class="loadingPage-text-dev">
        手機版尚未完成系統測試，請使用電腦版以獲得最佳體驗
        <div>
          Mobile and VR version are not supported now, please try Hi！ Chenggong
          on desktop.
        </div>
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
    <Swordfish3D
      id="Swordfish3D-tag"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="1"
      v-show="showingFlag"
    ></Swordfish3D>
    <Swordfish2D id="Swordfish2D-tag" v-if="showingFlag"></Swordfish2D>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import Swordfish3D from "../components/swordfishChallenge/Swordfish3D";
import Swordfish2D from "../components/swordfishChallenge/Swordfish2D";
import gsap from "gsap";

export default defineComponent({
  name: "DiningTable",
  components: {
    Swordfish3D,
    Swordfish2D,
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
            "#Swordfish3D-tag",
            { webkitFilter: "brightness(1)", filter: "brightness(1)" },
            {
              webkitFilter: "brightness(0.6)",
              filter: "brightness(0.6)",
              duration: 1,
            }
          );
          break;
        case false:
          gsap.fromTo(
            "#Swordfish3D-tag",
            { webkitFilter: "brightness(0.6)", filter: "brightness(0.6)" },
            {
              webkitFilter: "brightness(1)",
              filter: "brightness(1)",
              duration: 1,
            }
          );
          break;
      }
    },
    loading: function () {
      // console.log("loading progress ", this.loading);
      let loadingWave = document.getElementById("loading-video");
      if (this.IS_MOBILE)
        loadingWave.style.bottom = this.loading * 0.3 - 70 + "%";
      else loadingWave.style.bottom = this.loading * 0.2 + "%";
      if (
        this.loading >= 95 &&
        ((this.ENABLE_FOR_MOBILE && this.IS_MOBILE) || !this.IS_MOBILE)
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
        "魚市場有現場代殺魚的服務喔，有時候一堆魚只要100塊就幫你處理得乾乾淨淨!",
        " 有競標證的商家才可競標魚市場的大魚，已賣出的魚身上會貼有店家商標呢",
        " 真實的旗魚嘴巴都會事先鋸掉，因為擔心剛捕上船掙扎的過程會刺傷漁夫",
        " 黃鰭鮪也是魚市場的常客，吃法多元又新鮮，在地居民買一條能吃好幾天呢",
        " 鬼頭刀能做魚排、魚鬆、魚丸、魚塊，煎煮炒炸樣樣都好吃，外銷業績非常驚人!",
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
@media screen and (min-device-width: 1024px) {
}
.loadingPage {
  width: 100vw;
  height: 100vh;
  //  background-color: cadetblue;
  &-mask {
    //  opacity: 0.3;
    position: fixed;
    width: 100%;
    z-index: 10;
    height: auto;
    top: -5vh;
  }
  &-text {
    display: flex;
    align-items: center;
    z-index: 20;
    position: fixed;
    text-align: center;
    bottom: 25%;
    font-size: 10px;
    color: #174275;
    display: flex;
    transform: translateX(55%);
    @media screen and (min-device-width: 1024px) {
      bottom: 30%;
      font-size: 20px;
      left: 0%;
      // transform: translateX(50%);
    }
    &-dev {
      transform: translateX(-10%);
    }
  }
  &-percentage {
    z-index: 20;
    position: fixed;
    font-size: 50px;
    color: darkorange;
    bottom: 10%;
    left: 40%;
    @media screen and (min-device-width: 1024px) {
      bottom: 10%;
      left: 40%;
    }
  }
  &-loading-video {
    opacity: 0;
    position: absolute;
    // left: 15%;
    bottom: -70%;
    @media screen and (min-device-width: 1024px) {
      left: 15%;
      bottom: -50vh;
    }
    z-index: 8;
  }
}
#Swordfish3D-tag {
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
@media screen and (orientation: portrait) {
  .loadingPage {
    &-loading-video {
      top: 20vh;
    }
    &-mask {
      top: 20vh;
      height: 100vh;
      width: auto;
      transform: translateX(-25%);
    }
  }
}
// @media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape)
// {
//   html {
//     transform: rotate(-90deg);
//     transform-origin: left top;
//     width: 100vh;
//     overflow-x: hidden;
//     position: absolute;
//     top: 100%;
//     left: 0;
//   }
// }
</style>
