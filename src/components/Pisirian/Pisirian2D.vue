<template>
  <img
    v-if="IS_MOBILE"
    @touchstart.prevent.stop="touchFn('start')"
    @touchend.prevent="touchFn('end')"
    id="goBtn"
    src="../../../public/images/walk.png"
  />
  <div class="Akon">
    <div>
      <img class="Akon-charactor" src="../../../public/images/a_kon_hi.png" />
    </div>
    <div class="dialogArea">
      <img
        class="dialogArea-photo"
        src="../../../public/images/pisirian/pastcard.jpeg"
      />
      <div class="dialogArea-dialog">
        恭喜你離成功更近一步，記錄你的<b>成功之旅</b>或對自己的<b>成功期許</b>，讓阿公幫你<b>成功寄出</b>吧！一定很漂亮!
      </div>
      <div class="dialogArea-group">
        <div @click.stop="this.$router.push('/Final')" class="button color-orange">
          下次成功見!
        </div>
      </div>
    </div>
  </div>
  <div class="PasserbydialogArea" id="PasserbydialogArea" v-if="showDialog">
    <div
      class="PasserbydialogArea-dialog"
      v-html="contentList.content[contentListIndex]"
    ></div>
    <div class="PasserbydialogArea-group">
      <div @click.stop="dialogHandler(false)" class="button color-cyan">
        {{ contentList.button[contentListIndex] }}
      </div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { ref } from "vue";
export default {
  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    return {
      IS_MOBILE,
    };
  },
  computed: {
    toggleDialog() {
      return this.$store.state.Pisirian.toggledPasserby;
    },
    endDialog() {
      return this.$store.state.Pisirian.end;
    },
  },
  watch: {
    toggleDialog: function () {
      this.contentListIndex = this.toggleDialog;
      this.showDialog = true;
      this.dialogHandler(true);
      console.log(this.contentListIndex);
    },
    endDialog: function () {
      if (this.endDialog == true) {
        let area = document.getElementById("PasserbydialogArea");
        this.$store.commit("setFozzyFram", true);
        this.showAkon = true;
        gsap.fromTo(
          ".Akon",
          {
            opacity: 0,
          },
          {
            display: "block",
            opacity: 1,
            duration: 0.5,
          }
        );
      }
    },
  },
  data() {
    return {
      showAkon: ref(false),
      showDialog: ref(false),
      umount: true,
      contentListIndex: 0,
      contentList: {
        content: [
          "你聽，<b>海的聲音</b>好紓壓，我可以靜靜地聽一整天，每次有煩惱的時候我都會來~",
          "大家要做好保育工作，把成功獨特的<b>鏢旗魚</b>文化傳承下去，一起守護<b>成功的海</b>！",
          "有些漁法容易<b>誤捕</b>導致破壞生態，保存成功的<b>鏢旗魚</b>技法是很重要的，哇!你看，有旗魚！",
          "三仙台的<b>由來</b>是因為有呂洞賓、李鐵拐、何仙姑在此休息，島上有一個<b>許願郵筒</b>很有名喔!",
        ],
        button: ["好酷！", "好療癒~", "運氣真好", "沒錯！"],
      },
    };
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
    dialogHandler(state) {
      if (state == true) {
        this.showDialog = true;
        // gsap.fromTo(
        //   ".PasserbydialogArea",
        //   { opacity: 0 },
        //   {
        //     opacity: 1,
        //     duration: 0.5,
        //   }
        // );
      } else {
        this.showDialog = false;
        // gsap.fromTo(
        //   ".PasserbydialogArea",
        //   { opacity: 1 },
        //   {
        //     opacity: 0,
        //     duration: 0.5,

        //     onComplete: () => {
        //       this.showDialog = false;
        //     },
        //   }
        // );
      }
    },
  },
};
</script>
<style lang="scss" scoped>

$content-text-size-pc: 1.4vw;

.Akon {
  opacity: 0;
  display: none;
  &-charactor {
    // width: 40vw;
    z-index: 10;
    height: 70vh;
    position: fixed;
    right: 0;
    bottom: 0;
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
