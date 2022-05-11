<template>
  <div>
    <img
      class="background-photo"
      src="../../public/images/final/pisirian.jpeg"
    />
    <div class="infoArea">
      <div class="infoArea-row" v-for="n in 3" :key="n">
        <div><div class="infoArea-member"></div></div>
      </div>
      <div class="infoArea-row" v-for="n in 2" :key="n + 4">
        <div class="infoArea-rowbox"><div class="infoArea-member"></div></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {},
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
  left: 10vw;
  top: 5vh;
  height: 70vh;
  width: 80vw;
  @media screen and (min-width: 1024px) {
    top: 4vh;
  }

  &-row {

  }
  &-member {
    background-color: aqua;
    //  display: table-cell;
    justify-content: space-around;
    // align-content: space-between;
    width: 18vw;
    height: 18vw;
    margin: 3vw;
  }
}
</style>
