<template>
  <q-card>
    <q-card-section>
      <q-select v-model="options_select" :options="options" label="Light" />

      <q-input filled v-model="lightColor" class="my-input">
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="lightColor" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="text-subtitle2">
        <q-input
          class="col"
          outlined
          v-model="lightPower"
          label="lightPower "
        />
        <q-slider v-model="lightPower" :min="0.1" :max="10"></q-slider>
        power:{{ lightPower }}
      </div>

      <div class="row" style="width: 250px">
        <q-input class="col" outlined v-model="lightPosition.x" label="X " />
        <q-input class="col" outlined v-model="lightPosition.y" label="Y " />
        <q-input class="col" outlined v-model="lightPosition.z" label="Z " />
      </div>
      <div class="row"></div>
      <q-btn class="col" color="secondary" @click="saveSetting">save</q-btn>
      <q-btn class="col" color="primary" @click="getSetting">get</q-btn>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  setup() {},
  data() {
    return {
      options_select: ref(""),
      options: [],
      index: 0,

      lightCurrentObject: reactive({}),
      lightPower: ref(0),
      lightColor: ref("rgb(0,0,0)"),
      lightPosition: reactive({ x: 0, y: 0, z: 0 }),

      sceneTemp: {},
    };
  },
  watch: {
    options_select: function () {
      this.index = parseInt(this.options_select.split(". ")[0]);
      this.lightCurrentObject = this.sceneTemp[this.index];
      this.lightPosition = this.lightCurrentObject.position;
      this.lightPower = this.lightCurrentObject.intensity;
      this.lightColor = `rgb(${this.lightCurrentObject.color.r * 255},${
        this.lightCurrentObject.color.g * 255
      },${this.lightCurrentObject.color.b * 255})`;
      console.log(this.lightCurrentObject);
    },
    lightPower: function () {
      if (this.lightCurrentObject.type.includes("rect"))
        this.sceneTemp[this.index].intensity = this.lightPower * 10;
      else this.sceneTemp[this.index].intensity = this.lightPower;
    },
    lightColor: function () {
      let str = this.lightColor.split("(")[1].split(")")[0];
      let colorArray = str.split(",");
      this.sceneTemp[this.index].color.r = parseInt(colorArray[0]) / 255;
      this.sceneTemp[this.index].color.g = parseInt(colorArray[1]) / 255;
      this.sceneTemp[this.index].color.b = parseInt(colorArray[2]) / 255;
      // console.log(this.sceneTemp[this.index].color)
      // this.sceneTemp[this.index].color
    },
    showInterpreter: function () {
      this.sceneTemp = this.scene;
      for (let i = 0; i < this.sceneTemp.length; i++) {
        if (
          this.sceneTemp[i].type.includes("Helper") ||
          !this.sceneTemp[i].type.includes("Light")
        );
        else this.options.push(i + ". " + this.sceneTemp[i].type);
      }
    },
  },
  methods: {
    saveSetting() {
      window.localStorage.setItem(`lightIndex ${this.index}`, [
        this.lightPower,
        this.lightColor,
        this.lightPosition.x,
        this.lightPosition.y,
        this.lightPosition.z,
      ]);
    },
    getSetting() {
      let array = window.localStorage.getItem(`lightIndex ${this.index}`);
      this.lightPower = array[0];
      // this.lightColor = reactive(array[1])
      this.lightPosition.x = array[2];
      this.lightPosition.y = array[3];
      this.lightPosition.z = array[4];
      console.log(array);
    },
  },
};
</script>
<style lang="scss" scoped></style>
