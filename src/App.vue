<template>
  <q-layout>
    <q-page-container>
      <router-view />
      <img id="mobile_rotate" src="../public/images/mobile_rotate.png" />
      <div class="icon"></div>
      <img
        class="icon-infomation"
        src="../public/icons/information.png"
        @click="fullScreen()"
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
        document.getElementById("mobile_rotate").style.zIndex = 200;
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
      document.getElementById("mobile_rotate").style.zIndex = 200;
      document.getElementById("mobile_rotate").style.display = "inline";
    } else {
      document.getElementById("mobile_rotate").style.zIndex = -5;
      document.getElementById("mobile_rotate").style.display = "none";
    }
  },
  data() {
    return {};
  },
  methods: {
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
  top:-10vh;
}

.icon {
  position: absolute;
  z-index: 20;
  left: 3vw;
  bottom: 3vh;

  &-infomation {
    position: absolute;
    z-index: 20;
    width: 3vw;

    right: 3vw;
    top: 3vw;
    @media screen and (min-width: 1024px) {
      left: 3vw;
      bottom: 3vw;
      right: auto;
      top: auto;
      width: 5vw;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
<style>
body {
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
</style>
