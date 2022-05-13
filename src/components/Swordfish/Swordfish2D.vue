<template>
  <video
    v-show="showVideo"
    class="FinishVideo"
    id="FinishVideo_win"
    muted
    playsinline
    preload
  >
    <source src="../../../public/hitVideo.mp4" type="video/mp4" />
  </video>
  <video
    v-show="showVideo"
    class="FinishVideo"
    id="FinishVideo_fail"
    muted
    playsinline
    preload
  >
    <source src="../../../public/failHitVideo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div
    id="progressbar"
    v-show="
      dialogContent_Array[dialogContent_Index] == '' &&
      dialogContent_Array[dialogContent_Index] != 'video'
        ? true
        : false
    "
  >
    <div id="progressbar-background">
      <div id="progressbar-line"></div>
    </div>
  </div>
  <div
    class="charactor"
    v-show="
      dialogContent_Array[dialogContent_Index] != '' &&
      dialogContent_Array[dialogContent_Index] != 'lottie' &&
      dialogContent_Array[dialogContent_Index] != 'video'
        ? true
        : false
    "
  >
    <img class="charactor-image" src="images/a_kon_hi.png" preload />
    <div></div>
  </div>
  <div
    v-show="dialogContent_Array[dialogContent_Index] == 'lottie' ? true : false"
  >
    <div
      :id="
        IS_MOBILE
          ? 'lottie-container-swordfish_tutorial'
          : 'lottie-container-swordfish_tutorial-desktop'
      "
    ></div>
    <div id="lottie-container-a_kon">
      <div
        id="lottie-container-a_kon_hover"
        @click.stop="dialogContent_Index++"
        v-show="!showAkonHover"
      ></div>
      <!-- <div id="lottie-container-a_kon_normal" v-show="!showAkonHover"></div> -->
    </div>
  </div>
  <div v-show="dialogContent_Index >= 9">
    <!-- <img class="cupon" src="../../../public/images/cupon.png" preload /> -->
    <img class="cupon" :src="imagesrc(dialogContent_Index - 9)" />
  </div>

  <div
    v-show="
      dialogContent_Array[dialogContent_Index] != '' &&
      dialogContent_Array[dialogContent_Index] != 'lottie' &&
      dialogContent_Array[dialogContent_Index] != 'hearvest' &&
      dialogContent_Array[dialogContent_Index] != 'video'
        ? true
        : false
    "
    class="PasserbydialogArea"
  >
    <div
      class="PasserbydialogArea-dialog"
      v-html="dialogContent_Array[dialogContent_Index]"
    ></div>
    <div class="PasserbydialogArea-group">
      <div @click.stop="dialogContent_Index++" class="button color-orange">
        {{ dialogButton_Content[dialogContent_Index] }}
      </div>
    </div>
  </div>

  <div class="hearvest" v-show="dialogContent_Index == 8 ? true : false">
    <div class="hearvest-content">
      <img
        v-if="getMountofSwordfish > 0"
        class="hearvest-content-image"
        src="../../../public/images/swordfish/result.png"
      />
      <img
        v-else
        class="hearvest-content-image"
        src="../../../public/images/swordfish/fail.png"
      />
      <div v-if="getMountofSwordfish > 0" class="hearvest-content-money">
        {{ tweened.toFixed(0) }}
      </div>
      <img
        v-if="getMountofSwordfish > 0"
        src="../../../public/images/swordfish/good.png"
        class="hearvest-content-icon"
        id="good-icon"
      />
      <div v-if="getMountofSwordfish > 0" class="hearvest-content-voluem">
        {{ hearvest }}
      </div>
    </div>

    <div
      class="button color-cyan hearvest-content-button"
      @click.stop="dialogContent_Index++"
    >
      {{ dialogButton_Content[dialogContent_Index] }}
    </div>
  </div>
  <div
    v-show="
      dialogContent_Array[dialogContent_Index] == '' ||
      dialogContent_Array[dialogContent_Index] == 'lottie'
        ? true
        : false
    "
  >
    <img
      id="hitButton"
      src="../../../public/images/shoot.png"
      v-if="IS_MOBILE"
    />
  </div>

  <div id="hintOfHit">恭喜!你鏢中了!</div>
