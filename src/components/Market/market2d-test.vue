<template>
  <div class="navigate">
    <img
      v-if="IS_MOBILE"
      @touchstart.prevent.stop="touchFn('start')"
      @touchend.prevent="touchFn('end')"
      id="goBtn"
      src="../../../public/images/walk.png"
    />

    <div id="navigate-lottie" v-for="n in 3" :key="n">
      <div
        :id="`loading-video-container_${n}`"
        v-show="lottieShowEnableFunc(n)"
      ></div>
    </div>

    <div
      class="PasserbydialogArea"
      v-show="
        navigate_dialog_content_show_availbale &&
        navigate_dialog_content_index < 10
      "
    >
      <div
        class="PasserbydialogArea-dialog"
        v-html="A_kon_dialogContent[navigate_dialog_content_index]"
      ></div>
      <div class="PasserbydialogArea-group">
        <div @click.stop="A_kon_chatbox_handle" class="button color-cyan">
          我知道了
        </div>
      </div>
    </div>
  </div>

  <div
    class="fishmonger"
    v-show="
      fishmonger_dialog_content_show_available &&
      navigate_dialog_content_index <= 10
    "
  >
    <div>
      <img class="fishmonger-monger" :src="fishMonger_image_path.fishMonger" />
    </div>
    <!-- v-show="fishmonger_dialog_content_show_available" -->
    <div class="fishmonger-dialog" v-show="1">
      <img :src="fishMonger_image_path.dialogBox" />
      <div class="fishmonger-dialog-button-group">
        <div
          class="fishmonger-dialog-button button color-orange"
          id="escapeIntroduceBox"
          @click="FishMonger_handler('next')"
        >
          繼續說
        </div>
        <div
          class="fishmonger-dialog-button button color-cyan"
          id="nextIntroduceBox"
          @click="FishMonger_handler('end')"
        >
          了解，謝謝
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
import lottie from "lottie-web";

