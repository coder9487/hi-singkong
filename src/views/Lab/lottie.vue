<template>
  <div >
    <loading id="loading"></loading>
  </div>
</template>

<script>
import loading from "../../components/loadingView.vue"
export default {

  components:{
    loading
  },
  mounted() {

  },
};
</script>
<style lang="scss" scoped>
#loading{
  position: fixed;
  z-index: 200;
  height: 100vh;
  width: 100vw;
}

</style>
