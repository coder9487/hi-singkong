<template>
  <!-- <div
    v-if="detectPaltform"
    class="controlPannel-movement"
    v-touch-pan.prevent.mouse="movement"
    v-show="
      !navigate_dialog_content_show_availbale &&
      !fishmonger_dialog_content_show_available
    "
  >

  </div>
  <div
    v-if="detectPaltform"
    class="controlPannel-direction"
    v-touch-pan.prevent.mouse="direciton"
    v-show="
      !navigate_dialog_content_show_availbale &&
      !fishmonger_dialog_content_show_available
    "
  >

  </div> -->

  <div class="navigate">
    <!-- <div class="navigate-lottie">

      <q-img class="navigate-lottie-content" :src="lottie.dialogBox" ></q-img>
    </div> -->
    <div class="navigate-lottie" v-show="lottieShowEnable">
      <q-img class="navigate-lottie-content" :src="lottie"></q-img>
    </div>

    <q-card class="navigate-dialog">
      <div
        class="navigate-dialog-content"
        v-show="navigate_dialog_content_show_availbale"
      >
        <div v-html="A_kon_dialogContent[navigate_dialog_content_index]"></div>

        <q-btn
          class="navigate-dialog-button"
          color="cyan-6"
          @click="A_kon_chatbox_handle"
          :size="$q.platform.is.desktop ? 'lg' : 'lg'"
        >
          我知道了
        </q-btn>
      </div>
    </q-card>
  </div>

  <div class="fishmonger" v-show="fishmonger_dialog_content_show_available">
    <img class="fishmonger-monger" :src="fishMonger_image_path.fishMonger" />
    <div
      class="fishmonger-dialog"
      v-show="fishmonger_dialog_content_show_available"
    >
      <q-img :src="fishMonger_image_path.dialogBox"> </q-img>
      <div class="fishmonger-dialog-button-group">
        <q-btn
          class="fishmonger-dialog-button"
          id="escapeIntroduceBox"
          color="orange"
          :size="$q.platform.is.desktop ? 'lg' : 'md'"
          @click="FishMonger_handler('next')"
          >繼續說</q-btn
        >
        <q-btn
          class="fishmonger-dialog-button"
          id="nextIntroduceBox"
          color="cyan-8"
          :size="$q.platform.is.desktop ? 'lg' : 'md'"
          @click="FishMonger_handler('end')"
          >了解，謝謝</q-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
