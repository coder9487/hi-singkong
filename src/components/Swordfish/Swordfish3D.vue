<template>
  <div>
    <img id="aim" src="../../../public/images/swordfish/aim.png">
    <canvas id="three"></canvas>
  </div>
</template>
<script>
import * as THREE from "three";
import { Sea } from "../../Library/Sea";
import { GlobalScene } from "../../Library/BasicLibrary";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { sceneSetting } from "../../Library/LoadObject";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ref, reactive } from "vue";
export default {
  setup() {
    let IS_MOBILE = ref(
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    let direc = reactive({ x: 0, y: 0 });
    const Document = document;
    let EnableControl = true;
    return {
      IS_MOBILE,
      Document,
      EnableControl,
      direc,
    };
  },
  mounted() {
    this.Init_Three();
    this.AddEnentListener();
    this.Animation_Three();
  },
  onBeforeUnmount() {},
  data() {
    return {
      UpdateTime: ref(0.01),
      PostProcessingEnable: true,
      RaycasterPool: "",
      VuexDataPool: { id: "", display: "" },
      dbClickEvent: { eventName: "", eventObject: {} },
      controllerMode: "2",
      PlayerState: 0,
      PoleGoEnable: ref(false),
      /** firstperson control will be apply if controllerMode is 0,otherwise ,orbit control will be apply */
    };
  },
  watch: {
    Hit: function () {
      this.onDblclick();
    },
    GameEnable: function () {
      if (this.GameEnable) {
        if (this.IS_MOBILE) this.UpdateTime = 0.02;
        else this.UpdateTime = 0.011;
        this.PoleGoEnable = true;
      } else this.UpdateTime = 0;
    },
    direc: {
      handler: function () {},
      deep: true,
    },
  },
  computed: {
    GameEnable() {
      return this.$store.state.Swordfish.gameEnable;
    },
    Hit() {
      return this.$store.state.Swordfish.hit;
    },
  },
  methods: {
    direciton(evt) {
      if (evt.touches[0] != undefined) this.onMouseMove(evt.touches[0]);
    },

    loading_callbacks(val) {
      // // console.log("Pass into callbacks ", (val.loaded / 3246875).toFixed(2));
      this.$emit("loadingProgress", (val.loaded / 3246875).toFixed(2));
    },
    createSound() {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);

      // create a global audio source
      const sound = new THREE.Audio(listener);

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load("sound/sea_wave.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
        sound.play();
      });
    },
    Init_Three() {



      this.aim = document.getElementById('aim')
      this.BoneSystem = {};
      this.raycaster = new THREE.Raycaster();
      // this.raycaster.far = 50;
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
      this.renderer.sortObjects = false;

      this.camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        1,
        200
      );

      this.camera.position.set(-7, 8, 0);
      this.camera.lookAt(-16, 0, 0);
      let globalScene = new GlobalScene(this.scene, this.camera, this.renderer);

      this.spear_direct_vector = {
        vector: new THREE.Vector3(),
        state: "stop",
        times: 0,
      };

      /**
       * Create controller
       */
      switch (this.controllerMode) {
        case "0":
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
      this.scene.background = new THREE.Color(0x3cc4d0);
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

      // load a resource

      this.createSea();
      this.loadTable();

      // this.createSurface()

      // this.pin = this.createPointer();w
      window.pointer = this.pointer;
    },
    Animation_Three() {
      if (this.controllerMode <= "1") this.controls.update();
      this.sea.moveWaves();
      this.lowersea.moveWaves();
      this.composer.render();
      this.updateAnimation();

      requestAnimationFrame(this.Animation_Three);
    },
    AddEnentListener() {
      this.Window = window;
      // this.Window.addEventListener("pointermove", this.onPointerMove);
      this.Window.addEventListener("resize", this.onWindowResize);
      let threewindow = document.getElementById("three");

      if (!this.IS_MOBILE) {
        window.addEventListener("mousemove", this.onMouseMove);
       window.addEventListener("click", this.onDblclick);
      } else {
        window.addEventListener("touchmove", this.direciton);
      }
    },

    async loadTable() {
      let GLTF_LOADER = 1;
      this.createSound();
      // console.clear();
      if (GLTF_LOADER) {
        const loader = new GLTFLoader().setPath("models/");
        this.swordfish = await loader.loadAsync("swordfish_old.gltf", (xhr) => {
          this.loading_callbacks(xhr);
        });
      } else {
        this.swordfish = new Object();
        const loader = new THREE.ObjectLoader();
        this.swordfish.scene = await loader.loadAsync(
          "../models/swordfish_old.json",
          (xhr) => {
            this.loading_callbacks(xhr);
          }
        );
        // this.swordfish.animations = this.swordfish.scene.animations;
      }

      // // console.log("this.swordfish.scene", this.swordfish.scene);
      let model = this.swordfish.scene;
      this.scene.add(this.swordfish.scene);
      this.swordfish.scene.traverse(function (object) {
        object.frustumCulled = false;
      });

      this.swordfish.scene.scale.set(10, 10, 10);
      this.swordfish.scene.position.set(0, 0, 0);
      this.mongerSkeleton = model.getObjectByName("monger_armature");
      /** Boom */
      // this.mongerSkeleton_boom = model.getObjectByName("body_01");
      // this.mongerSkeleton_boom.position.z = -10;

      this.spearAim = model.getObjectByName("spear_aiming");
      this.swordfishbody = model.getObjectByName("sailfish_Armature");
      this.boat = model.getObjectByName("boat");

      this.swordfishbody.position.y = 5;
      // this.swordfishbody.scale.set(0.7)
      this.spear = model.getObjectByName("spear");
      // // console.log("Monger skeleton system ", this.mongerSkeleton);
      // // console.log("Scene ", this.scene.children[2]);
      this.raycasterList = [];
      this.backOriginSpear = new THREE.Vector3();

      this.raycasterList.push(this.scene.children[1]);
       this.raycasterList.push(this.scene.children[2]);
       // console.log("this.scene",this.scene);

      this.mixer = new THREE.AnimationMixer(model);
      for (let i = 0; i <= 2; i++) {
        if (!GLTF_LOADER)
          this.mixer.clipAction(this.swordfish.scene.animations[i]).play();
        else this.mixer.clipAction(this.swordfish.animations[i]).play();

        // // console.log(this.swordfish.animations[i]);
      }

      sceneSetting(this.swordfish.scene);

      let dir = new THREE.Vector3(1, 1, 1);
      dir.normalize();

      const origin = new THREE.Vector3(
        0.00818556547164917,
        0.044652700424194336,
        -0.0451924204826355
      );
      const length = 1;
      const hex = 0xffff00;

      this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
      this.scene.add(this.arrowHelper);

      this.LoadModelFinish = true;
    },
    createSea() {
      let seaVertices = 100;
      let seaAmp = 1.2;
      this.sea = new Sea(seaAmp, seaVertices, seaVertices, 0.9, 0, 0);
      this.sea.initWideSea();
      this.sea.mesh.name = "Sea";
      this.scene.add(this.sea.mesh);
      this.sea.mesh.position.y = -5;

      this.lowersea = new Sea(seaAmp, seaVertices, seaVertices, 0.9, 0, 0);
      this.lowersea.init();
      this.lowersea.mesh.name = "LowSea";
      this.scene.add(this.lowersea.mesh);
      this.lowersea.mesh.position.y = -10;
    },
    createSurface() {
      const geometry = new THREE.PlaneGeometry(8000, 8000, 500, 500);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00066e,
        side: THREE.DoubleSide,
        opacity: 0.5,
        //         depthWrite: false,
        // depthTest: false,
        transparent: true,
      });
      geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y = -2;
      this.scene.add(plane);
    },
    onMouseMove(event) {
      if (this.spear_direct_vector.state != "stop") {
        // console.log("Stop due to flying spear.");
        return;
      }

      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.aim.style.top = `${event.clientY}px`;
      this.aim.style.left = `${event.clientX}px`;


      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.castToSea = false;
      const intersects = this.raycaster.intersectObjects(this.raycasterList);
      if (intersects.length > 0) {

        this.castToSea = true;
        this.spear.lookAt(intersects[0].point);

        let dis = this.camera.position
          .clone()
          .distanceToSquared(intersects[0].point);
        let originVector = this.camera.position
          .clone()
          .sub(intersects[0].point.clone())
          .normalize();
        let crossVector = originVector.cross(new THREE.Vector3(0, 1, 0));
        this.mongerSkeleton.lookAt(crossVector.multiplyScalar(dis));

        this.TargetPosition = intersects[0].point;

        this.spear.rotateX(Math.PI);
      }
      else{
        // console.log(this.raycasterList)
      }
    },
    onDblclick() {
      if (this.spear_direct_vector.state == "trans") return;
      // // // console.log("arrowHelper ", this.arrowHelper);
      if (this.castToSea) {
        // // // console.log("Spera eular ", this.spear.rotation);
        this.spear_direct_vector.vector = new THREE.Vector3();

        this.spear_direct_vector.vector = this.spear.getWorldDirection(
          this.TargetPosition
        );

        let spera_pos = new THREE.Vector3();
        this.spear.clone().getWorldPosition(spera_pos);
        this.spear_direct_vector.vector = spera_pos
          .sub(this.TargetPosition)
          .normalize();
        this.spear_direct_vector.state = "start";
        this.spear_direct_vector.times = 0;
      }

      // // // console.log(direct_vector);
    },
    InitarrowHelper(dir) {
      //normalize the direction vector (convert to vector of length 1)
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    updateAnimation() {
      if (!this.LoadModelFinish) return;
      if (this.UpdateTime == 0) return;

      switch (this.spear_direct_vector.state) {
        case "start":
          console.log(this.spear.position)
          this.spear_direct_vector.state = "trans";
          break;
        case "trans":
          // // // console.log("during trans mode ", this.spear_direct_vector.times);
          /**Do not modifity code below */
          this.spear.translateZ(-0.05);
          this.spear.translateY(-0.00098);

          this.spear_direct_vector.times++;
          let spearWorldPos = new THREE.Vector3();
          this.spearAim.getWorldPosition(spearWorldPos);
          let swordfishPos = new THREE.Vector3();
          this.swordfishbody.getWorldPosition(swordfishPos);
          if (swordfishPos.distanceTo(spearWorldPos) < 3) {
            this.$store.commit("Swordfish/ShootSwordfish");
            // console.log(
            //   "this.$store.state.Swordfish.swordfish",
            //   this.$store.state.Swordfish.swordfish
            // );
            // for (let i = 0; i <= 2; i++)
            //   this.mixer.clipAction(this.swordfish.animations[i]).reset();

            this.spear_direct_vector.times = 101;
          }

          if (this.spear_direct_vector.times >= 100) {
            //spear_aiming

            this.spear_direct_vector.times = 0;
            this.spear.position.set(
 -0.05155903846025467, -0.019902408123016357,  -0.005295813083648682
            );
           
            this.spear_direct_vector.state = "stop";
          }

          break;
        case "stop":
          break;
      }
      this.mixer.update(this.UpdateTime);
      if (this.UpdateTime <= 0.01) return;
      if (this.IS_MOBILE) this.sea.mesh.position.x += 1;
      else this.sea.mesh.position.x += 0.3;
      this.lowersea.mesh.position.x += 0.5;
      this.mongerSkeleton.position.y = this.boat.position.y =
        Math.sin(Date.now() / 500) * 0.05;
      this.boat.position.y += 0.22;
    },
  },
};
</script>
<style lang="scss" scoped>
#aim{
  position: absolute;
  z-index: 10;
  top:30vh;
  width: 5vw;
  transform: translate(-50%,-50%);
}
</style>
