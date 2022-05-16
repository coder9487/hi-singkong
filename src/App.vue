<template>
  <q-layout>
    <q-page-container>
      <router-view id="router-view" />

      <img id="mobile_rotate" src="../public/images/mobile_rotate.png" />
      <div class="icon"></div>
      <q-card class="setting-card" v-show="show">
        <q-card-section>
          <div v-if="1">
            體驗效能
            <q-radio
              color="teal-7"
              v-model="setting.performace"
              val="std"
              label="標準"
            />
            <q-radio
              color="teal-7"
              v-model="setting.performace"
              val="high"
              label="高"
            />
          </div>

          <div v-if="1">
            音效 <q-toggle color="cyan-6" v-model="setting.sound" keep-color />
          </div>
          <div class="q-pa-md q-gutter-md">
            <q-btn
              rounded
              color="teal-9"
              label="回首頁"
              @click.stop="this.$router.replace('/')"
            />
            <q-btn
              rounded
              color="teal-9"
              label="重整頁面"
              @click.stop="resetScreen"
            />
          </div>
        </q-card-section>
      </q-card>
      <img
        class="icon-infomation"
        src="icons/gear.png"
        @click.stop="show = !show"
      />
      <img
        class="icon-fullscreen"
        src="icons/fullscreen.png"
        @click.stop="fullScreen"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
export default {
  name: "LayoutDefault",

  components: {},

  setup() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // if any scroll is attempted, set this to the previous value
    window.onscroll = () => {
      window.scrollTo(scrollLeft, scrollTop);
    };
    window.onresize = () => {
      // document.body.style.zoom = "100%";
      if (window.innerWidth < window.innerHeight) {
        document.getElementById("mobile_rotate").style.zIndex = 500;
        document.getElementById("mobile_rotate").style.display = "inline";
      } else {
        document.getElementById("mobile_rotate").style.zIndex = -5;
        document.getElementById("mobile_rotate").style.display = "none";
      }
    };

    return {};
  },
  mounted() {
    if (window.innerWidth < window.innerHeight) {
      document.getElementById("mobile_rotate").style.zIndex = 500;
      document.getElementById("mobile_rotate").style.display = "inline";
    } else {
      document.getElementById("mobile_rotate").style.zIndex = -5;
      document.getElementById("mobile_rotate").style.display = "none";
    }
  },
  data() {
    return {
      show: ref(false),
      setting: {
        performace: ref("std"),
        sound: ref(true),
      },
    };
  },
  watch: {
    setting: {
      handler(val) {
        if (this.$store.state.Renderer) {
          window.renderer = this.$store.state.Renderer;

          if (this.setting.performace == "std") {
            window.renderer.setPixelRatio(0.8);
          } else if (this.setting.performace == "high") {
            window.renderer.setPixelRatio(1.5);
          }
        }
        if (this.$store.state.Scene) {
          window.sound = this.$store.state.Scene;

          if (this.setting.sound == true) {
            window.sound.play();
          } else if (this.setting.sound == false) {
            window.sound.pause();
          }
        }
      },
      deep: true,
    },
    show: function () {
      switch (this.show) {
        case true:
          break;
        case false:
          break;
      }
    },
  },
  methods: {
    resetScreen() {
      window.location.reload();
    },
    fullScreen() {
      let elem = document.getElementById("app");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      elem.style.width = "100%";
      elem.style.height = "100%";
    },
  },
};
</script>
<style lang="scss" scoped>
#mobile_rotate {
  height: auto;
  width: 100vw;
  position: absolute;
  z-index: -5;
}
.setting-card {
  padding: 1vw;
  position: absolute;
  right: 3vw;
  bottom: 10vh;
  transform: translate(0, -50%);
  z-index: 50;
  border-radius: 30px;
  @media screen and (min-width: 1024px) {
    left: 3vw;
    right:auto;
    bottom: 10vh;
  }
}
.icon {
  position: absolute;
  z-index: 20;
  left: 3vw;
  bottom: 3vh;

  &-infomation {
    position: absolute;
    z-index: 20;
    width: 4vw;
    right: 2vw;
    top: 3vw;
    @media screen and (min-width: 1024px) {
      left: 3vw;
      bottom: 3vw;
      right: auto;
      top: auto;
      width: 4vw;
    }
    &:hover {
      cursor: pointer;
    }
  }

  &-fullscreen {
    position: absolute;
    z-index: 20;
    width: 4vw;
    right: 8vw;
    top: 3vw;
    @media screen and (min-width: 1024px) {
      left: 3vw;
      bottom: 8vw;
      right: auto;
      top: auto;
      width: 4vw;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
<style>
body {
  background-color: white;
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
</style>
