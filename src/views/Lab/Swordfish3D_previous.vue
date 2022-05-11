<template>
  <div>
    <canvas id="three" v-show="showingFlag"></canvas>
  </div>
</template>

<script>
import * as THREE from "three/build/three.module.js";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import store from "../../store/index";
import { ref, reactive } from "vue";

export default {
  name: "three",

  data() {
    return {
      showingFlag: true,
      AnimationEnable: false,
      poleDirection: reactive({ x: 0, y: 0 }),
      OptionArray: reactive({}),
    };
  },
  mounted() {
    // class FirstPersonCameraControl extends WithoutMoving{


    // }
    // FirstPersonCameraControl.removeEvents();
    this.initThree(this.loadingCallbacks, this.poleDirection, this.option);

  },
  props: [""],
  computed: {
    detetctShootFishAvailable() {
      return this.$store.state.swordfishShoottimes;
    },
    poleDirectionDetect() {
      return this.$store.state.poleDirection;
    },
    shoot() {
      return this.$store.state.swordfishShootToggle;
    },
  },
  watch: {
    detetctShootFishAvailable: function () {
      // let threeObj = document.getElementById("three");
      // threeObj.style.opacity = 0.3;
      // setTimeout(() => {
      //  threeObj = document.getElementById("three");
      //   threeObj.style.opacity = 1;
      // }, 3000);
    },
    shoot: function () {
      this.shootPoleByVuex();
    },
    poleDirectionDetect: {
      handler(newVal) {
        this.poleDirection.x = newVal.x;
        this.poleDirection.y = newVal.y;
        // console.log('poleDirection ',this.poleDirection);
      },
      deep: true,
    },
  },
  methods: {
    // poleDirectionProps(){

    //     poleDirection =
    // },
    option(setPoleGo) {},
         openFullscreen() {
      var elem = document.getElementById("id-webglcanvas");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
      elem.style.width = '100%';
      elem.style.height = '100%';
    },
    shootPoleByVuex() {
      console.log("shoot:");
      document.getElementById("three").click();
    },
    loadingCallbacks(val) {
      console.log("Loaded:", val);
    },
    initThree(loadingCallbacks, outer_poleDirection, OptionArray) {
      let poleGo = false;
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const objects = [];
      const objects2 = [];
      let mixer;
      let animation_fish;
      let sword_fish_loaded = false;
      // let sworfish_loaded = false;
      // let spear_loaded = false;
      let model_loaded = false;
      let pole, pole_head, plane, origin, posit, direct, man;
      let readyForOBJanimation = false;
      let fish;
      let animationGroup = [];
      for (let i = 0; i <= 24; i++) {
        animationGroup.push(new Object());
      }

      let mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      {
        scene = new THREE.Scene();
        scene.background = new THREE.Color("#eee");
        canvas = document.querySelector("#three");
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.shadowMap.enabled = true; // 設定需渲染陰影效果
        renderer.shadowMap.type = 2; // THREE.PCFSoftShadowMap

        window.addEventListener("resize", onWindowResize);
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.01,
          1000
        );
        camera.position.x = -6.3;
        camera.position.y = 8.5;
        camera.position.z = 0;
        camera.lookAt(-18, 0.5, 0);
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load("sound/sea.mp3", function (buffer) {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
        });

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        scene.background = new THREE.CubeTextureLoader()
          .setPath("")
          .load([
            "images/sky_pos_x.jpg",
            "images/sky_neg_x.jpg",
            "images/sky_pos_y.jpg",
            "images/sky_neg_y.jpg",
            "images/sky_neg_z.jpg",
            "images/sky_pos_z.jpg",
          ]);
        // scene.fog = new THREE.Fog(0x4ca7e6, 400, 800);
      }

      {
        const Hemilight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(Hemilight);

        const shadowLight1 = new THREE.DirectionalLight(0xa8561b, 0.1);
        scene.add(shadowLight1);
        const shadowLight2 = new THREE.DirectionalLight(0x0b3e7d, 0.7);
        scene.add(shadowLight2);
      }

      let seaVertices = 100,
        seaAmp = 0.4;

      let Sea = function (
        ampValue,
        vertX,
        vertY,
        waveOpacity,
        textOffsetX,
        textOffsetY
      ) {
        this.mesh = new THREE.Object3D();

        let geomWaves = new THREE.PlaneBufferGeometry(6000, 6000, vertX, vertY);
        let textWaves = new THREE.TextureLoader().load("images/water4.png");
        textWaves.wrapS = THREE.RepeatWrapping;
        textWaves.wrapT = THREE.RepeatWrapping;
        textWaves.offset = new THREE.Vector2(textOffsetX, textOffsetY);
        textWaves.repeat.set(160, 160);

        let matWaves = new THREE.MeshPhongMaterial({
          //color:0x307ddd,
          transparent: true,
          opacity: waveOpacity,
          map: textWaves,
          side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geomWaves, matWaves);

        geomWaves.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // // geomWaves.mergeVertices();
        let positionAttribute = this.mesh.geometry.getAttribute("position");
        this.waves = [];

        for (
          let vertexIndex = 0;
          vertexIndex < positionAttribute.count;
          vertexIndex += 1
        ) {
          this.waves.push({
            ang: Math.random() * Math.PI * 2,
            amp: ampValue + 0.1,
            speed: 0.016 + Math.random() * 0.048,
          });
        }
      };

      Sea.prototype.moveWaves = function () {
        const positionAttribute = this.mesh.geometry.getAttribute("position");
        const vertex = new THREE.Vector3();
        for (
          let vertexIndex = 0;
          vertexIndex < positionAttribute.count;
          vertexIndex++
        ) {
          vertex.fromBufferAttribute(positionAttribute, vertexIndex);
          let vprops = this.waves[vertexIndex];
          positionAttribute.array[vertexIndex * 3] =
            positionAttribute.array[vertexIndex * 3] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.05;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.05;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.05;
          positionAttribute.array[vertexIndex * 3 + 2] =
            positionAttribute.array[vertexIndex * 3 + 2] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.05;
          vprops.ang += vprops.speed;
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
      };

     if(0) {
        sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(sea.mesh);
        objects.push(sea.mesh);

        sea.mesh.position.y = 0;
        sea.mesh.castShadow = false;
        sea.mesh.receiveShadow = true;
      }

     if(0) {
        Lowersea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(Lowersea.mesh);
        Lowersea.mesh.position.y = -15;
        Lowersea.mesh.castShadow = false;
        Lowersea.mesh.receiveShadow = true;
      }

      {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();

        loader.load(
          // resource URL
          "models/swordfish.json",
          // called when resource is loaded
          function (obj) {
            // obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            scene.add(obj);
            console.log(obj)
            fish = obj.children[4];
            mixer = new THREE.AnimationMixer(obj);

            pole = obj.getObjectByName("spear");
            man = obj.getObjectByName("monger_armature");
            pole_head = pole.children[0];
            // for (let i = 0; i <= 24; i++) {
            //   if (i != 10)
            //     animationGroup[i] = mixer.clipAction(obj.animations[i]).play();
            // }
          },
          // called when loading is in progresses
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
             console.log(xhr.loaded)
            loadingCallbacks(xhr.loaded);

            if (xhr.loaded / 16367069 == 1) sword_fish_loaded = true;
            // console.log(xhr.loaded / 4732415) *100
          }
        );
        let geo = new THREE.PlaneBufferGeometry(8000, 8000, 1, 1);
        let mat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide,
          opacity: 0.9,
        });
        plane = new THREE.Mesh(geo, mat);
        plane.position.set(0, 10, 0);
        plane.rotation.x = Math.PI / 2;
        plane.visible = false;
        objects2.push(plane);
        scene.add(plane);
      }

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true;
          }, 300);
        }
      }
      {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = false;
        controls.applyCollision = false;
        controls.positionEasing = true;
      }

      document.addEventListener("click", function () {
        poleGo = true;
      });
      function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // console.log(mouse)
      }
      if (!isMobile) window.addEventListener("mousemove", onMouseMove, false);
      else {
        mouse = outer_poleDirection;
      }

      function animate(OptionArray) {
        let AnimationEnable = true;
        if (window.innerHeight > window.innerWidth) {
          AnimationEnable = false;
        }

        if (1) {
          // console.log(store.state.animateEnable)
          if (isMobile) {
          }

          // const time = performance.now();
          if (sword_fish_loaded) {
            model_loaded = true;
            delayForAnimate();
          }
 if(0){
          sea.moveWaves();
          Lowersea.moveWaves();
 }

          if (!AnimationEnable) return;
          requestAnimationFrame(animate);
          raycaster.setFromCamera(mouse, camera);
          if (readyForOBJanimation) {
            renderer.render(scene, camera);
            mixer.update(0.01);

            let intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
              origin = intersects[0].point;
              posit = new THREE.Vector3(
                1.7277862131595612,
                5.302516222000122,
                -0.40740348398685455
              );
              direct = posit.sub(origin).normalize();
              let raycasterToSky = new THREE.Raycaster(origin, direct);
              let intersectSky = raycasterToSky.intersectObjects(objects2);
              let skyPosition = intersectSky[0].point;
              if (!poleGo) {
                pole.lookAt(skyPosition.x, skyPosition.y, skyPosition.z);
                man.lookAt(
                  intersects[0].point.y * 0.05,
                  4.3,
                  intersects[0].point.z * 0.05
                );
              }
              if (poleGo) {
                pole.translateY(-0.00098 * 4);
                pole.translateZ(-0.05);
                pole.translateZ(-0.05);
              }

              let pohe = pole_head.getWorldPosition(new THREE.Vector3());
              let fish_position = fish.getWorldPosition(new THREE.Vector3());

              let dis = pohe.distanceTo(fish_position);
              if (dis < 3) {
                store.commit("swordfishShootTimes");
                pole.position.set(0.17277, 0.53, -0.04074);
                poleGo = false;
              } else if (pohe.y < -4) {
                pole.position.set(0.17277, 0.53, -0.04074);
                poleGo = false;
              }
            }
          }
          if (controls.enabled) controls.update();
          // if (isMobile) controls.mobileMove();
          // if (isMobile) sea.mesh.position.x += 0.2;
          // else sea.mesh.position.x += 0.2;
          // sea.mesh.position.z -= 0.02;
        }
      }

      animate(outer_poleDirection, OptionArray);
    },
  },
};
</script>

<style scoped>
#three {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
