<template>
  <div id="IndexPageGroup">
    <img id="StartBackgroung" src="images/start.jpg" v-show="hideFlag" />
    <img
      v-show="hideFlag"
      v-if="!IS_MOBILE"
      src="images/start/1-1.png"
      class="shortcut-list-tag"
      id="shortcut-list-tag"
      @click.stop="toggleList"
    />
    
    <div
      v-show="hideFlag"
      class="shortcut-list"
      id="shortcut-list"
      v-if="!IS_MOBILE"
    >
      <img
        v-for="i in 5"
        :key="i"
        :id="`shortcut-list-photo-${i + 1}`"
        class="shortcut-list-photo"
        :src="`images/start/1-${i + 1}.png`"
        @click="
          fullScreen();
          this.$router.push(routerLink.desktop[i - 1]);
        "
      />
    </div>

    <img
      v-show="hideFlag"
      class="mobile-icon"
      src="images/start/mobile/burger.png"
      @click="mobileShow = !mobileShow"
      v-if="IS_MOBILE"
    />
    <div class="mobile-list" v-if="mobileShow" v-show="hideFlag">
      <p>
        <img
          v-for="i in 3"
          :key="i"
          :id="`mobile-list-photo-${i}`"
          class="mobile-list-photo"
          :src="`images/start/mobile/1-${i}.png`"
          @click="
            fullScreen();
            this.$router.push(routerLink.mobile[i - 1]);
          "
        />
      </p>
      <p>
        <img
          v-for="i in 3"
          :key="i"
          :id="`mobile-list-photo-${i + 3}`"
          class="mobile-list-photo"
          :src="`images/start/mobile/1-${i + 3}.png`"
          @click="
            fullScreen();
            this.$router.push(routerLink.mobile[i + 2]);
          "
        />
      </p>
    </div>

    <div
      v-show="hideFlag"
      v-if="!mobileShow"
      class="start_btn text-h5 text-weight-bolder"
      @click="
        fullScreen();
        playVideo();
      "
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
import { defineComponent, ref } from "vue";
import gsap from "gsap";
export default defineComponent({
  name: "PageIndex",
  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    let routerLink = {
      desktop: ["Market", "Swordfish", "DiningTable", "Pisirian", "Final"],
      mobile: [
        "Market",
        "Swordfish",
        "DiningTable",
        "Pisirian",
        "Final",
        "MarketVR",
      ],
    };
    return {
      IS_MOBILE,
      routerLink,
    };
  },
  mounted() {
    this.tw = gsap.timeline();
  },
  watch: {
    mobileShow: function () {
      switch (this.mobileShow) {
        case true:
          gsap.to("#StartBackgroung", {
            webkitFilter: "brightness(0.6) blur(4px)",
            filter: "brightness(0.6) blur(4px)",
            duration: 1,
          });
          break;
        case false:
          gsap.to("#StartBackgroung", {
            webkitFilter: "brightness(1) blur(0px)",
            filter: "brightness(1) blur(0px)",
            duration: 1,
          });
          break;
      }
    },
  },
  data() {
    return {
      mobileShow: ref(false),
      hideFlag: true,
      clickEnable: false,
      enableList: ref(true),
    };
  },
  methods: {
    toggleList() {
      // alert(this.enableList)
      this.enableList = !this.enableList;
      switch (this.enableList) {
        case true:
          document
            .getElementById("shortcut-list-tag")
            .classList.add("shortcut-list-tag-animation");
          gsap.to("#shortcut-list", { right: "-10vw", duration: 0.5 });
          break;
        case false:
          document
            .getElementById("shortcut-list-tag")
            .classList.remove("shortcut-list-tag-animation");
          gsap.to("#shortcut-list", { right: "0vw", duration: 0.5 });
          break;
      }
    },
    videoFinish() {
      this.clickEnable = true;
      this.$store.commit("gameStart");
      this.$router.push("Market");
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
    playVideo() {
      this.hideFlag = false;
      var myVideo = document.getElementById("startUpVedio");
      myVideo.style.zIndex = 1000;
      myVideo.play();
    },
  },
});
</script>
<style lang="scss" scoped>
.mobile {
  &-icon {
    right: 14vw;
    top: 3vw;
    width: 4vw;
    position: absolute;
    z-index: 10;
  }
  &-list {
    z-index: 5;
    position: absolute;
    top: 8vh;
    left: 18vw;
    &-photo {
      width: 15vw;
      margin-left: 5vw;
    }
  }
}

#startUpVedio {
  width: 100vw;
  height: 100vh;
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
    font-size: x-large;
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

.shortcut-list {
  z-index: 5;
  display: flex;
  flex-direction: column;
  right: -10vw;
  position: absolute;
  transition: 1s;
  // transform: translateX(100%);
  top: 10vh;
  // background-color: antiquewhite;

  &-tag {
    position: absolute;
    z-index: 5;
    height: 5vh;
    top: 5vh;
    right: -5vw;
    transition: 1s;
    &-animation {
      animation: slide 2s infinite;
    }
    &:hover {
      cursor: pointer;
      right: 0vw;
      transition: 1s;
      transform: translateX(0%);
      animation-play-state: paused;
    }
  }

  // &:hover {
  //   transform: translateX(0%);
  //   transition: 1s;
  // }
  &-photo {
    margin-top: 2vh;
    height: 15vh;
    &:hover {
      transform: scale(1.2);
      transition: 0.6s;
    }
  }
}
@-webkit-keyframes slide {
  100% {
    transform: translateX(50%);
  }
  50% {
    transform: translateX(80%);
  }
  25% {
    transform: translateX(50%);
  }
  0% {
    transform: translateX(80%);
  }
}

@keyframes slide {
  0% {
    transform: translateX(10%);
  }
  25% {
    transform: translateX(80%);
  }

  50% {
    transform: translateX(40%);
  }

  100% {
    transform: translateX(10%);
  }
}
</style>
