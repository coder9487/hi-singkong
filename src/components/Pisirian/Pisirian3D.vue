<template>
  <div
    v-touch-pan.prevent="direciton"
    @touchend="resetDire"
    id="FullScreen_Pisirian"
  >
    <canvas id="three"></canvas>
  </div>
</template>
<script>
import * as THREE from "three";
import { Sea } from "../../Library/Sea";
import { GlobalScene } from "../../Library/BasicLibrary";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { marketSetting } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import { PasserBy, AnimateObject } from "../../Library/AnimationLibrary";
import { reactive, ref } from "vue";
export default {
  name: "Pisirian3D",
  setup() {
    const Document = document;
    let EnableControl = true;
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    return {
      IS_MOBILE,
      Document,
      EnableControl,
    };
  },
  mounted() {
    this.Init_Three();
     this.$store.commit("SetRenderer",[this.renderer,this.sound]);
    this.AddEnentListener();
    this.Animation_Three();
  },
  onBeforeUnmount() {},
  data() {
    return {
      DO_ONCE_DONE: false,
      PostProcessingEnable: true,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "0",
      togglePasserby: 0,
      direc: reactive({ hori: 0, vert: 0 }),
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {
    direc: {
      handler() {
        this.$store.commit("setLookDir", {
          x: this.direc.hori,
          y: this.direc.vert,
        });
        // console.log(this.$store.state.CameraDirect);
      },
      deep: true,
    },
  },
  computed: {
    detectSowrdfish() {
      return this.$store.state.Pisirian.toggledPasserby;
    },
  },
  methods: {
    testlog() {
      // console.log("Test log");
    },
    direciton({ ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);
      this.direc.hori =
        Math.min(Math.max(parseInt(this.direc.hori), -5), 5) * 3;
      this.direc.vert =
        Math.min(Math.max(parseInt(this.direc.vert), -5), 5) * 3;
      // console.log(this.direc);
      if (newInfo.isFinal) {
        this.direc.hori = 0;
        this.direc.vert = 0;
      }
    },

    loading_callbacks(val) {
      //  console.log("Pass into callbacks ", (val.loaded ).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 63805233).toFixed(2));
    },
    Init_Three() {
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 10;
      this.pointer = new THREE.Vector2();
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x3cc4d0);
      let canvas = document.querySelector("#three");
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        precision: "lowp",
        powerPreference: "high-performance",
      });

      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        400
      );
      this.camera.position.set(54.87, 31.5, -1.5);
      //this.camera.position.set(54.78, 30, 2.02);

      this.camera.lookAt(-54.87, 31.5, 0.3);
      let globalScene = new GlobalScene(this.scene, this.camera, this.renderer);

      /**
       * Create controller
       */
      switch (this.controllerMode) {
        case "0":
          // console.log(this.Document);
          this.controls = new FirstPersonCameraControl(
            this.camera,
            this.Document.body
          );
          this.controls.enabled = true;
          this.controls.applyGravity = true;
          this.controls.applyCollision = true;
          this.controls.positionEasing = true;

          break;
        case "1":
          this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
          );
          break;
      }

      this.composer = globalScene.TuneRender(this.PostProcessingEnable);
      globalScene.AddLight();

      this.scene.background.mapping = THREE.CubeRefractionMapping;
      this.scene.background.minFilter = THREE.LinearFilter;

      // load a resource
      this.gsapTimeline = gsap.timeline();
      this.pin = this.createPointer();
      this.createNullObject();
      this.createSea();
      this.loadTable();

      // console.log(this.scene);
    },
    createCloud() {
      this.cloudArray = new Array();
      this.cloudArray.push(this.islandModel.getObjectByName("cloud01"));
      this.cloudArray.push(this.islandModel.getObjectByName("cloud02"));
      console.log(this.cloudArray);
    },

    Animation_Three() {
      this.controls.update();

      this.sea.moveWaves();
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },
    resetDire() {
      this.$store.commit("setLookDir", {
        x: 0,
        y: 0,
      });
    },
    createNullObject() {
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({});
      this.cube = new THREE.Mesh(geometry, material);
      this.cube.visible = false;
      this.scene.add(this.cube);
      this.startOrientation = new THREE.Quaternion();
    },
    AddEnentListener() {
      this.Window = window;
      // this.Window.addEventListener("pointermove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("dblclick", this.onClick);
      if (!this.IS_MOBILE)
        this.Window.addEventListener("mousemove", this.onMouseMove);
    },
    RemoveEnentListener() {
      // this.Window.addEventListener("pointermove", this.onPointerMove);
      this.Window.removeEventListener("resize", this.onWindowResize);
      this.Window.removeEventListener("dblclick", this.onClick);
      if (!this.IS_MOBILE)
        this.Window.removeEventListener("mousemove", this.onMouseMove);
    },
    async loadTable() {
      // console.clear();
      this.createSound();
      const loader = new GLTFLoader().setPath("models/");
      this.islandModel = new Object();
      this.gltf_islandModel = await loader.loadAsync(
        "pisirian_lastest.gltf",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );

      this.islandModel = this.gltf_islandModel.scene;

      this.islandModel.scale.set(10, 10, 10);
      this.islandModel.position.set(0, 0, 0);

      marketSetting(this.islandModel);

      // this.casterList = collectObject(this.islandModel);
      this.scene.add(this.islandModel);
      // this.setupAinmation();
      this.controls.colliders = this.islandModel;

      this.passerbyList = new Array();
      for (let i = 1; i <= 4; i++) {
        let objTemp = this.islandModel.getObjectByName(`par_passerby0${i}`);
        if (i == 3)
          this.passerbyList.push(new PasserBy(this.camera, objTemp, 4));
        else this.passerbyList.push(new PasserBy(this.camera, objTemp, 4));
      }
      this.AkonObject = new PasserBy(
        this.camera,
        this.islandModel.getObjectByName(`a_kon_body`),
        3
      );
      this.boat = this.islandModel.getObjectByName(`par_boat`);

      this.raycasterList = new Array();
      this.raycasterList.push(this.islandModel.getObjectByName("ground"));
      this.raycasterList.push(this.islandModel.getObjectByName("wall"));
      this.raycasterList.push(this.islandModel.getObjectByName("wall_floor"));

      // console.log("raycasterList", this.raycasterList);
      console.log("Animation List ", this.gltf_islandModel.animations);
      this.mixer = new THREE.AnimationMixer(this.islandModel);
      for (let i = 0; i < 16; i++) {
        if (i != 3) {
          let a = this.mixer.clipAction(this.gltf_islandModel.animations[i]);
          a.play();
        }
      }

      this.swordfishJump = null;

      this.swordfishJump = new AnimateObject(
        this.islandModel.getObjectByName("par_passerby03"),
        3,
        this.camera
      );
      const clip = THREE.AnimationClip.findByName(
        this.gltf_islandModel.animations,
        "act_swordfish"
      );
      this.swordfishJump.AppendAnimation(this.mixer.clipAction(clip));
      this.createCloud();

      this.LoadMarketFinish = true;
    },
    createSound() {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);

      // create a global audio source
      this. sound = new THREE.Audio(listener);

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load("sound/sea_wave.mp3",  (buffer) =>{
       this. sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(1);
        this.sound.play();
      });
    },
    createSea() {
      let seaVertices = 20;
      let seaAmp = 1.0;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = 20;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },
    onMouseMove(event) {
      if (this.LoadMarketFinish != true) return;
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // console.log(this.passerbyList);
      this.RaycasterHandler();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    boatAnimation() {
      this.boat.position.y = Math.sin(performance.now() * 0.002) * 0.1 + 2;
    },
    updateAnimation() {
      if (this.LoadMarketFinish != true) return;
      this.mixer.update(0.008);
      this.boatAnimation();
      for (let j = 0; j < 2; j++) this.cloudArray[j].rotation.y += 0.0001;
      if (this.IS_MOBILE) {
        this.controls.mobileMove();
        this.handleDistance();
      }
      for (let i = 0; i < this.passerbyList.length; i++) {
        this.passerbyList[i].Filp();
        this.passerbyList[i].watchMe();
      }
    },
    RaycasterHandler() {
      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects(this.raycasterList);

      if (intersects.length > 0) {
        if (intersects[0].object.name == "ground") {
          this.pin.position.x = intersects[0].point.x;
          this.pin.position.z = intersects[0].point.z;
          this.pin.position.y = intersects[0].point.y + 0.3;
          this.pin.lookAt(this.camera.position);
        }
      }
    },
    createPointer() {
      if (this.IS_MOBILE) return;
      const texture = new THREE.TextureLoader().load("../images/pin.png");

      // immediately use the texture for material creation
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.1,
      });
      const geometry = new THREE.PlaneGeometry(0.7, 0.7);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y += 0.35;
      plane.position.set(54.87, 31.5, -1.5);
      this.scene.add(plane);
      plane.name = "pin_pointer";
      return plane;
    },
    handleDistance() {
      {
        // console.log(this.camera.position, this.camera.quaternion);

        if (this.AkonObject.isApproach()) {
          gsap.to(this.camera.position, {
            duration: 0.5,
            x: 26.960382,
            z: -1.871433,
            onComplete: () => {
              this.gsapTimeline.to(this.camera.quaternion, {
                duration: 1.5,
                w: 0.7067715186504848,
                x: 0.07662949140912478,
                y: 0.6991818787607907,
                z: -0.07580660844146339,
                onComplete: () => {
                  this.$store.commit("Pisirian/toEnd");
                },
              });
            },
          });
        }

        for (let i = 0; i < 4; i++)
          if (this.passerbyList[i].isApproach()) {
            this.$store.commit("Pisirian/setTogglePasserby", i);
            switch (i) {
              case 0:
              case 1:
              case 3:
                break;
              //lookat
              // this.cube.position.set(
              //   this.camera.position.x,
              //   this.camera.position.y,
              //   this.camera.position.z
              // );
              // this.cube.lookAt(
              //   this.passerbyList[i].object.position.x * 10,
              //   this.passerbyList[i].object.position.y * 10 - 0.5,
              //   this.passerbyList[i].object.position.z * 10
              // );

              // this.startOrientation = this.cube.quaternion.clone().normalize();
              // this.RemoveEnentListener();
              // this.gsapTimeline.to(this.camera.quaternion, {
              //   duration: 2,
              //   x: this.startOrientation.x,
              //   y: -this.startOrientation.y,
              //   z: this.startOrientation.z,
              //   w: this.startOrientation.w,
              //   onComplete: () => {
              //     this.camera.lookAt(
              //       this.passerbyList[i].object.position.x * 10,
              //       this.passerbyList[i].object.position.y * 10 - 0.5,
              //       this.passerbyList[i].object.position.z * 10
              //     );
              //     this.AddEnentListener();
              //   },
              // });
              // break;
            }

            if (i == 3 - 1 && this.swordfishJump.DoOnce) {
              if (this.DO_ONCE_DONE == false) {
                this.RemoveEnentListener();
                this.gsapTimeline
                  .to(this.camera.position, {
                    x: 37.7748,
                    z: -1.264,
                    duration: 0.2,
                    onComplete: () => {
                      this.$store.commit("Pisirian/setTogglePasserby", 2);
                      i = 2;
                    },
                  })
                  .to(this.camera.quaternion, {
                    x: 0.0041123,
                    y: 0.994159,
                    z: 0.099748,
                    w: -0.04098,
                    duration: 0.8,
                    onComplete: () => {
                      this.AddEnentListener();
                      this.passerbyList[2].toggleDistance = 2;
                    },
                  });
              }
              if (this.DO_ONCE_DONE == false) {
                this.DO_ONCE_DONE = true;
                this.timeout = setTimeout(() => {
                  this.swordfishJump.PlayAnimationReset();
                  clearTimeout(this.timeout);
                }, 1300);
              } else {
                this.swordfishJump.PlayAnimationReset();
              }

              this.swordfishJump.DoOnce = false;
            } else if (!this.swordfishJump.DoOnce) {
              this.swordfishJump.DoOnce = true;
              this.swordfishJump.ResetAnimation();
            }
          }
      }
    },
    onClick() {
      this.gsapTimeline.to(this.camera.position, {
        duration: 1.5,
        repeat: 0,
        x: this.pin.position.x,
        z: this.pin.position.z,
        onComplete: () => {
          this.handleDistance();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#three {
  /* background-color: #65e9fa; */
  width: 100vw;
  height: 100h;
  position: fixed;
  z-index: 6;
  left: 0;
  top: 0;
}

#FullScreen_Pisirian {
  z-index: 7;
  background-color: black;
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
</style>
