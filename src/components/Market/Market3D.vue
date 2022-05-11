<template>
  <div>
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
    this.AddEventListener();
    this.Animation_Three();
  },
  onBeforeUnmount() {
    alert("");
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  },
  data() {
    return {
      PostProcessingEnable: true,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "0",
      PlayerState: 0,
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {
    distoryScene: function () {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    },
    direc: {
      handler() {
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
    distoryScene() {
      return this.$store.state.Market.distoryScene;
    },
  },
  methods: {
    detectPaltform() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return true;
      else return false;
    },
    direciton({ ...newInfo }) {
      this.direc.hori = newInfo.delta.x.toFixed(0);
      this.direc.vert = newInfo.delta.y.toFixed(0);

      if (newInfo.isFinal) {
        this.direc.hori = 0;
        this.direc.vert = 0;
      }
    },
    readTextFile(file, callback) {
      let rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
        } else {
          alert(rawFile.readyState);
        }
      };
    },

    loading_callbacks(val) {
      console.log("Pass into callbacks ", (val.loaded / 166225800).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 166225800).toFixed(2));
    },
    Init_Three() {
      this.gsapTimeline = gsap.timeline();
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 10;
      this.pointer = new THREE.Vector2();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#ffffff");
      let canvas = document.querySelector("#three");

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        // alpha: true,
        precision: "lowp",
        powerPreference: "high-performance",
      });
      this.renderer.setClearColor(new THREE.Color("#ffffff"), 0);
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        600
      );
      this.camera.position.set(20, 1.5, 0);

      this.camera.lookAt(20, 1.5, 1);
      this.createSound();
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
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },
    AddEventListener() {
      this.Window = window;
      if (!this.detectPaltform()) {
        this.Window.addEventListener("pointermove", this.onPointerMove);
        this.Window.addEventListener("resize", this.onWindowResize);
        this.Window.addEventListener("dblclick", this.onDblclick);
        this.Window.addEventListener("mousemove", this.onMouseMove);
      }
    },
    RemoveEventListener() {

      if (!this.detectPaltform()) {
        this.Window.addEventListener("pointermove", this.onPointerMove);
        this.Window.addEventListener("resize", this.onWindowResize);
        this.Window.addEventListener("dblclick", this.onDblclick);
        this.Window.addEventListener("mousemove", this.onMouseMove);
      }
    },

    async loadMarket() {
      console.clear();
      const loader = new THREE.ObjectLoader();
      this.marketModel = await loader.loadAsync(
        "../models/market_lastest.json",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );

      this.marketModel.scale.set(10, 10, 10);
      this.marketModel.position.set(0, 0, 0);

      marketSetting(this.marketModel);

      this.casterList = collectObject(this.marketModel);
      this.scene.add(this.marketModel);
      this.setupAinmation();
      this.controls.colliders = this.marketModel;
      this.LoadMarketFinish = true;
      this.readTextFile("./3dconfig.json", (text) => {
        this.ConfigFile = JSON.parse(text);
        console.clear();
        console.log("this.ConfigFile", this.ConfigFile);
      });
      window.scene = this.scene;

      //  console.log(this.scene.background.texture.minFilter = THREE.LinearFilter)
    },
    createSound() {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);

      // create a global audio source
      const sound = new THREE.Audio(listener);

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load("sound/market_bgm.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
        sound.play();
      });
    },

    createSea() {
      let seaVertices = 10;
      let seaAmp = 0.8;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -3.5;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },
    createCloudManual() {
      const texture = new THREE.TextureLoader().load(
        "../images/cloud/cloud_far01.png"
      );

      // immediately use the texture for material creation
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.001,
      });

      const geometry = new THREE.PlaneGeometry(30, 30);

      const plane = new THREE.Mesh(geometry, material);
      plane.name = "cloud001";
      plane.position.set(-70, 30, -70);
      this.scene.add(plane);

      const t_cloud01 = new THREE.TextureLoader().load(
        "../images/cloud/cloud01.png"
      );
      t_cloud01.wrapS = THREE.RepeatWrapping;
      t_cloud01.wrapT = THREE.RepeatWrapping;
      t_cloud01.repeat.set(10, 1);

      const cloud01 = new THREE.CylinderGeometry(200, 200, 40, 32, 1, true);
      const m_cloud01 = new THREE.MeshStandardMaterial({
        map: t_cloud01,
        alphaTest: 0,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: true,
        depthWrite: true,
      });
      this.cloud01 = new THREE.Mesh(cloud01, m_cloud01);
      this.cloud01.position.set(-8, 3, -40);

      this.scene.add(this.cloud01);
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
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDblclick() {
      // console.log(
      //   "Event:",
      //   this.dbClickEvent,
      //   " VuexDataPool",
      //   this.VuexDataPool
      // );
      console.log(this.camera.quaternion);

      switch (this.dbClickEvent.eventName) {
        case "Moving":
          if (this.EnableControl == false) break;
          console.log("Point to ", this.pin.position);
          this.gsapTimeline.to(this.camera.position, {
            duration: 1.5,
            repeat: 0,
            x: this.pin.position.x,
            y: 1.5,
            z: this.pin.position.z,
          });
          break;
        case "tutorial":
          if (this.PlayerState >= 1) break;
          // console.log("Enter tutorial");
          this.EnableControl = false;
          this.gsapTimeline
            .to(this.camera.position, {
              duration: 1,
              x: 17.97,
              z: -3,
              onComplete: () => {
                this.gsapTimeline;
              },
            })
            .to(this.camera.quaternion, {
              duration: 2,
              x: 0.09786719758176317,
              y: -0.19650288234430477,
              z: -0.0197160522638617,
              w: -0.9754075589982892,
              //_x: 0.09786719758176317, _y: -0.19650288234430477, _z: -0.0197160522638617, _w: -0.9754075589982892
              onComplete: () => {
                this.EnableControl = true;
                this.PlayerState = 1;
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
        if (lastestRay[0].object.name.includes("ground")) {
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
      this.boat = new Array();
      for (let i = 1; i <= 3; i++) {
        let objTemp = this.marketModel.getObjectByName(`3d_boat0${i}`);
        console.log(objTemp);
        this.boat.push(objTemp);
      }
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
        console.log(this.marketModel.animations);

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
          6
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
      // this.akonList[1].AppendInfiniteAnimation(
      //   this.mixer.clipAction(
      //     THREE.AnimationClip.findByName(
      //       this.marketModel.animations,
      //       "act_arrow_a_kon_swordfish"
      //     )
      //   )
      // );

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
      if (this.detectPaltform()) this.controls.mobileMove();
      for (let j = 0; j < 2; j++) this.cloudArray[j].rotation.y += 0.0001;
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
        } else {
          this.fishmongerArrowList[i].object.visible = false;
        }
      }
      // this.DragLady.axuobj.object.lookAt(this.camera.position);
      this.akonList[0].watchMe();

      if (
        this.camera.position.distanceTo(new THREE.Vector3(-44.4, 1.65, -4.12)) <
        this.akonList[1].toggleDistance
      ) {
        this.dbClickEvent.eventName = "";
        // this.walkingGsap.pause();
        // console.log(this.camera.quaternion);
        this.akonList[1].toggleDistance = 1000;
        this.controls.enabled = false;
        this.gsapTimeline
          .to(this.camera.position, {
            duration: 2,
            x: -41.87,
            z: -3.85,
          })
          .to(this.camera.quaternion, {
            duration: 0.5,
            x: -0.025688131840607836,
            y: 0.7657777937572651,
            z: 0.03064745880541916,
            w: 0.641860751050853,
            onComplete: () => {
              this.PlayerState = 3;
              if (this.$store.state.Market.tutorialIndex == 4)
                this.$store.commit("Market/IncreaseTutorialDialog");
            },
          });
      }

      /** */
      if (this.KickMan.isApproach()) {
        if (this.KickMan.DoOnce == true) {
          this.dbClickEvent.eventName = "";
          this.KickMan.DoOnce = false;
          this.controls.enabled = false;
          this.RemoveEventListener();

          this.gsapTimeline
            .to(this.camera.position, {
              duration: 1,
              repeat: 0,
              x: 6.241002770590721,
              y: 1.5,
              z: -2.8831586237151945,
            })
            .to(this.camera.rotation, {
              duration: 1,
              repeat: 0,
              y: Math.PI / 2,
              onComplete: () => {
                this.KickMan.PlayAnimation();
                this.controls.enabled = true;
                this.AddEventListener();
              },
            });

          // setTimeout(, 2500);
        }
      }

      if (this.SwordFish.isApproach()) {
        if (this.SwordFish.DoOnce) {
          this.RemoveEventListener();
          this.controls.enabled = false;
          this.dbClickEvent.eventName = "";
          this.SwordFish.DoOnce = false;
          this.gsapTimeline
            .to(this.camera.position, {
              duration: 0.5,
              repeat: 0,
              x: -25.481761805844634,
              y: 1.5,
              z: -4.4241223574449045,
            })
            .to(this.camera.quaternion, {
              duration: 1,
              repeat: 0,
              w: 0.9241902014275073,
              x: 0.07037400092097702,
              y: 0.37430947590170366,
              z: -0.028502417966723204,
              onComplete: () => {
                this.SwordFish.PlayAnimation();
                this.controls.enabled = true;
                this.AddEventListener()
              },
            });

          // this.controls._euler = new THREE.Euler().setFromQuaternion(
          //   this.camera.quaternion,
          //   "XYZ"
          // );
          // console.log(camera.position);
          // setTimeout(, 1900);
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
      for (let i = 0; i < 3; i++) {
        this.boat[i].position.y =
          Math.sin((performance.now() + i * 1000) * 0.001) * 0.1 + 0.2;
      }

      this.mixer.update(0.016);
    },
    handlePlayerState() {
      switch (this.PlayerState) {
        case 1:
          this.akonArrowList[0].object.visible = false;
          this.marketModel.getObjectByName("tutorial_click").visible = false;
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
    onMouseMove() {
      if (this.LoadMarketFinish != true) return;
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
</style>
