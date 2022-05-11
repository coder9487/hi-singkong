<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import * as THREE from "three/build/three.module.js";
import { FirstPersonCameraControl } from "../FirstPersonCameraControls.js";
import store from "../../store/index";
export default {
  name: "three",
  mounted() {
    this.initThree(this.loading_callbacks);
  },
  data() {
    return {
      animation: {},
    };
  },
  watch: {},
  methods: {
    loading_callbacks(val){
      //  console.log('Pass into callbacks ',val.loaded)
      this.$emit('loadingProgress',(val.loaded/131887127
).toFixed(2))
    },
    initThree(callbacks) {
      ///DiningTable
      // store.commit("marketOnProgressReset")
      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let market_loaded = false;
      let car = false;
      let round = false;
      let boat01, boat02;
      const sheet_power = [];
      const sheet_brave = [];
      const monger1 = [];
      const monger2 = [];
      const monger3 = [];
      const monger4 = [];
      let displayFishMonger1 = false;
      let displayFishMonger2 = false;
      let displayFishMonger3 = false;
      let displayFishMonger4 = false;
      let displayEnd = false;
      let displaySheet_brave = false;
      let displaySheet_power = false;

      let readyForOBJanimation = false;

      let a_kon_start;
      let sheet_power_normal;
      let sheet_brave_normal;
      let sheet_power_white;
      let sheet_brave_white;
      let end_position = new THREE.Vector3(-4.440825462341309*10,0.168561190366745*10,-0.402698934078216*10) // 需要*10 以符合放大10倍的比例
      let a_kon_start_position = new THREE.Vector3(17.410961389541626,1.68561190366745,-4.0269893407821655);
      let arrow1 = new THREE.Vector3(6.991161108016968,0.8657156676054001,-0.7908161729574203)
      let arrow2 = new THREE.Vector3(-8.720005750656128,0.865715742111206,2.573263347148895)
      let arrow3 = new THREE.Vector3(-17.93976902961731,0.865715742111206,3.0435776710510254)
      let arrow4 = new THREE.Vector3(-29.51202392578125,0.865715742111206,2.210468053817749)
      let car_position = new THREE.Vector3(11.767337322235107,2.2295211255550385,0.0820380449295044)
      let kick = new THREE.Vector3(-2.7316588163375854,0.815223678946495,-7.15338945388794)
      let fish_position = new THREE.Vector3(-28.70699882507324,-1.7775985598564148,-11.736360788345337)
      let drag_man = new THREE.Vector3(-21.90814971923828,0.25204645469784737, -3.91421377658844)

      let mixer;
      let arrow_monger1, monger1_normal, monger1_hover, animation_arrow1;
      let arrow_monger2, monger2_normal, monger2_hover, animation_arrow2;
      let arrow_monger3, monger3_normal, monger3_hover, animation_arrow3;
      let arrow_monger4, monger4_normal, monger4_hover, animation_arrow4;

      let animation_fish;
      let animation_kick_man,animation_kick_man_arm,animation_kick_man_leg,animation_kick_box
      let animation_car,animation_tier01,animation_tier02;
      let animation_drag_man_body,animation_drag_man_calf_L,animation_drag_man_calf_R,animation_drag_man_leg_L,animation_drag_man_leg_R,drag_man_body;
      let passerby01,passerby02,passerby03,passerby04,passerby05,passerby06,passerby07,passerby08,passerby09;
      let passer01,passer02,passer03,passer04,passer05,passer06,passer07,passer08,passer09;
      let start_display = true;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function createScene() {
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

        renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;

        window.addEventListener("resize", onWindowResize);
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
        camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          0.01,
          1000
        );
        camera.position.x = 25;
        camera.position.y = 1.5;
        camera.position.z = -3.8;
        camera.lookAt(25, 1.5, 3.8);

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);
        scene.background = new THREE.CubeTextureLoader()
          .setPath("../")
          .load([
            "images/sky_pos_x.jpg",
            "images/sky_neg_x.jpg",
            "images/sky_pos_y.jpg",
            "images/sky_neg_y.jpg",
            "images/sky_neg_z.jpg",
            "images/sky_pos_z.jpg",
          ]);
        scene.fog = new THREE.Fog(0x4ca7e6, 400, 800);
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
      }

      function createLight() {
        const Hemilight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(Hemilight);

        const shadowLight1 = new THREE.DirectionalLight(0xa8561b, 0.1);
        scene.add(shadowLight1);
        const shadowLight2 = new THREE.DirectionalLight(0x0b3e7d, 0.7);
        scene.add(shadowLight2);
      }

      let seaVertices = 100,
        seaAmp = 0.8;

      let Sea = function (
        ampValue,
        vertX,
        vertY,
        waveOpacity,
        textOffsetX,
        textOffsetY
      ) {
        this.mesh = new THREE.Object3D();

        let geomWaves = new THREE.PlaneBufferGeometry(2000, 2000, vertX, vertY);
        let textWaves = new THREE.TextureLoader().load("../images/water4.png");
        textWaves.wrapS = THREE.RepeatWrapping;
        textWaves.wrapT = THREE.RepeatWrapping;
        textWaves.offset = new THREE.Vector2(textOffsetX, textOffsetY);
        textWaves.repeat.set(80, 80);

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
            amp: ampValue - 0.2,
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
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 1] =
            positionAttribute.array[vertexIndex * 3 + 1] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          positionAttribute.array[vertexIndex * 3 + 2] =
            positionAttribute.array[vertexIndex * 3 + 2] +
            Math.cos(vprops.ang) * vprops.amp * 1 * 0.015;
          vprops.ang += vprops.speed;
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
      };

      function createSea() {
        sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(sea.mesh);
        sea.mesh.position.y = -4;
        sea.mesh.castShadow = false;
        sea.mesh.receiveShadow = true;
      }

      function createLowerSea() {
        Lowersea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
        scene.add(Lowersea.mesh);
        Lowersea.mesh.position.y = -8;
        Lowersea.mesh.castShadow = false;
        Lowersea.mesh.receiveShadow = true;
      }
      function createObject() {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();
        // load a resource
        loader.load(
          // resource URL
          "../models/market3.json",
          // called when resource is loaded
          function (obj) {
            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            scene.add(obj);
            console.log(obj)
            controls.colliders = obj;
            a_kon_start = obj.getObjectByName("a_kon_start");
            sheet_power_normal = obj.getObjectByName("sheet_power_normal");
            sheet_brave_normal = obj.getObjectByName("sheet_brave_normal");
            sheet_power_white = obj.getObjectByName("sheet_power_white");
            sheet_brave_white = obj.getObjectByName("sheet_brave_white");
            sheet_power.push(sheet_power_normal);
            sheet_brave.push(sheet_brave_normal);
            sheet_power_normal.visible = false;
            sheet_brave_normal.visible = false;
            sheet_power_white.visible = false;
            sheet_brave_white.visible = false;

            boat01 = obj.getObjectByName("boat01");
            boat02 = obj.getObjectByName("boat02");
            arrow_monger1 = obj.getObjectByName("arrow_monger1");
            arrow_monger2 = obj.getObjectByName("arrow_monger2");
            arrow_monger3 = obj.getObjectByName("arrow_monger3");
            arrow_monger4 = obj.getObjectByName("arrow_monger4");
            monger1_normal = obj.getObjectByName("monger1_normal");
            monger2_normal = obj.getObjectByName("monger2_normal");
            monger3_normal = obj.getObjectByName("monger3_normal");
            monger4_normal = obj.getObjectByName("monger4_normal");
            monger1.push(monger1_normal);
            monger2.push(monger2_normal);
            monger3.push(monger3_normal);
            monger4.push(monger4_normal);
            monger1_hover = obj.getObjectByName("monger1_hover");
            monger2_hover = obj.getObjectByName("monger2_hover");
            monger3_hover = obj.getObjectByName("monger3_hover");
            monger4_hover = obj.getObjectByName("monger4_hover");
            arrow_monger1.visible = false;
            arrow_monger2.visible = false;
            arrow_monger3.visible = false;
            arrow_monger4.visible = false;
            monger1_hover.visible = false;
            monger2_hover.visible = false;
            monger3_hover.visible = false;
            monger4_hover.visible = false;
            mixer = new THREE.AnimationMixer(obj);

            animation_car = mixer.clipAction(obj.animations[13]);
            animation_tier01 = mixer.clipAction(obj.animations[14]);
            animation_tier02 = mixer.clipAction(obj.animations[15]);
            animation_car.setLoop(THREE.LoopOnce);
            animation_tier01.setLoop(THREE.LoopOnce);
            animation_tier02.setLoop(THREE.LoopOnce);
            animation_car.clampWhenFinished = true;
            animation_tier01.clampWhenFinished = true;
            animation_tier02.clampWhenFinished = true;
            animation_kick_man_arm = mixer.clipAction(obj.animations[0]);
            animation_kick_man_leg = mixer.clipAction(obj.animations[1]);
            animation_kick_box = mixer.clipAction(obj.animations[7]);
            animation_kick_man_arm.setLoop(THREE.LoopOnce);
            animation_kick_man_leg.setLoop(THREE.LoopOnce);
            animation_kick_box.setLoop(THREE.LoopOnce);
            animation_kick_man_arm.clampWhenFinished = true;
            animation_kick_man_leg.clampWhenFinished = true;
            animation_kick_box.clampWhenFinished = true;

            animation_fish = mixer.clipAction(obj.animations[2]);
            animation_fish.setLoop(THREE.LoopOnce);
            animation_fish.clampWhenFinished = true;

            animation_drag_man_body = mixer.clipAction(obj.animations[8])
            // animation_drag_man_calf_L = mixer.clipAction(obj.animations[8]).play()
            // animation_drag_man_calf_R = mixer.clipAction(obj.animations[9]).play()
            // animation_drag_man_leg_L = mixer.clipAction(obj.animations[10]).play()
            // animation_drag_man_leg_R = mixer.clipAction(obj.animations[11]).play()
            animation_drag_man_calf_L = mixer.clipAction(obj.animations[11])
            animation_drag_man_calf_R = mixer.clipAction(obj.animations[9])
            animation_drag_man_leg_L = mixer.clipAction(obj.animations[12])
            animation_drag_man_leg_R = mixer.clipAction(obj.animations[10])
            animation_drag_man_body.setLoop(THREE.LoopOnce)
            animation_drag_man_calf_L.setLoop(THREE.LoopRepeat)
            animation_drag_man_calf_R.setLoop(THREE.LoopRepeat)
            animation_drag_man_leg_L.setLoop(THREE.LoopRepeat)
            animation_drag_man_leg_R.setLoop(THREE.LoopRepeat)
            // animation_drag_man_body.clampWhenFinished = true;
            // animation_drag_man_calf_L.clampWhenFinished = true;
            // animation_drag_man_calf_R.clampWhenFinished = true;
            // animation_drag_man_leg_L.clampWhenFinished = true;
            // animation_drag_man_leg_R.clampWhenFinished = true;
            animation_arrow1 = mixer.clipAction(obj.animations[3]);
            animation_arrow2 = mixer.clipAction(obj.animations[4]);
            animation_arrow3 = mixer.clipAction(obj.animations[5]);
            animation_arrow4 = mixer.clipAction(obj.animations[6]);
            passerby01 = obj.getObjectByName("passerby01")
            passerby02 = obj.getObjectByName("passerby02")
            passerby03 = obj.getObjectByName("passerby03")
            passerby04 = obj.getObjectByName("passerby04")
            passerby05 = obj.getObjectByName("passerby05")
            passerby06 = obj.getObjectByName("passerby06")
            passerby07 = obj.getObjectByName("passerby07")
            passerby08 = obj.getObjectByName("passerby08")
            passerby09 = obj.getObjectByName("passerby09")
            drag_man_body = obj.getObjectByName("drag_man_body");


          },
          // called when loading is in progresses
          function (xhr) {
             console.log(xhr.loaded)
            callbacks(xhr)
            if (xhr.loaded / 131887127
  == 1) {
              market_loaded = true;
            }
          }
        );

        // loader.load(
        //   // resource URL
        //   "../models/round.json",
        //   // called when resource is loaded
        //   function (obj) {
        //     obj.scale.set(10, 10, 10);
        //     obj.position.set(0, 0, 0);
        //     // scene.add(obj);
        //   },
        //   // called when loading is in progresses
        //   function (xhr) {
        //     // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        //     // console.log(xhr.loaded);
        //     if (xhr.loaded / 145454 == 1) {
        //       round = true;
        //     }
        //   }
        // );
        // loader.load(
        //   // resource URL
        //   "../models/car.json",
        //   // called when resource is loaded
        //   function (obj) {
        //     obj.scale.set(8, 8, 8);
        //     obj.position.set(0, 1.5, 0);
        //     scene.add(obj);

        //   },
        //   // called when loading is in progresses
        //   function (xhr) {
        //     // console.log(xhr.loaded); // 29346
        //     if (xhr.loaded / 819743 == 1) {
        //       car = true;
        //     }
        //   }
        // );
      }
      ////
      function createControls() {
        controls = new FirstPersonCameraControl(camera, document.body);
        controls.enabled = true;
        controls.applyGravity = false;
        controls.applyCollision = true;
        controls.positionEasing = true;
      }
      function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true;
          }, 1000);
        }
      }
      window.addEventListener("mousemove", onMouseMove, false);

      function flipPositive(obj) {
        if (obj.rotation.y < Math.PI) {
          obj.rotation.y += 0.05;
        }
      }
      function flipNegative(obj) {
        if (obj.rotation.y > 0) {
          obj.rotation.y -= 0.05;
        }
      }
      function flip_a_kon_pos(obj) {
        if (obj.rotation.z < Math.PI / 2 + 0.022) {  //不知道是不是模型調整的關係，阿公突然不會轉，我就硬調了一個會轉的數值
          obj.rotation.z += 0.05;
        }
      }
      function flip_a_kon_neg(obj) {
        if (obj.rotation.z > -Math.PI / 2 - 0.022) {  //不會轉回來?????
          obj.rotation.z -= 0.05;
        }
      }
      function animate() {
        if (market_loaded) {
          // store.commit("setMarketLoadedTrue");
          delayForAnimate();
        }
        if (readyForOBJanimation) renderer.render(scene, camera);
        sea.moveWaves();
        Lowersea.moveWaves();
        requestAnimationFrame(animate);
        if (controls.enabled) controls.update();
        if (1) controls.mobileMove(); //isMobile
        raycaster.setFromCamera(mouse, camera);

        let disTo_end = camera.position.distanceTo(end_position);
        if (disTo_end < 3) {
          store.commit("marketChangeState", { id: "sence_end", display: true });
        }

        if (readyForOBJanimation) {
          mixer.update(0.016);
          let interscets_sheet_power_normal =
            raycaster.intersectObjects(sheet_power);
          let interscets_sheet_brave_normal =
            raycaster.intersectObjects(sheet_brave);
          let intersects_monger1 = raycaster.intersectObjects(monger1);
          let intersects_monger2 = raycaster.intersectObjects(monger2);
          let intersects_monger3 = raycaster.intersectObjects(monger3);
          let intersects_monger4 = raycaster.intersectObjects(monger4);
          boat01.position.y = Math.sin(Date.now() / 500) * 0.05 - 0.3;
          boat02.position.y = Math.sin(Date.now() / 500) * 0.05 - 0.3;
          //////////////////////////////////////

          let disTo_a_kon_start =
            camera.position.distanceTo(a_kon_start_position);
          let disTo_car = camera.position.distanceTo(car_position);
          let disTo_arrow1 = camera.position.distanceTo(arrow1);
          let disTo_arrow2 = camera.position.distanceTo(arrow2);
          let disTo_arrow3 = camera.position.distanceTo(arrow3);
          let disTo_arrow4 = camera.position.distanceTo(arrow4);
          let disTo_fish = camera.position.distanceTo(fish_position);
          let disTo_kick = camera.position.distanceTo(kick);
          let disTo_dragman = camera.position.distanceTo(drag_man);

          let disTo_passerby01 = camera.position.distanceTo(
            passerby01.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby02 = camera.position.distanceTo(
            passerby02.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby03 = camera.position.distanceTo(
            passerby03.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby04 = camera.position.distanceTo(
            passerby04.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby05 = camera.position.distanceTo(
            passerby05.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby06 = camera.position.distanceTo(
            passerby06.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby07 = camera.position.distanceTo(
            passerby07.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby08 = camera.position.distanceTo(
            passerby08.getWorldPosition(new THREE.Vector3())
          );
          let disTo_passerby09 = camera.position.distanceTo(
            passerby09.getWorldPosition(new THREE.Vector3())
          );

          if (disTo_a_kon_start < 3) {
            store.commit("marketChangeState", {
              id: "sence_start",
              display: true,
            });
            if (start_display) {
              flip_a_kon_pos(a_kon_start);
              console.log(a_kon_start.rotation.z)
            } else if(disTo_a_kon_start > 3) {
              flip_a_kon_neg(a_kon_start);
            }
            if (start_display) {
              sheet_brave_normal.visible = true;
              sheet_power_normal.visible = true;
            } else {
              sheet_brave_normal.visible = false;
              sheet_power_normal.visible = false;
            }
            if (interscets_sheet_power_normal.length > 0) {
              if (start_display) {
                sheet_power_white.visible = true;
                displaySheet_power = true;
              } else {
                sheet_brave_normal.visible = false;
                sheet_power_normal.visible = false;
              }
              ///for 2D image
            } else {
              sheet_power_white.visible = false;
              displaySheet_power = false;
            }
            if (interscets_sheet_brave_normal.length > 0) {
              if (start_display) {
                sheet_brave_white.visible = true;
                displaySheet_brave = true;
              } else {
                sheet_brave_normal.visible = false;
                sheet_power_normal.visible = false;
              }
              ///for 2D image
            } else {
              sheet_brave_white.visible = false;
              displaySheet_brave = false;
            }
          } else {
            sheet_power_white.visible = false;
            sheet_brave_white.visible = false;
            sheet_brave_normal.visible = false;
            sheet_power_normal.visible = false;
            displaySheet_power = false;
            displaySheet_brave = false;
          }

          if(disTo_car < 6){
            animation_car.play();
            animation_tier01.play();
            animation_tier02.play();
          }

          if (disTo_arrow1 < 6) {
            arrow_monger1.visible = true;
            animation_arrow1.play();

            if (intersects_monger1.length > 0) {
              monger1_hover.visible = true;
              displayFishMonger1 = true;
            } else {
              monger1_hover.visible = false;
              displayFishMonger1 = false;
            }
          } else {
            arrow_monger1.visible = false;
            monger1_hover.visible = false;
            displayFishMonger1 = false;
          }

          if (disTo_arrow2 < 6) {
            arrow_monger2.visible = true;
            animation_arrow2.play();

            if (intersects_monger2.length > 0) {
              monger2_hover.visible = true;
              displayFishMonger2 = true;
            } else {
              monger2_hover.visible = false;
              displayFishMonger2 = false;
            }
          } else {
            arrow_monger2.visible = false;
            monger2_hover.visible = false;
            displayFishMonger2 = false;
          }

          if (disTo_arrow3 < 6) {
            arrow_monger3.visible = true;
            animation_arrow3.play();
            if (intersects_monger3.length > 0) {
              monger3_hover.visible = true;
              displayFishMonger3 = true;
            } else {
              monger3_hover.visible = false;
              displayFishMonger3 = false;
            }
          } else {
            arrow_monger3.visible = false;
            monger3_hover.visible = false;
            displayFishMonger3 = false;
          }

          if (disTo_arrow4 < 6) {
            arrow_monger4.visible = true;
            animation_arrow4.play();
            if (intersects_monger4.length > 0) {
              monger4_hover.visible = true;
              displayFishMonger4 = true;
            } else {
              monger4_hover.visible = false;
              displayFishMonger4 = false;
            }
          } else {
            arrow_monger4.visible = false;
            monger4_hover.visible = false;
            displayFishMonger4 = false;
          }

          if(disTo_kick < 5){
            animation_kick_man_arm.play();
            animation_kick_man_leg.play();
            animation_kick_box.play();
          }
          if(disTo_fish < 10){
            animation_fish.play();
            flipPositive(passerby07)
          }else{
            flipNegative(passerby07)

            }

          if(disTo_dragman < 5 & drag_man_body.position.z < 1.3){
            animation_drag_man_calf_L.play();
            animation_drag_man_calf_R.play();
            animation_drag_man_leg_L.play();
            animation_drag_man_leg_R.play();
            drag_man_body.position.z += 0.003;}
          else if(drag_man_body.position.z >= 1.3){
            drag_man_body.position.z += 0;
            animation_drag_man_calf_L.stop();
            animation_drag_man_calf_R.stop();
            animation_drag_man_leg_L.stop();
            animation_drag_man_leg_R.stop();
            }

          if(disTo_passerby01 < 4.5){
            flipPositive(passerby01)
          }else{
            flipNegative(passerby01)
          }
          if (disTo_passerby02 < 4.5) {
            flipPositive(passerby02);
          } else {
            flipNegative(passerby02);
          }
          if (disTo_passerby03 < 4.5) {
            flipPositive(passerby03);
          } else {
            flipNegative(passerby03);
          }
          if (disTo_passerby04 < 4.5) {
            flipPositive(passerby04);
          } else {
            flipNegative(passerby04);
          }
          if (disTo_passerby05 < 4.5) {
            flipPositive(passerby05);
          } else {
            flipNegative(passerby05);
          }
          if (disTo_passerby06 < 4.5) {
            flipPositive(passerby06);
          } else {
            flipNegative(passerby06);
          }
          // if(disTo_passerby07 < 4.5){
          //   flipPositive(passerby07)
          // }else{
          //   flipNegative(passerby07)
          // }
          if(disTo_passerby08 < 4.5){
            flipPositive(passerby08)
          }else{
            flipNegative(passerby08)
          }
          if (disTo_passerby09 < 4.5) {
            flipPositive(passerby09);
          } else {
            flipNegative(passerby09);
          }
        }
      }
      document.addEventListener("dblclick", function () {
        if (displaySheet_power) {
          store.commit("marketChangeState", {
            id: "sheet_power",
            display: true,
          });
          start_display = false;
        }
        if (displaySheet_brave) {
          store.commit("marketChangeState", {
            id: "sheet_brave",
            display: true,
          });
          start_display = false;
        }
        if (displayFishMonger1)
          store.commit("marketChangeState", { id: "monger1", display: true });
        if (displayFishMonger2)
          store.commit("marketChangeState", { id: "monger2", display: true });
        if (displayFishMonger3)
          store.commit("marketChangeState", { id: "monger3", display: true });
        if (displayFishMonger4)
          store.commit("marketChangeState", { id: "monger4", display: true });
      });
      createScene();
      createLight();
      createControls();
      createObject();
      createSea();
      createLowerSea();
      //callbacks()
      animate();
    },
  },
};
</script>

<style scoped>
#three {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 6;
  left: 0;
  top: 0;
}
/* #circle {
  width: 10px;
  height: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 99em;
  background-color:white ;
} */
</style>