export default {
  mounted() {
    this.changeLottie();
    let state = 0;
    if (!this.detectPaltform()) {
      window.addEventListener("mousedown", (e) => {
        state = 1;
      });

      window.addEventListener("mousemove", (e) => {
        if (state === 1) {
          state = 2;
        }
      });

      window.addEventListener("mouseup", (e) => {
        if (state === 2) {
          if (this.$store.state.Market.tutorialIndex == 0)
            this.$store.commit("Market/IncreaseTutorialDialog");
        }
      });
    } else {
      window.addEventListener("touchstart", (e) => {
        state = 1;
      });

      window.addEventListener("touchmove", (e) => {
        if (state === 1) {
          state = 2;
        }
      });

      window.addEventListener("touchend", (e) => {
        if (state === 2) {
          if (this.$store.state.Market.tutorialIndex == 0)
            this.$store.commit("Market/IncreaseTutorialDialog");
        }
      });
    }
  },

  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    // {
    //     let count = 0;
    //     let imgs = [
    //     //用require的方式添加圖片地址，直接添加圖片地址的話，在build打包之後會查找不到圖片，因為打包之後的圖片名稱會有一個加密的字元串
    //         require('../../images/monger1/monger1.png'),
    //         require('../../images/monger1/1-1.png'),
    //         require('../../images/monger1/1-2.png')
    //     ]
    //     for (let img of imgs) {
    //         let image = new Image();
    //         image.src = img;
    //         image.onload = () => {
    //             count++;
    //         };
    //     }
    // }

    let NextTutorial = ref(false);
    let lottieAnimation;
    let direc = reactive({ hori: 0, vert: 0 });
    const info = ref(null);
    return {
      info,
      IS_MOBILE,
      handleHold({ evt, ...newInfo }) {
        info.value = newInfo;

        // native Javascript event
        console.log(evt);
      },
      NextTutorial,
      lottieAnimation,
      direc,
    };
  },
  data() {
    return {
      lottie_conetnt: ["", "mouse_drag", "click_move", "double_click"],
      lottie_mobile_conetnt: [
        "",
        "mobile_rotation",
        "mobile_move",
        "mobile_click",
      ],
      A_kon_dialogContent: [
        "lottie",
        "lottie",
        "乖孫啊，歡迎來阿公的故鄉－成功鎮，讓我帶你來一趟成功特色之旅吧，保證好玩!",
        " 這裡是東部第一大港－成功漁港，每天中午是漁獲拍賣的時間，剛捕捉的新鮮大魚都會在這喔!",
        "剛好今天是旗魚季，阿公這邊有兩張體驗卷，你選一張吧! 晚一點我們去體驗一個你絕對沒看過的活動!",
        "lottie",
        "好，我幫你報名好了，你可以先去魚市場逛逛，今天魚市場很熱鬧喔! 別害羞，多跟成功居民互動吧!",
        "",
        "魚市場很熱鬧吧!要捕到這些新鮮漁獲可不容易，想不想知道大旗魚是怎麼來的?",
        "該是你的體驗卷派上用場了，走吧，阿公帶你去體驗鏢旗魚，機會難得喔!",
      ],

      fishmonger_sequence: ref(0),
      fishmonger_dialog_content_index_limit: [0, 2, 2, 1, 3],
      fishmonger_dialog_content_index: ref(0),
      fishMonger_image_path: reactive({ fishMonger: "", dialogBox: "" }),
      fishmonger_dialog_content_show_available: ref(false),

      navigate_dialog_content_index: 0,
      navigate_dialog_content_show_availbale: false, //for debug set false

      lottie_counter: ref(1),
      lottieShowEnable: ref(true),
    };
  },
  watch: {
    tutorialIndex: function () {
      switch (this.tutorialIndex) {
        case 1:
        case 2:
        case 4:
        case 5:
          this.A_kon_chatbox_handle();
      }
    },
    fuzzyavailable: function () {
      console.log("Set fuzzy", this.fuzzyavailable);
      if (this.fuzzyavailable == 1 || this.fuzzyavailable == true) {
        this.$store.commit("setFozzyFram", true);
      } else {
        this.$store.commit("setFozzyFram", false);
      }
    },

    direc: {
      handler(newVal) {
        this.$store.commit("setLookDir", {
          x: this.direc.hori,
          y: this.direc.vert,
        });
        console.log(this.$store.state.CameraDirect);
      },
      deep: true,
    },

    marketPersonDisplay: function () {
      if (this.marketPersonDisplayEnable == false) return;
      if (this.marketPersonDisplay.includes("_")) {
        //select cupon

        this.A_kon_chatbox_handle(this.marketPersonDisplay);
      } else if (this.marketPersonDisplay != "None") {
        console.log(this.marketPersonDisplay.split("monger")[1]);
        // this.$store.commit("setFozzyFram",true)
        this.fishmonger_sequence = this.marketPersonDisplay.split("monger")[1];
        this.FishMonger_handler("next");
        this.fishmonger_dialog_content_show_available = 1;
      }
    },
  },
  computed: {
    tutorialIndex() {
      return this.$store.state.Market.tutorialIndex;
    },
    lottiePath: function () {
      return `../../lottie/${this.lottie_conetnt[this.lottie_counter]}.json`;
    },
    fuzzyavailable() {
      return this.fishmonger_dialog_content_show_available;
    },
    marketPersonDisplay() {
      return this.$store.state.Market.marketDisplay[0]["id"];
    },
    marketPersonDisplayEnable() {
      return this.$store.state.Market.marketDisplay[0]["display"];
    },
    fishmongerPhoto() {
      return this.fishMonger_image_path.fishMonger;
    },
  },
  methods: {
    touchFn(state) {
      switch (state) {
        case "start":
          this.$store.commit("setForward", true);
          break;
        case "end":
          this.$store.commit("setForward", false);
          break;
      }
    },
    direciton({ evt, ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);

      if (newInfo.isFirst) {
      } else if (newInfo.isFinal) {
        this.direc.hori = 0;
        this.direc.vert = 0;
      }
    },
    detectPaltform() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry /i.test(navigator.userAgent)
      )
        return true;
      else return false;
    },
    lottieShowEnableFunc(passIn) {
      if (passIn == this.lottie_counter && this.lottieShowEnable == true)
        return true;
      else return false;
    },
    A_kon_chatbox_handle(passInStr) {
      this.navigate_dialog_content_index++;
      if (this.navigate_dialog_content_index == 10)
        this.$router.push("/Swordfish");

      console.log(this.navigate_dialog_content_index);
      if (this.A_kon_dialogContent[this.navigate_dialog_content_index] == "") {
        this.lottieShowEnable = false;
        this.navigate_dialog_content_show_availbale = false;
      } else if (
        this.A_kon_dialogContent[this.navigate_dialog_content_index] == "lottie"
      ) {
        this.lottie_counter++;
        this.lottieShowEnable = true;
        this.navigate_dialog_content_show_availbale = false;
        this.changeLottie();
        if (this.lottie_counter == 3) {
          this.$store.commit("Market/IncreaseTutorialDialog");
        }
      } else {
        this.navigate_dialog_content_show_availbale = true;
        this.lottieShowEnable = false;
      }

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // some code..
      } else {
      }
    },
    fishMonger_charactor_path() {
      if (this.fishmonger_sequence != 0 && this.fishmonger_sequence < 5)
        return `../../images/monger${this.fishmonger_sequence}/monger${this.fishmonger_sequence}.png`;
      else return "None";
    },
    fishMonger_dialogBox_path() {
      if (this.fishmonger_dialog_content_index != 0)
        if (
          this.fishmonger_dialog_content_index <=
          this.fishmonger_dialog_content_index_limit[this.fishmonger_sequence]
        )
          return `../../images/monger${this.fishmonger_sequence}/${this.fishmonger_sequence}-${this.fishmonger_dialog_content_index}.png`;
        else {
          this.fishmonger_dialog_content_index = 0;
          this.fishmonger_dialog_content_show_available = false;
          return " ";
        }
    },
    FishMonger_handler(condition) {
      switch (condition) {
        case "next":
          this.fishmonger_dialog_content_index++;
          break;
        case "end":
          this.fishmonger_dialog_content_index = 0;
          this.fishmonger_dialog_content_show_available = false;
          this.fishmonger_sequence = 0;
          // this.$store.commit("marketChangeState", {
          //   id: "None",
          //   display: 0,
          // });
          this.$store.commit("Market/resetmarketChangeState");
          break;
        default:
          console.log("No condition fit");
      }
      this.fishMonger_image_path.fishMonger = this.fishMonger_charactor_path();
      this.fishMonger_image_path.dialogBox = this.fishMonger_dialogBox_path();
    },
    changeLottie() {
      this.lottieAnimation = lottie.loadAnimation({
        container: document.getElementById(
          "loading-video-container_" + this.lottie_counter
        ),
        renderer: "canvas", // 渲染方式:svg、canvas
        loop: true, //循环播放，默认：false
        autoplay: true, //自动播放 ，默认true
        path: this.lottiePath, // json 路径
      });
      this.lottieAnimation.play();
    },
  },
};
</script>
<style lang="scss">
@import url("../dialoglayout.scss");
$content-text-size-pc: 1.4vw;
.controlPannel {
  // // background-color: antiquewhite;

  &-movement {
    // background-color: orange;
    opacity: 0.3;
    width: 20vw;
    height: 33vh;
    position: fixed;
    left: 0px;
    z-index: 200;
    bottom: 33vh;
  }
  &-direction {
    z-index: 101;
    // background-color: orange;
    opacity: 0.3;
    width: 20vw;
    height: 100vh;
    position: fixed;
    right: 0px;
  }
}
#navigate {
  display: flex;
  justify-content: space-around;

  &-lottie {
    @media screen and (min-width: 1024px) {
    }

    transform: scale(1);
    position: absolute;
    width: 30vw;
    height: 20vh;
    bottom: 2vh;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }
}
.navigate {
  &-dialog {
    position: absolute;
    max-width: 50vw;
    height: 20vh;
    left: 25%;
    bottom: 8vh;
    border-radius: 20px;
    background-color: aliceblue;
    display: flex;
    justify-content: space-around;

    &-lottie {
      position: absolute;
      width: 40vw;
      height: 20vh;

      align-content: center;
      align-items: center;
      justify-content: center;
      * {
      }
    }

    &-content {
      font-size: 5vh;
      @media screen and (min-width: 1024px) {
        font-size: 2.5vh;
        line-height: 50px;
      }
      $content-border-gap: 20px;

      // margin-left: 7%;
      // margin-right: 7%;
      // margin-top: 6%;
      // margin-bottom: 7%;
      margin: 5%;

      color: rgb(18, 89, 74);
      &-b {
        color: orange;
      }
    }
    &-button {
      bottom: 2vh;
      position: relative;
      border-radius: 20px;
      margin-left: 60%;
      top: 10px;
      width: 40%;
      @media screen and (min-width: 1024px) {
        margin-left: 38%;
        width: 110px;
      }
    }
    &-button * {
      // margin: 10%;
      padding: 5%;
      font-size: 2vh;
    }
  }
}

.fishmonger {
  * {
    float: right;
  }

  &-monger {
    position: absolute;
    bottom: 0;
    right: 5%;
    height: 90vh;
    right: -10vw;
  }
  &-dialog {
    width: 65vw;
    position: absolute;
    right: 30vw;
    // background-color: aquamarine;
    top: 10vh;
    @media screen and (min-width: 1024px) {
      top: 20vh;
      max-width: 60vw;
    }
    &-button-group {
      // background-color: cornflowerblue;
      display: flex;
      top: -20px;
      justify-content: space-between;
      left: -12vw;
      width: 50vw;
      position: relative;
      @media screen and (min-width: 1024px) {
        left: -3vw; //trial and error
      }
    }
    &-button {
      justify-content: space-around;

      @media screen and (min-width: 1024px) {
        margin-right: 5%;
        margin-left: 5%;
        height: 60px;
        min-width: 20vw;
        border-radius: 50px;
        left: -10%;
      }
      margin-right: 10%;
      margin-left: 10%;
      height: 50px;
      min-width: 150px;
      border-radius: 50px;
    }
  }
}

* {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