import store from "../../store/index";
export default {
  setup() {
    let state = 0;
    let NextTutorial = ref(false);
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
        if (store.state.tutorialIndex == 0)
         store.commit("IncreaseTutorialDialog");
      }
    });
    return {
      NextTutorial,
    };
  },
  // setup() {
  //   let moving = reactive({ x: 0, y: 0 });
  //   let direc = reactive({ hori: 0, vert: 0 });
  //   return {
  //     moving,
  //     direc,
  //     movement({ evt, ...newInfo }) {
  //       // movementInfo.value = newInfo;

  //       // native Javascript event
  //       moving.x = (newInfo.offset.x / 10).toFixed(0);
  //       moving.y = (newInfo.offset.y / 10).toFixed(0);
  //       if (moving.x > 13) {
  //         moving.x = 13;
  //       } else if (moving.x < -13) {
  //         moving.x = -13;
  //       }
  //       if (moving.y > 13) {
  //         moving.y = 13;
  //       } else if (moving.y < -13) {
  //         moving.y = -13;
  //       }
  //       if (newInfo.isFirst) {
  //         // movementInfo.value = true;
  //       } else if (newInfo.isFinal) {
  //         // movementPanning.value = false;
  //         moving.x = 0;
  //         moving.y = 0;
  //       }
  //     },
  //     direciton({ evt, ...newInfo }) {
  //       // direcitonInfo.value = newInfo;

  //       direc.hori = newInfo.delta.x.toFixed(0);
  //       direc.vert = newInfo.delta.y.toFixed(0);

  //       if (newInfo.isFirst) {
  //         // direcitonInfo.value = true;
  //       } else if (newInfo.isFinal) {
  //         // direcitonPanning.value = false;
  //         direc.hori = 0;
  //         direc.vert = 0;
  //       }
  //     },
  //   };
  // },
  data() {
    return {
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
      if (this.tutorialIndex == 1 ) this.A_kon_chatbox_handle();
      else if(this.tutorialIndex == 2)
      {
        this.A_kon_chatbox_handle();

      }
            else if(this.tutorialIndex == 4)
      {
        this.A_kon_chatbox_handle();

      }
                  else if(this.tutorialIndex == 5)
      {
        this.A_kon_chatbox_handle();

      }
    },
    fuzzyavailable: function () {
      this.$store.commit("setFozzyFram", this.fuzzyavailable);
    },

    // moving: {
    //   handler(newVal) {
    //     this.$store.commit("MobileMovement", [this.moving.x, this.moving.y]);
    //     // console.log(this.$store.state.MobileMovement);
    //   },
    //   deep: true,
    // },
    // direc: {
    //   handler(newVal) {
    //     this.$store.commit("MobileDirection", [
    //       this.direc.hori,
    //       this.direc.vert,
    //     ]);
    //     console.log(this.$store.state.MobileDirection);
    //   },
    //   deep: true,
    // },

    marketPersonDisplay: function () {
      if (this.marketPersonDisplay.includes("_")) {
        //select cupon

        this.A_kon_chatbox_handle(this.marketPersonDisplay);
      } else if (this.marketPersonDisplay != "None") {
        console.log(this.marketPersonDisplay.split("monger")[1]);

        this.fishmonger_sequence = this.marketPersonDisplay.split("monger")[1];
        this.FishMonger_handler("next");
        this.fishmonger_dialog_content_show_available = 1;
      }
    },
  },
  computed: {
    tutorialIndex() {
      return this.$store.state.tutorialIndex;
    },
    lottie() {
      return `../../images/tutorial_${this.lottie_counter}.png`;
    },
    fuzzyavailable() {
      return (
        this.navigate_dialog_content_show_availbale ||
        this.fishmonger_dialog_content_show_available
      );
    },
    marketPersonDisplay() {
      return this.$store.state.marketDisplay[0]["id"];
    },
    fishmongerPhoto() {
      return this.fishMonger_image_path.fishMonger;
    },
    detectPaltform() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return true;
      else return false;
    },
  },
  methods: {
    A_kon_chatbox_handle(passInStr) {
      this.navigate_dialog_content_index++;
      if(this.navigate_dialog_content_index == 10)
      this.$router.push("/")

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
        if(this.lottie_counter == 3)
        {
         store.commit("IncreaseTutorialDialog");
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
          // this.$store.commit("resetmarketChangeState");
          break;
        default:
          console.log("No condition fit");
      }
      this.fishMonger_image_path.fishMonger = this.fishMonger_charactor_path();
      this.fishMonger_image_path.dialogBox = this.fishMonger_dialogBox_path();
    },
  },
};
</script>
<style lang="scss">
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

.navigate {
  * {
    display: inline;
    float: left;
  }
  &-lottie {
    position: absolute;
    width: 50vw;
    height: 20vh;
    bottom: 5vh;
    right: 25vw;
  }
  &-dialog {
    position: absolute;
    max-width: 50vw;
    height: 20vh;
    left: 25%;
    bottom: 5vh;
    border-radius: 20px;
    // background-color: chocolate;
    &-lottie {
      width: 40vw;
      height: 20vh;
    }
    &-content {
      font-size: 5vh;
      @media screen and (min-width: 1024px) {
        font-size: 2.5vh;
        line-height: 50px;
      }
      $content-border-gap: 20px;
      margin-left: 7%;
      margin-right: 7%;
      margin-top: 6%;
      margin-bottom: 7%;

      color: rgb(18, 89, 74);
      &-b {
        color: orange;
      }
    }
    &-button {
      bottom:2vh;
      position: relative;
      border-radius: 20px;
      margin-left: 60%;
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
    width: 25%;
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
</style>
