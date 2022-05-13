<template>
  <div v-touch-pan.prevent="direciton" id="FullScreen">
    <canvas id="three"></canvas>
  </div>
</template>

<script>

import * as THREE from "three";
import { Sea } from "../../Library/Sea";
import { GlobalScene } from "../../Library/BasicLibrary";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { marketSetting, collectObject } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import gsap from "gsap";
import { reactive } from "vue";
import {
  PasserBy,
  FishMonger,
  AnimateObject,
  HoverCharacter,
  
} from "../../Library/AnimationLibrary";

export default {

  setup() {
    const Document = document;
    let EnableControl = true;
    let direc = reactive({ hori: 0, vert: 0 });
    return {
      direc,
      Document,
      EnableControl,
    };
  },
  mounted() {
    this.Init_Three();
    this.AddEnentListener();

    this.Animation_Three();
  },
  onBeforeUnmount() {
    this.Window.removeEventListener("resize", this.onWindowResize);
    this.Window.removeEventListener("click", this.onDblclick);
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.renderer = null;
  },
  data() {
    return {
      PostProcessingEnable: false,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "0",
      PlayerState: 0,
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {
    direc: {
      handler: function () {
        this.$store.commit("setLookDir", {
          x: this.direc.hori,
          y: this.direc.vert,
        });
        console.log(this.$store.state.CameraDirect);
      },
      deep: true,
    },
    tutorialIndex: function () {
      console.log("tutorialIndex:", this.tutorialIndex);
      switch (this.tutorialIndex) {
        case 2:
          this.EnableControl = false;
          break;
        case 3:
          this.PlayerState = 2;
          break;
        case 4:
          this.EnableControl = true;
          break;
      }
    },
  },
  computed: {
    tutorialIndex() {
      return this.$store.state.Market.tutorialIndex;
    },
  },
  methods: {
    renderHandle() {
      if (this.PostProcessingEnable) this.composer.render();
      else this.renderer.render(this.scene, this.camera);
    },
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
    direciton({ ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);
      this.direc.hori = Math.min(Math.max(parseInt(this.direc.hori), -5), 5)*3;
      this.direc.vert = Math.min(Math.max(parseInt(this.direc.vert), -5), 5)*3;
      // console.log(this.direc);

      this.onMouseMove();
      this.$store.commit("setLookDir", {
        x: this.direc.hori,
        y: this.direc.vert,
      });
    },
    setAllCulled(obj, culled) {
      obj.frustumCulled = culled;
      obj.children.forEach((child) => this.setAllCulled(child, culled));
    },

    loading_callbacks(val) {
      console.log("Pass into callbacks ", (val.loaded / 98073222).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 98073222).toFixed(2));
    },
    Init_Three() {
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 10;
      this.pointer = new THREE.Vector2();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#ffffff");
      let canvas = document.querySelector("#three");

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        precision: "lowp",
        powerPreference: "high-performance",
      });
      this.renderer.setClearColor(new THREE.Color("#ffffff"), 0);
      window.renderer = this.renderer;
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        50
      );
      this.camera.position.set(20, 1.5, 0);

      this.camera.lookAt(20, 1.5, 1);
      let globalScene = new GlobalScene(this.scene, this.camera, this.renderer);

      /**
       * Create controller
       */
      switch (this.controllerMode) {
        case "0":
          console.log(this.Document);
          this.controls = new FirstPersonCameraControl(
            this.camera,
            this.Document.body
          );
          this.controls.enabled = true;
          this.controls.applyGravity = false;
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
      // this.scene.background = new THREE.CubeTextureLoader()
      //   .setPath("../")
      //   .load([
      //     "images/sky_pos_x.jpg",
      //     "images/sky_neg_x.jpg",
      //     "images/sky_pos_y.jpg",
      //     "images/sky_neg_y.jpg",
      //     "images/sky_neg_z.jpg",
      //     "images/sky_pos_z.jpg",
      //   ]);
      this.scene.background = new THREE.Color(0x3cc4d0);

      // load a resource
      this.loadMarket();
      this.createSea();

      this.pin = this.createPointer();
    },
    Animation_Three() {
      this.handlePlayerState();

      this.controls.update();
      this.sea.moveWaves();
      // if (this.PostProcessingEnable) this.composer.render();
      // else this.renderer.render(this.scene, this.camera);
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },
    AddEnentListener() {
      this.Window = window;
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("click", this.onDblclick);
      this.Window.addEventListener("mousemove", this.onMouseMove);
      this.Window.addEventListener("pointermove", this.onPointerMove);
    },

    async loadMarket() {
      console.clear();
      const loader = new THREE.ObjectLoader();
      // const loader = new THREE.BufferGeometryLoader();
      this.marketModel = await loader.loadAsync(
        "../models/market_lastest.json",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );
      console.log(this.marketModel);

      this.marketModel.scale.set(10, 10, 10);
      this.marketModel.position.set(0, 0, 0);

      marketSetting(this.marketModel);

      this.casterList = collectObject(this.marketModel);
      this.scene.add(this.marketModel);
      this.setupAinmation();
      this.controls.colliders = this.marketModel;
      this.LoadMarketFinish = true;
    },

    createSea() {
      let seaVertices = 20;
      let seaAmp = 0.8;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -3.5;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },

    createCloud() {
      this.cloudArray = new Array();
      this.cloudArray.push(this.marketModel.getObjectByName("cloud01"));
      this.cloudArray.push(this.marketModel.getObjectByName("cloud02"));
      console.log(this.cloudArray);
    },
    onPointerMove(event) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log(this.pointer);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDblclick() {
      // console.log("Scene polycount:", this.renderer.info);
      //   "Event:",
      //   this.dbClickEvent,
      //   " VuexDataPool",
      //   this.VuexDataPool
      // );
      // alert(this.dbClickEvent.eventName
      // );

      switch (this.dbClickEvent.eventName) {
        case "Moving":
          if (this.EnableControl == false) break;
          console.log("Point to ", this.pin.position);
          gsap.to(this.camera.position, {
            duration: 1.5,
            repeat: 0,
            x: this.pin.position.x,
            y: 1.5,
            z: this.pin.position.z,
          });
          break;
        case "tutorial":
          // console.log("Enter tutorial");
          this.EnableControl = false;
          gsap.to(this.camera.position, {
            duration: 1,
            x: 18.631,
            y: 1.5,
            z: -1.21,
            onComplete: () => {
              this.walkingGsap = gsap.to(this.camera.quaternion, {
                duration: 2,
                x: 0.09786719758176317,
                y: -0.19650288234430477,
                z: -0.0197160522638617,
                w: -0.9754075589982892,
                //_x: 0.09786719758176317, _y: -0.19650288234430477, _z: -0.0197160522638617, _w: -0.9754075589982892
                onComplete: () => {
                  this.EnableControl = true;
                  this.PlayerState = 1;
                  console.log(this.walkingGsap);
                },
              });
            },
          });
          break;
        case "fishmonger":
          this.$store.commit("Market/marketChangeState", {
            id: this.VuexDataPool.id,
            display: this.VuexDataPool.display,
          });
          this.VuexDataPool = { id: "", display: "" };
          break;
        case "sheet":
          this.$store.commit("Market/IncreaseTutorialDialog");
          this.akonList[0].object.visible = false;
          break;
      }
      this.dbClickEvent.eventName = "";
    },

    RaycasterHandler(raycasterList) {
      if (raycasterList == null) return;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      let lastestRay = this.raycaster.intersectObjects(raycasterList);
      if (lastestRay.length > 0) {
        if (lastestRay[0].object.name == "ground") {
          this.pin.visible = true;
          this.dbClickEvent.eventObject = { distance: lastestRay[0].distance };
          this.dbClickEvent.eventName = "Moving";
          this.pin.position.x = lastestRay[0].point.x;
          this.pin.position.z = lastestRay[0].point.z;
          this.pin.lookAt(this.camera.position);
        } else {
          this.pin.visible = false;
          if (lastestRay[0].object.name.includes("tutorial")) {
            this.dbClickEvent.eventName = "tutorial";
          } else if (lastestRay[0].object.name.includes("monger")) {
            this.RaycasterPool = lastestRay[0].object.name;
            this.dbClickEvent.eventName = "fishmonger";
            this.VuexDataPool.id = lastestRay[0].object.name.split("_")[0];
            this.VuexDataPool.display = true;
          } else if (lastestRay[0].object.name.includes("sheet")) {
            this.RaycasterPool = lastestRay[0].object.name;
            this.dbClickEvent.eventName = "sheet";
          } else {
            this.dbClickEvent.eventName = "";
          }
        }
      }
    },
    createPointer() {
      const texture = new THREE.TextureLoader().load("../images/pin.png");

      // immediately use the texture for material creation
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.1,
      });
      const geometry = new THREE.PlaneGeometry(0.7, 0.7);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y += 0.35;
      this.scene.add(plane);
      plane.name = "pin_pointer";
      return plane;
    },

    setupAinmation() {
      this.createCloud();
      this.mixer = new THREE.AnimationMixer(this.marketModel);
      this.passerbyList = new Array();
      for (let i = 1; i <= 4; i++) {
        let objTemp = this.marketModel.getObjectByName(`par_passerby0${i}`);
        this.passerbyList.push(new PasserBy(this.camera, objTemp, 6));
      }

      this.fishmongerList = new Array();
      for (let i = 1; i <= 4; i++) {
        let objTemp_normal = this.marketModel.getObjectByName(
          `monger${i}_normal`
        );
        let objTemp_hover = this.marketModel.getObjectByName(
          `monger${i}_hover`
        );
        let objTemp_par = this.marketModel.getObjectByName(`par_monger${i}`);
        this.fishmongerList.push(
          new FishMonger(
            objTemp_normal,
            objTemp_hover,
            objTemp_par,
            this.camera,
            6
          )
        );
      }

      this.fishmongerArrowList = new Array();
      this.akonArrowList = new Array();
      let fishmongerArrowNameList = [
        "arrow_monger1",
        "arrow_monger2",
        "arrow_monger3",
        "arrow_monger4",
      ];
      let akonArrowNameList = ["yellow_arrow"];

      fishmongerArrowNameList.forEach((elem) => {
        let arrowObjTemp = this.marketModel.getObjectByName(elem);
        let arrowTemp = new AnimateObject(arrowObjTemp, 6, this.camera);
        const clip = THREE.AnimationClip.findByName(
          this.marketModel.animations,
          "act_" + elem
        );
        arrowTemp.AppendInfiniteAnimation(this.mixer.clipAction(clip));
        arrowTemp.PlayAnimation();

        this.fishmongerArrowList.push(arrowTemp);
      });

      akonArrowNameList.forEach((elem) => {
        let arrowObjTemp = this.marketModel.getObjectByName(elem);
        let arrowTemp = new AnimateObject(arrowObjTemp, 6, this.camera);
        const clip = THREE.AnimationClip.findByName(
          this.marketModel.animations,
          "act_" + elem
        );
        arrowTemp.AppendInfiniteAnimation(this.mixer.clipAction(clip));
        arrowTemp.PlayAnimation();
        this.akonArrowList.push(arrowTemp);
      });

      console.log("akonArrowNameList", this.akonArrowList);

      this.cuponList = new Array();
      this.cuponList.push(
        new HoverCharacter(
          this.marketModel.getObjectByName("sheet_power_normal"),
          this.marketModel.getObjectByName("sheet_power_white")
        )
      );
      this.cuponList.push(
        new HoverCharacter(
          this.marketModel.getObjectByName("sheet_brave_normal"),
          this.marketModel.getObjectByName("sheet_brave_white")
        )
      );
      this.akonList = new Array();
      this.akonList.push(
        new PasserBy(
          this.camera,
          this.marketModel.getObjectByName("par_a_kon_start"),
          3
        )
      );

      let akon_end = this.marketModel.getObjectByName("par_a_kon_swordfish");

      this.akonList.push(new AnimateObject(akon_end, 10, this.camera));

      this.akonList[1].AppendInfiniteAnimation(
        this.mixer.clipAction(
          THREE.AnimationClip.findByName(
            this.marketModel.animations,
            "act_a_kon_shake_hand"
          )
        )
      );

      this.akonList[1].PlayAnimation();

      this.CarAnimation = new AnimateObject(
        this.marketModel.getObjectByName("par_car"),
        10,
        this.camera
      );
      this.SwordFish = new AnimateObject(
        this.marketModel.getObjectByName("swordfish_hoist_fish"),
        10,
        this.camera
      );
      this.DragLady = new AnimateObject(
        this.marketModel.getObjectByName("par_drag_man"),
        10,
        this.camera
      );
      this.DragLady.axuobj = new PasserBy(
        this.camera,
        this.marketModel.getObjectByName("par_drag_man"),
        6
      );
      this.KickMan = new AnimateObject(
        this.marketModel.getObjectByName("par_kick_man"),
        10,
        this.camera
      );
      let animationArray = this.marketModel.animations;
      for (let j = 0; j < animationArray.length; j++) {
        let animation_name = animationArray[j].name;
        // console.log(animation_name);
        if (animation_name.includes("car") || animation_name.includes("tire")) {
          this.CarAnimation.AppendInfiniteAnimation(
            this.mixer.clipAction(this.marketModel.animations[j])
          );
          console.log("this.CarAnimation", this.CarAnimation);
        } else if (animation_name.includes("swordfish"))
          this.SwordFish.AppendAnimation(
            this.mixer.clipAction(animationArray[j])
          );
        else if (animation_name.includes("drag"))
          this.DragLady.AppendAnimation(
            this.mixer.clipAction(animationArray[j])
          );
        else if (animation_name.includes("kick"))
          this.KickMan.AppendAnimation(
            this.mixer.clipAction(animationArray[j])
          );
      }
    },

    updateAnimation() {
      if (this.LoadMarketFinish != true) return;

      this.controls.mobileMove();
      this.renderHandle();

      for (let j = 0; j < 2; j++) this.cloudArray[j].rotation.y += 0.0001;

      // this.akonArrowList[0].object.lookAt(this.camera.position)
      /** passerby will filp if camera approach them */
      for (let i = 0; i < this.passerbyList.length; i++) {
        this.passerbyList[i].Filp();
        this.passerbyList[i].watchMe();
      }
      /** fishmonger hover effect and arrow action */
      for (let i = 0; i < this.fishmongerList.length; i++) {
        this.fishmongerList[i].watchMe();

        if (this.fishmongerList[i].isApproach()) {
          this.fishmongerArrowList[i].object.visible = true;

          // console.log("arrow  ", this.fishmongerArrowList[i]);
        } else {
          this.fishmongerArrowList[i].object.visible = false;
        }
      }
      // this.DragLady.axuobj.object.lookAt(this.camera.position);

      //this.akonList[0].watchMyCrossVector(new THREE.Vector3(17.9, 2.35, -4.03));
      this.akonList[0].watchMe();
      if (this.akonList[0].DoOnce == false) {
        if (this.akonList[0].isApproach()) {
          // alert()
          this.akonList[0].DoOnce = true;
          this.PlayerState = 1;
        }
      }

      if (
        this.camera.position.distanceTo(new THREE.Vector3(-44.4, 1.65, -4.12)) <
        this.akonList[1].toggleDistance
      ) {
        // this.walkingGsap.pause();
        // console.log(this.camera.quaternion);
        this.akonList[1].toggleDistance = 1000;
        gsap.to(this.camera.position, {
          duration: 2,
          x: -41.87,
          z: -3.85,
          onComplete: () => {
            gsap.to(this.camera.quaternion, {
              duration: 0.5,
              x: 0.039719355081779,
              y: -0.7478140956181748,
              z: -0.04492276599848267,
              w: -0.6611946735430532,
              onComplete: () => {
                this.PlayerState = 3;
                if (this.$store.state.Market.tutorialIndex == 4)
                  this.$store.commit("Market/IncreaseTutorialDialog");
              },
            });

            // const scrollTop = Math.round(tween.target.y)
          },
        });
      }

      /** */
      if (this.KickMan.isApproach()) {
        if (this.KickMan.DoOnce == true) {
          this.KickMan.DoOnce = false;
          let currentQuaternion = this.camera.position.clone();
          // this.walkingGsap.pause();
          gsap.to(this.camera.position, {
            duration: 1,
            repeat: 0,
            x: 6.241002770590721,
            y: 1.5,
            z: -2.8831586237151945,
          });
          console.log(currentQuaternion);

          gsap.to(this.camera.rotation, {
            duration: 1,
            repeat: 0,
            y: Math.PI / 2,
          });

          setTimeout(this.KickMan.PlayAnimation(), 2500);
        }
      }

      if (this.SwordFish.isApproach()) {
        if (this.SwordFish.DoOnce) {
          this.SwordFish.DoOnce = false;
          gsap.to(this.camera.position, {
            duration: 0.5,
            repeat: 0,
            x: -25.481761805844634,
            y: 1.5,
            z: -4.4241223574449045,
          });

          gsap.to(this.camera.quaternion, {
            duration: 1,
            repeat: 0,
            w: 0.9241902014275073,
            x: 0.07037400092097702,
            y: 0.37430947590170366,
            z: -0.028502417966723204,
          });
          // console.log(camera.position);
          setTimeout(this.SwordFish.PlayAnimation(), 1900);
        }
      }

      if (this.DragLady.isApproach()) {
        this.DragLady.PlayAnimation();
        this.DragLady.object.position.z += 0.005;
        this.DragLady.object.position.x += 0.001;
      }

      if (this.CarAnimation.isApproach() || this.CarAnimation.doOnce) {
        this.CarAnimation.doOnce = true;
        this.CarAnimation.PlayAnimation();

        if (this.CarAnimation.doOnce) {
          if (this.CarAnimation.object.position.z < -0.5) {
            this.CarAnimation.direction = 1;
          } else if (this.CarAnimation.object.position.z > 1.5) {
            this.CarAnimation.direction = 0;
          }

          if (this.CarAnimation.direction) {
            this.CarAnimation.object.position.z += 0.003;
          } else if (!this.CarAnimation.direction) {
            this.CarAnimation.object.position.z -= 0.003;
          }
        }
      }

      this.mixer.update(0.03);
    },
    handlePlayerState() {
      switch (this.PlayerState) {
        case 1:
          this.akonArrowList[0].object.visible = false;
          // let yellow_arrow = this.marketModel.getObjectByName("tutorial_click");
          // yellow_arrow.visible = false;
          if (this.$store.state.Market.tutorialIndex == 1)
            this.$store.commit("Market/IncreaseTutorialDialog");
          break;
        case 2:
          this.akonList[0].FilpOption(1);
          break;
        case 3: //rotate to car
          break;
      }
    },
    onMouseMove(event) {
      if (this.LoadMarketFinish != true) return;
      if(event != null)
      {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      this.RaycasterHandler(this.casterList);
      for (let i = 0; i < this.fishmongerList.length; i++) {
        if (this.RaycasterPool.includes(`monger${i + 1}`)) {
          this.fishmongerList[i].showHover();
          this.RaycasterPool = "";
        } else {
          this.fishmongerList[i].showNormal();
        }
      }
      /**  */
      if (this.RaycasterPool.includes("sheet")) {
        if (this.RaycasterPool.includes("power")) {
          this.cuponList[0].showHover();
          this.cuponList[1].showNormal();
        } else if (this.RaycasterPool.includes("brave")) {
          this.cuponList[1].showHover();
          this.cuponList[0].showNormal();
        } else {
          this.cuponList[1].showNormal();
          this.cuponList[0].showNormal();
        }
      }
    },
    onTouchmove() {},
  },
};
</script>
<style lang="scss" scoped>
#three {
  /* background-color: #65e9fa; */
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 6;
  left: 0;
  top: 0;
}
#FullScreen {
  width: 100vw;
  height: 100vh;
}
#goBtn {
  z-index: 100;
  left: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  position: fixed;
  border-radius: 20px;
  background-color: #ff7a00;
  opacity: 0.5;
  transition: border-radius 0.3s;

  &:active {
    border-radius: 50px;
    transition: border-radius 0.3s;
  }
}
</style>