</template>
<script>
import lottie from "lottie-web";
import { ref } from "vue";
import gsap from "gsap";

export default {
  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    return {
      HIT_STATE: 0,
      IS_MOBILE,
      debug: false,
      url: "",
    };
  },
  computed: {
    getMountofSwordfish() {
      return this.$store.state.Swordfish.swordfish;
    },
  },
  mounted() {
    this.$store.commit("Swordfish/Reset");
    if (this.IS_MOBILE) {
      const btn = document.getElementById("hitButton");
      btn.addEventListener("touchstart", (e) => {
        this.HIT_STATE = 1;
        this.Hit();
        e.stopPropagation();
        e.preventDefault();
      });
      btn.addEventListener("touchend", (e) => {
        if (this.HIT_STATE) this.HIT_STATE = 0;
        this.Hit();
        e.stopPropagation();
        e.preventDefault();
      });
    }
  },
  watch: {
    number(n) {
      gsap.to(this, { duration: 2, tweened: Number(n) || 0 });
    },
    getMountofSwordfish: function () {
      console.log("getMountofSwordfish", this.getMountofSwordfish);
      if (this.dialogContent_Index == 4)
        this.$store.commit("Swordfish/clearResult");
      if (this.getMountofSwordfish > 0) this.showHitHint();
    },
    dialogContent_Index: function () {
      if (this.dialogContent_Index == 4) {
        if (this.IS_MOBILE) this.changeLottie("swordfish_tutorial");
        else this.changeLottie("swordfish_tutorial-desktop");

        this.changeLottie("a_kon_hover");
        this.changeLottie("a_kon_normal");
      }
      if (this.dialogContent_Index == 6) {
        this.$store.commit("Swordfish/ToggleGame");
        this.$store.commit("Swordfish/clearResult");
        let progressNum = 0;
        let progressElement = document.querySelector("#progressbar-line ");
        let timeInter = 33;
        if (this.debug) timeInter = 0.1;

        this.timeoutProgressID = window.setInterval(() => {
          progressNum += 0.1;
          progressElement.style.width = progressNum + "%";
          if (progressNum > 100) {
            window.clearInterval(this.timeoutProgressID);
            this.dialogContent_Index++;
          }
        }, timeInter);
      }
      if (this.dialogContent_Index == 7) {
        this.calcResult();
        this.$store.commit("Swordfish/ToggleGame");
        this.showVideo = true;
        this.$store.commit("setFozzyFram", true);

        let videoObj = document.getElementById("FinishVideo_fail");
        if (this.hearvest >= 1)
          videoObj = document.getElementById("FinishVideo_win");

        console.log("videoObj", videoObj);

        videoObj.width = window.outerWidth;
        videoObj.height = window.outerHeight;

        // this.timeout = setTimeout(() => {

        // }, 1000);
        // clearTimeout(this.timeout);
        videoObj.style.zIndex = "200";
        videoObj.play();
        videoObj.onended = () => {
          // this.$store.commit("setFozzyFram", false);
          
          this.dialogContent_Index++;
          if (this.hearvest >= 1)
            gsap.to("#FinishVideo_win", {
              duration: 0.5,
              brightness: 0,
              onComplete: () => {
                videoObj.style.zIndex = "-5";
              },
            });
          else {
            gsap.to("#FinishVideo_fail", {
              duration: 0.5,
              brightness: 0,
              onComplete: () => {
                videoObj.style.zIndex = "-5";
              },
            });
          }
        };
      }
      if (this.dialogContent_Index == 8) {
        this.getMoney();
        setTimeout(() => {
          let tw = gsap.timeline();
          tw.to("#good-icon", { duration: 0.1, opacity: 1 }).to("#good-icon", {
            duration: 0.1,
            scale: 0.7,
          });
        }, 2000);
      }
      if (this.dialogContent_Index == 9) {
        if (this.getMountofSwordfish == 0) {
          this.dialogContent_Index = 10;
        }
      }
      if (this.dialogContent_Index == 11) {
         this.$store.commit("setFozzyFram", false);
        this.$router.push("/diningTable");
      }
    },
  },
  data() {
    return {
      tweened: 0,
      number: 0,
      mount_of_swordfish: 0,
      hearvest: 0,
      showVideo: ref(false),
      showAkonHover: ref(false),
      dialogContent_Index: 0,
      dialogContent_Array: [
        '來，阿公跟你說，<b style="color: #FEA30B;">鏢旗魚</b>是成功鎮特有的<b style="color: #FEA30B;">傳統技法</b>，從日治時期就傳入台灣囉~',
        '漁夫會舉著長<b style="color: #FEA30B;">4~6公尺</b>，重達<b style="color: #FEA30B;">18公斤</b>的鏢竿鏢旗魚，雖然辛苦，但鏢到的旗魚也特別好吃喔!',
        '鏢刺漁法對環境很<b style="color: #FEA30B;">友善</b>喔，漁夫每次只對單一大魚獵捕，大大<b style="color: #FEA30B;">減少誤捕</b>小魚或保育類的機會!',
        '阿公先帶你練習一次，認真學喔!旗魚的<b style="color: #FEA30B;">價值不斐</b>，你鏢中越多，越會有意想不到的<b style="color: #FEA30B;">收穫</b>喔!',
        "lottie",
        '很好，待會旗魚可不會游得這麼慢喔! 你有<b style="color: #FEA30B;">30秒</b>的體驗時間，把握機會，旗魚可是不等人的喔!',
        "",
        "video",
        "hearvest",
        '哇!不愧是我的孫子，阿公送你一張<b style="color: #FEA30B;">成功折價卷</b>，等體驗結束後記得到櫃檯領取喔!',
        '辛苦後的結晶總是特別香甜，阿公帶你去吃一頓「<b style="color: #FEA30B;">成功大餐</b>」，都是成功道地料理喔!',
      ],
      dialogButton_Content: [
        "這~麼厲害",
        "我也可以嗎",
        "我也想試試",
        "我準備好了",
        "",
        "開始體驗",
        "",
        "",
        "哇!好棒",
        "這~麼厲害",
        "想吃!走吧!",
      ],
    };
  },
  methods: {
    getMoney() {
      this.number = (
        this.hearvest * Math.floor(Math.random() * (120000 - 80000) + 80000)
      ).toFixed(0);
    },
    Hit() {
      this.$store.commit("Swordfish/Hit");
    },
    showHitHint() {
      gsap.to("#hintOfHit", {
        duration: 0.5,
        opacity: 1,
        onComplete: () => {
          gsap.to("#hintOfHit", { duration: 0.5, opacity: 0 });
        },
      });
    },
    calcResult() {
      this.hearvest = this.$store.state.Swordfish.swordfish;
    },
    toggleshowAkonHover() {
      console.log("Toggle toggleshowAkonHover");
      this.showAkonHover = !this.showAkonHover;
    },
    imagesrc(index) {
      let array = ["cupon.jpg", "table.png"];

      if (index == 0) {
        return `../../images/swordfish/cupon${Math.floor(
          Math.random() * 3
        )}.jpg`;
      }
      return `../../images/swordfish/${array[index]}`;
    },
    changeLottie(str) {
      this.lottieAnimation = lottie.loadAnimation({
        container: document.getElementById(`lottie-container-${str}`),
        renderer: "canvas", // 渲染方式:svg、canvas
        loop: true, //循环播放，默认：false
        autoplay: true, //自动播放 ，默认true
        path: `../../lottie/${str}.json`, // json 路径
        rendererSettings: {
          filterSize: {
            width: "60%",
            height: "100%",
          },
        },
      });
    },
    returnVideoUrl() {},
  },
};
</script>
<style lang="scss" scoped>
$content-text-size-pc: 1.4vw;

