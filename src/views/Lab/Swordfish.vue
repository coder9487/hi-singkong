<template>
  <div class="loadingPage" v-if="!showingFlag">
    <img class="loadingPage-mask" src="../../public/loading/loading.png" />
    <div class="loadingPage-loading-video" id="loading-video">
      <video
        @onloadstart="fullScreen('swordfish3D')"
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
    <swordfish3D
      id="swordfish3D"
      @loadingProgress="loadingProgressPercentage"
      @scene="sceneRecieve"
      v-if="1"
      v-show="showingFlag"
    ></swordfish3D>
    <swordfish2D
      id="swordfish2D"
      v-if="showingFlag"
      @lightBoxEffect="lightBoxEffect"
    ></swordfish2D>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import swordfish3D from "../components/Swordfish/Swordfish3D.vue";
import swordfish2D from "../components/Swordfish/Swordfish2D.vue";
import gsap from "gsap";

export default defineComponent({
  name: "SwordfishPage",
  components: {
    swordfish3D,
    swordfish2D,
  },
  setup() {},
  mounted() {
    let vid = document.getElementById("loading-video");
    vid.canplay = function () {
      vid.style.display = "show";
    };
  },

  watch: {
    lightBoxEffectMode: function () {
      switch (this.lightBoxEffectMode) {
        case "on":
          gsap.fromTo(
            "#swordfish3D",
            { webkitFilter: "brightness(1)", filter: "brightness(1)" },
            {
              webkitFilter: "brightness(0)",
              filter: "brightness(0)",
              duration: 1,
            }
          );
          break;
        case "off":
          gsap.fromTo(
            "#swordfish3D",
            { webkitFilter: "brightness(0)", filter: "brightness(0)" },
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
      loadingWave.style.bottom = this.loading * 0.2 + "%";
      if (this.loading >= 98 * this.DEBUG) {
        setTimeout(() => {
          this.showingFlag = true;
        }, 5000);
      }
    },
    sceneObject: function () {},
  },
  computed: {},
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
      lightBoxEffectMode: 0,
    };
  },
  methods: {
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
    lightBoxEffect(val) {
      this.lightBoxEffectMode = val;
    },
    //111356897
  },
});
</script>
<style lang="scss">
@media screen and (max-device-width: 768px) {
  .controlPan {
    z-index: 100;
    position: absolute;
    width: 100vw;
    height: 100vh;
    &-directionPan {
      height: 100vh;
      width: 20vw;
      position: absolute;
      left: 0;
      background-color: goldenrod;
    }
    &-speedPan {
      height: 100vh;
      width: 20vw;
      position: absolute;
      background-color: goldenrod;
      right: 0;
    }
  }
}
.loadingPage {
  width: 100vw;
  height: 100vh;
  // background-color: cadetblue;
  &-mask {
    // opacity: 0.3;
    position: fixed;
    width: 100%;
    z-index: 10;
    height: auto;
    top: -5vh;
  }
  &-percentage {
    z-index: 20;
    position: fixed;
    font-size: 50px;
    color: darkorange;
    bottom: 10%;
    left: 40%;
    @media screen and (max-device-width: 768px) {
      bottom: 10%;
      left: 40%;
    }
  }
  &-loading-video {
    display: hide;
    position: absolute;
    left: 15%;
    bottom: 0%;
    @media screen and (max-device-width: 768px) {
      bottom: -1500%;
    }
    z-index: 8;
  }
}
#swordfish3D {
  position: fixed;
  background-color: #35909c;
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
@media only screen and (orientation:portrait){
  #swordfish3D {
    height: 100vw;
    transform: rotate(90deg);
  }
    #swordfish2D {
    height: 100vw;
    transform: rotate(90deg);
  }
}
</style>
