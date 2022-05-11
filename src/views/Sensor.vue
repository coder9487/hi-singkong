<template>

  <div>
    <div>ScreenOrientation:{{ ScreenOrientation }}</div>

    <div id="alpha"></div>
    <div id="beta"></div>
    <div id="gamma"></div>
  </div>
  <VueTouch :pan="touchHandler" id="touch">1</VueTouch>
  <!-- <span @touchmove="touchHandler">Tap Me</span> -->
</template>
<script>
import { reactive } from "vue";


export default {
  setup() {},
  data() {
    return {
      ScreenOrientation: reactive({}),
      DeviceOrientation: {},
    };
  },
  mounted() {
    window.addEventListener(
      "orientationchange",
      this.onScreenOrientationChangeEvent,
      false
    );

    window.addEventListener(
      "deviceorientation",
      this.onDeviceOrientationChangeEvent,
      false
    );
  },
  methods: {
    touchHandler(direction) {
      console.log(" in direction ", direction);
      // direction.touches[0].
    },
    onScreenOrientationChangeEvent(event) {
      this.ScreenOrientation = event;
      console.log("ScreenOrientation", event);
    },
    onDeviceOrientationChangeEvent(event) {
      this.DeviceOrientation = event;
      console.log("DeviceOrientation", event);
    },
  },
};
</script>
<style lang="scss" scoped>
#touch {
  -webkit-backface-visibility: hidden;
  width: 500px;
  height: 500px;
  background-color: aquamarine;
  position: fixed;
  top: 20vh;
  left: 30vw;
}
</style>