.charactor {
  &-image {
    bottom: 0;
    right: 10vw;
    width: 20vw;
    height: auto;
    position: fixed;
    z-index: 1;
  }
}

.hearvest {
  position: absolute;
  left: 25vw;
  display: flex;
  bottom: 5vh;
  display: block;
  @media screen and (min-width: 1024px) {
    bottom: 15vh;
  }

  &-content {
    position: relative;
    width: 50vw;
    height: auto;

    // border-radius: 30px;
    &-icon {
      width: 10vw;
      opacity: 0;
      position: absolute;
      margin-top: -2%;
      right: 1%;
      transform: scale(2);
    }
    &-image {
      top: 15vh;
      width: 50vw;
    }
    &-money {
      position: absolute;
      margin-top: -50%;
      margin-left: 25%;
      font-weight: bolder;
      font-size: 8vw;
      color: #ffa400;
    }
    &-voluem {
      position: absolute;
      margin-top: -20%;
      margin-left: 13%;
      font-weight: bolder;
      font-size: 5vw;
      color: #0fa3b0;
    }

    &-button {
      position: relative;
      margin: auto;
      top: -30px;
      left: 0;
    }
  }
}

@mixin lottie-style {
  width: 30vw;
  height: 30vh;
  position: fixed;
  bottom: -5vh;
  left: 50vw;
  transform: translateX(-50%);
  @media screen and (min-width: 1024px) {
    width: 40vw;
    height: 30vh;
    bottom: 2vh;
  }
}

