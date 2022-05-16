<template>
  <div class="mainPage" id="page1">
    <img class="background-photo" src="../../public/images/final/market.jpeg" />
    <div class="infoArea">
      <div class="infoArea-row" v-for="n in 4" :key="n">
        <div class="info-block">
          <div class="flip-box">
            <div class="flip-box-inner">
              <div class="flip-box-front">
                <img :src="getCorp(n).image" class="corp-image" alt="Paris" />
              </div>
              <div class="flip-box-back">
                <img
                  :src="getCorp(n).intro"
                  alt="Paris"
                  class="corp-image"
                  @click="jumpToPage(n)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="infoArea-row" v-for="n in 4" :key="n">
        <div class="info-block">
          <div class="flip-box">
            <div class="flip-box-inner">
              <div class="flip-box-front">
                <img
                  :src="getCorp(n + 4).image"
                  class="corp-image"
                  alt="Paris"
                />
              </div>
              <div class="flip-box-back">
                <img
                  :src="getCorp(n + 4).intro"
                  alt="Paris"
                  class="corp-image"
                  @click="jumpToPage(n + 4)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {},
  data() {
    return {
      cooperateUrl: [
        "http://www.meetmarlin.com/menu",
        "https://www.dachin1985.com.tw/",
        "https://www.facebook.com/ttcgricefood/",
        "https://www.facebook.com/Awen.Taitung.seafood/",
        "https://www.cga.gov.tw/GipOpen/wSite/mp?mp=999",
        "https://www.facebook.com/a0933694139/",
        "https://www.facebook.com/pages/%E5%8E%9F%E9%84%89%E5%92%96%E5%95%A1%E7%B0%A1%E9%A4%90%E5%BA%97/162611353786188",
        "https://xingang.tdbnb.net/",
      ],
    };
  },
  methods: {
    getCorp(index) {
      return {
        image: `../images/final/corp/${index}-1.jpg`,
        intro: `../images/final/corp/${index}-2.jpg`,
      };
    },
    jumpToPage(index) {
      window.open(this.cooperateUrl[index - 1], "_blank").focus();
    },
  },
};
</script>
<style lang="scss" scoped>
.background-photo {
  position: absolute;
  margin: 0;
  width: 100vw;
  height: 100vh;
  filter: blur(5px) brightness(60%);
}
.infoArea {
  position: fixed;
  // background-color: blueviolet;
  left: 10vw;
  top: 5vh;
  height: 70vh;
  width: 80vw;
      @media screen and (min-width: 1024px) {
      top: 12vh;
    }
  &-row {
    flex-direction: row;
    float: left;
    display: flex;

  }
}
.button {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  // background-color: aquamarine;

  transition: 0.5s;
  right: 5vw;
  position: fixed;
  top: 50vh;
  z-index: 10;
  &:hover{
    opacity: 0.5;
    transition: 0.5s;
  }
}

.info-block {
  width: 18vw;
  height: 18vw;
  margin: 1vw;
  // background-color: aquamarine;
}

.corp-image {
  width: 18vw;
  height: 18vw;
}

.flip-box {
  background-color: transparent;
  width: 18vw;
  height: 18vw;
  float: left;

  // border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  &-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
}

/* This container is needed to position the front and back side */

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-box-front,
.flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-box-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-box-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>
