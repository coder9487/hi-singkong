<template>
  <div>
    <div v-show="!showAkon && !showEnable" class="mission">
      <div class="text">吃飽後點擊阿公</div>
    </div>
    <div class="introduceBox" v-show="!showAkon">
      <img class="introduceBox-photo" :src="imagepath" />
      <img
        class="introduceBox-close"
        src="../../../public/images/diningtable/icon_close.png"
        @click.stop="resetShowenable"
      />
    </div>
    <div class="PasserbydialogArea">
      <div class="PasserbydialogArea-dialog">
        來成功玩一定要品嘗一下成功的海鮮，<b>點擊餐點</b>看看成功好料的秘密吧!
      </div>
      <div class="PasserbydialogArea-group">
        <div @click.stop="closeInitDialog()" class="button color-cyan">
          開動!
        </div>
      </div>
    </div>
    <div class="Akon">
      <div>
        <img class="Akon-charactor" src="../../../public/images/a_kon_hi.png" />
      </div>

      <div class="dialogArea">
        <img
          class="dialogArea-photo"
          src="../../../public/images/diningtable/pisirian.png"
        />
        <div class="dialogArea-dialog">
          成功的食材「尚青」！吃飽了嗎?阿公帶你去<b>三仙台</b>走走如何?今天天氣不錯，<b>海景</b>一定很漂亮!
        </div>
        <div class="dialogArea-group">
          <div @click.stop="jumpToprisirian" class="button color-orange">
            好啊！走吧
          </div>
          <div @click.stop="setAkonState(false)" class="button color-cyan">
            等一下
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { ref } from "vue";
export default {
  setup() {},
  mounted() {
    this.$store.commit("setFozzyFram", true);
  },
  data() {
    return {
      showEnable: false,
      imagepath: ref(""),
      showAkon: false,
      initShowFlag: true,
    };
  },
  computed: {
    getDish() {
      return this.$store.state.DiningTable.dish;
    },
    toggleAkon() {
      return this.$store.state.DiningTable.akonEnable;
    },
  },
  watch: {
    toggleAkon: function () {
      {
        this.showAkon = !this.showAkon;

        if (this.showAkon == true) {
          this.$store.commit("setFozzyFram", true);
          gsap.fromTo(
            ".Akon",
            { opacity: 0, display: "none" },
            {
              opacity: 1,
              duration: 0.5,
              display: "inline",
            }
          );
        } else {
          this.$store.commit("setFozzyFram", false);
          gsap.fromTo(
            ".Akon",
            { opacity: 1, display: "inline" },
            {
              opacity: 0,
              duration: 0.5,
              display: "none",
            }
          );
        }
      }
    },
    getDish: function () {
      if (this.getDish != "") {
        this.showEnable = true;
        this.imagepath = this.getimagepath();
      } else {
        this.showEnable = false;
      }

      if (this.showEnable == true) {
        this.$store.commit("setFozzyFram", true);
        gsap.fromTo(
          ".introduceBox",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      } else {
        this.$store.commit("setFozzyFram", false);
        gsap.fromTo(
          ".introduceBox",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.5,
          }
        );
      }
    },
  },
  methods: {
    closeInitDialog() {
      this.$store.commit("setFozzyFram", false);
      gsap.fromTo(
        ".PasserbydialogArea",
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.5,
        }
      );
      //       gsap.fromTo(
      //   ".Akon",
      //   { opacity: 1 },
      //   {
      //     opacity: 0,
      //     duration: 0.5,
      //   }
      // );
      // gsap.fromTo(
      //   ".Akon-charactor",
      //   { opacity: 1 },
      //   {
      //     opacity: 0,
      //     duration: 0.5,
      //   }
      // );
    },
    getimagepath() {
      let imagesUrl = `../../images/diningtable/${this.getDish}.png`;
      console.log("calling path ", imagesUrl);
      return imagesUrl;
    },
    resetShowenable() {
      this.showEnable = false;
      this.$store.commit("DiningTable/resetDish");
    },
    setAkonState(state) {
      this.$store.commit("DiningTable/toggleAkon", state);
    },
    jumpToprisirian() {
      this.$router.push("Pisirian");
    },
  },
};
</script>
<style lang="scss" scoped>
.introduceBox {
  opacity: 0;
  &-photo {
    position: absolute;
    // z-index: 300;
    top: 13vh;
    left: 13vw;
    width: 73vw;
    @media screen and (min-width: 1024px) {
      top: 17vh;
    }
    // height: 66vh;
    // background-color: bisque;
  }
  &-close {
    position: absolute;
    z-index: 300;
    top: 21vh;
    right: 17vw;
    width: 3vw;
    &:hover {
      opacity: 0.6;
    }
  }
}

.Akon {
   display: none;
  opacity: 0;
  &-charactor {
    // width: 40vw;
    z-index: 10;
    height: 70vh;
    position: fixed;
    right: 0;
    bottom: 0;
  }
}
</style>