#lottie-container {
  &-swordfish_tutorial {
    @include lottie-style;
  }

  &-swordfish_tutorial-desktop {
    @include lottie-style;
  }

  &-a_kon {
    position: fixed;
    right: 0px;
    bottom: -2vh;
    width: 50vw;
    right: -10vw;
    @media screen and (min-width: 1024px) {
    }
    // background-color: beige;

    &_normal &_hover {
      height: auto;
      width: 500px;
      @media screen and (min-width: 1024px) {
        width: 200px;
      }
      :deep & > canvas {
        width: 60%;
        left: -30%;
      }
    }
    // &_normal {

    // }
  }
}

#progressbar {
  $progressbar_height: 30px;
  $progressbar_border_radius: 10px;
  $progressbar_border_radius_mobile: 10px;
  $progressbar_height_mobile: 20px;

  position: fixed;
  top: 2vh;
  @media screen and (min-width: 1024px) {
    top: 5vh;
  }

  width: 80vw;
  left: 10vw;
  display: flex;
  background-color: white;
  border-radius: $progressbar_border_radius_mobile;

  @media screen and (min-width: 1024px) {
    border-radius: $progressbar_border_radius;
  }
  padding: 5px;
  &-background {
    background-color: #ffd29d;
    width: 100%;
    height: $progressbar_height_mobile;
    border-radius: $progressbar_border_radius_mobile;

    @media screen and (min-width: 1024px) {
      height: $progressbar_height;
      border-radius: $progressbar_border_radius;
    }
  }
  &-line {
    background-color: #ffa400;
    width: 0%;
    /* Adjust with JavaScript */
    height: $progressbar_height_mobile;
    border-radius: $progressbar_border_radius_mobile;
    @media screen and (min-width: 1024px) {
      height: $progressbar_height;
      border-radius: $progressbar_border_radius;
    }
  }
}

.FinishVideo {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -5;
}

.cupon {
  width: 40vw;

  position: fixed;
  bottom: 35vh;
  background-color: aliceblue;
  left: 30vw;
}

#hintOfHit {
  opacity: 0;
  width: 15vw;
  height: 6vh;
  top: 15vh;
  left: 50vw;
  border-radius: 20px;
  transform: translateX(-50%);
  background-color: white;
  position: fixed;

  padding: 3px;
  align-content: center;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #276a70;
  font-weight: bolder;
  font-size: $content-text-size-pc;

  @media screen and (min-width: 1024px) {
    padding: 10px;
  }
}

* {
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#hitButton {
  position: fixed;
  bottom: 5vh;
  left: 5vh;
  width: 100px;
  height: 100px;
  // border-radius: 10px;
  // background-color: #fea30b;
  z-index: 100;
}
</style>
