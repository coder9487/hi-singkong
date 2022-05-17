<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweened: 0
    }
  },
  watch: {
    number(n) {
      gsap.to(this, { duration: 2, tweened: Number(n) || 0 })
    }
  }
}
</script>

<template>
	Type a number: <input v-model.number="number" />
	<p class="big-number">{{ tweened.toFixed(0) }}</p>
</template>

<style>
.big-number {
  font-weight: bold;
  font-size: 2em;
}
</style>