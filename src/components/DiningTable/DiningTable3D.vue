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
import { marketSetting } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";

export default {
  setup() {
    const Document = document;

    let EnableControl = true;
    return {
      Document,
      EnableControl,
    };
  },
  mounted() {
    this.Init_Three();
     this.$store.commit("SetRenderer",[this.renderer,this.sound]);
    this.AddEnentListener();
    this.Animation_Three();
    console.log(
      "%c住手!  %c不要給我亂開這個",
      "color: red; font-size:120px;",
      "color: green; font-size:30px;"
    );
  },
  onBeforeUnmount() {},
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
  watch: {},
  computed: {},
  methods: {
    loading_callbacks(val) {
      // console.log("Pass into callbacks ", (val.loaded / 90009244).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 20495104).toFixed(2));
    },
    AddEnentListener() {
      this.Window = window;
      this.Window.addEventListener("mousemove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      this.Window.addEventListener("click", this.onClick);
      // this.Window.addEventListener("mousemove", this.onMouseMove);
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
        powerPreference: "low-power",
      });

      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        400
      );
      this.camera.position.set(-48.36, 1.5, 0.2);

      this.camera.lookAt(-48.36, 1.4, 0);
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
      this.controls.enabled = false;

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
      this.loadTable();
      this.createSound();
      this.createSea();

      // this.pin = this.createPointer();w
    },
    Animation_Three() {
      this.controls.update();
      this.sea.moveWaves();
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },

    async loadTable() {
      console.clear();
      const loader = new THREE.ObjectLoader();
      this.tableModel = await loader.loadAsync(
        "../models/market_table.json",
        (xhr) => {
          this.loading_callbacks(xhr);
        }
      );

      this.tableModel.scale.set(10, 10, 10);
      this.tableModel.position.set(0, 0, 0);

      marketSetting(this.tableModel);

      // this.casterList = collectObject(this.tableModel);
      this.scene.add(this.tableModel);
      // this.setupAinmation();
      this.initRaycaster();
      this.initAnimation();
      this.controls.colliders = this.tableModel;
      this.LoadMarketFinish = true;

      console.log(this.tableModel);
    },
    createSound() {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);

      // create a global audio source
      this.sound = new THREE.Audio(listener);

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load("sound/sea_wave.mp3", (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(1);
        this.sound.play();
      });
    },
    createSea() {
      let seaVertices = 100;
      let seaAmp = 0.8;

      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      this.sea.init();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -3.5;
      // this.sea.mesh.castShadow = true;
      // this.sea.mesh.receiveShadow = true;
    },
    initAnimation() {
      let objectNameList = [
        "hai_di_ca",
        "sashimi",
        "mahi_fish",
        "miso_soup",
        "orange",
        "wan_que",
      ];
      this.animationObjectList = new Array();
      objectNameList.forEach((elem) => {
        this.animationObjectList.push(
          this.tableModel.getObjectByName("" + elem)
        );
      });
      console.log("animationObjectList list ", this.animationObjectList);
    },
    initRaycaster() {
      let objectNameList = [
        "hai_di_ca",
        "sashimi",
        "mahi_fish",
        "miso_soup",
        "orange",
        "wan_que",
        "table",
      ];
      this.raycasterObjectList = new Array();
      objectNameList.forEach((elem) => {
        this.raycasterObjectList.push(
          this.tableModel.getObjectByName("box_" + elem)
        );
      });
      this.raycasterObjectList.push(
        this.tableModel.getObjectByName("a_kon_normal")
      );
      this.akonList = new Array();
      this.akonList.push(this.tableModel.getObjectByName("a_kon_normal"));
      this.akonList.push(this.tableModel.getObjectByName("a_kon_hover"));
      this.akonList[1].visible = false;
      console.log(this.akonList);

      console.log("Raycaster list ", this.raycasterObjectList);
    },
    updateAnimation() {
      if (this.RotationObject != null)
        if (this.RotationObject != "box_table") {
          this.RotationObject.rotation.y += 0.005;
        }
    },
    onPointerMove(event) {
      if (this.LoadMarketFinish != true) return;
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // 计算物体和射线的焦点
      const intersects = this.raycaster.intersectObjects(
        this.raycasterObjectList
      );
      if (intersects.length > 0) {
        // this.RotationObject = intersects[0].object;
        // if (intersects[0].object.name != "box_table")
        if (intersects[0].object.name != "a_kon_normal") {
          const found = this.animationObjectList.find(
            (element) => "box_" + element.name == intersects[0].object.name
          );
          this.RotationObject = found;
          this.akonList[1].visible = false;
          this.akonList[0].visible = true;
          this.castAkon = false;
        } else {
          this.akonList[1].visible = true;
          this.akonList[0].visible = false;
          this.castAkon = true;
        }

        // console.log(found);
      } else {
        this.akonList[1].visible = false;
        this.akonList[0].visible = true;
        this.castAkon = false;
        this.RotationObject = null;
      }
      // console.log(" this.RotationObject", this.RotationObject)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onClick() {
      if (this.castAkon) {
        this.$store.commit("DiningTable/toggleAkon", true);
        console.log("akon enable", this.$store.state.DiningTable.akonEnable);
      } else if (this.RotationObject != undefined)
        if (this.RotationObject.name != undefined) {
          this.$store.commit(
            "DiningTable/SelectDish",
            this.RotationObject.name
          );
          console.log("Result", this.$store.state.DiningTable.dish);
        }
    },
  },
};
</script>
