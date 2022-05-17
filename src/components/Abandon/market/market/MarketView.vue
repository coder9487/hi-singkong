<template>
  <div class="backgroung_back">
    <canvas id="three"></canvas>
  </div>
</template>

<script>
import * as THREE from "three/build/three.module.js";
import { LottieLoader } from "three/examples/jsm//loaders/LottieLoader.js";
import { FirstPersonCameraControl } from "../../Library/FirstPersonCameraControls";
import store from "../../store/index";
import gsap from "gsap";
import { Sea } from "../../Library/Sea";
import { GlobalScene} from "../../Library/BasicLibrary"
import * as HELPER from "three/examples/jsm/helpers/RectAreaLightHelper";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

export default {
  name: "three",
  mounted() {
    // this.fullScreen();
    this.initThree(this.loading_callbacks, this.RunCommandMethod);
  },
  data() {
    return {
      animation: {},
      Debug: true,
      RunCommand: "",
    };
  },
  watch: {
    interpreterCommand: function () {
      this.RunCommand = this.interpreterCommand;
      this.$store.state.commit("setCommand", { command: "" });
    },

    marketChangeState: function () {
      console.log(this.marketChangeState);
    },
    setFozzyFram: function () {
      if (this.setFozzyFram) {
        gsap.fromTo(
          "#three",
          { filter: " brightness(100%)" },
          { filter: " brightness(70%)", duration: 1 }
        );
      } else {
        gsap.fromTo(
          "#three",
          { filter: " brightness(70%)" },
          { filter: " brightness(100%)", duration: 1 }
        );
      }
    },
  },
  computed: {
    interpreter() {
      return this.$store.state.ThreeInterpreter;
    },
    marketChangeState() {
      return this.$store.state.marketChangeState;
    },
    setFozzyFram() {
      return this.$store.state.Fozzy3D;
    },
  },
  methods: {
    fullScreen() {
      let elem = document.getElementById("three");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      elem.style.width = "100%";
      elem.style.height = "100%";
    },
    loading_callbacks(val) {
      //  console.log('Pass into callbacks ',val.loaded)
      this.$emit("loadingProgress", (val.loaded / 129157615).toFixed(2));
    },
    RunCommandMethod() {
      if (this.RunCommand != "") {
        console.log("Running command");
        let result = eval(this.RunCommand);
        this.RunCommand = "";
        this.$store.state.commit("setCommand", { result: result });
      }
    },
    initThree(callbacks, RunCommandMethod) {
      let globalObject = null;
      ///DiningTable
      // store.commit("marketOnProgressReset")
      let vuexUpdatePool = { id: "", display: false };
      let pointToGround = { isTrue: false, distance: 0, position: null };

      let scene, camera, renderer, canvas;
      let controls;
      let sea, Lowersea;
      let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let market_loaded = false;
      let footprint;
      let boat01, boat02;
      let mesh;

      let readyForOBJanimation = false;

      let Sheetlist = new Array();
      let LightArray = [];

      class AnimateObject {
        constructor(position, toggleDistance, oncallback) {
          this.position = position;
          this.toggleDistance = toggleDistance;
          this.animationList = new Array();
          this.oncallback = oncallback;
          this.Object = null;
          this.DoOnce = true;
        }

        distanceToCamera() {
          return camera.position.distanceTo(this.position);
        }
        IsApproach() {
          if (this.distanceToCamera() < this.toggleDistance) return true;
          else return false;
        }
        AppendAnimation(object) {
          let animateObjectTemp = object;
          animateObjectTemp.setLoop(THREE.LoopOnce);
          animateObjectTemp.clampWhenFinished = true;
          this.animationList.push(animateObjectTemp);
        }
        AppendInfiniteAnimation(object) {
          let animateObjectTemp = object;
          this.animationList.push(animateObjectTemp);
        }
        PlayAnimation() {
          for (let i = 0; i < this.animationList.length; i++) {
            this.animationList[i].play();
          }
        }
        CallBacks() {
          this.CallBacks();
        }
      }
      class AnimateObjectHide extends AnimateObject {
        constructor(position, toggleDistance, oncallback) {
          super(position, toggleDistance, oncallback);
        }
        ShowAvailable(showAvailable) {
          this.Object.visible = showAvailable;
        }
        AppendInfinitAnimation(object) {
          let animateObjectTemp = object;
          this.animationList.push(animateObjectTemp);
        }
      }

      class PasserBy {
        constructor(object, distance) {
          this.object = object;
          this.distance = distance;
          this.toggle = false;
        }
        IsApproach() {
          return (
            camera.position.distanceTo(
              this.object.getWorldPosition(new THREE.Vector3())
            ) < this.distance
          );
        }

        Filp() {
          if (this.IsApproach() && !this.toggle) {
            gsap.to(this.object.rotation, {
              duration: 2,
              y: Math.PI,
            });
            this.toggle = true;
          } else if (!this.IsApproach() && this.toggle) {
            gsap.to(this.object.rotation, {
              duration: 2,
              y: 0,
            });
            this.toggle = false;
          }
        }
        LookAtCamera() {}
      }
      class AKon extends PasserBy {
        constructor(object, distance) {
          super(object, distance);
          this.DoOnce = true;
        }
        Filp() {
          if (this.IsApproach() && !this.toggle) {
            gsap.to(this.object.rotation, {
              duration: 2,
              y: Math.PI * 0.5,
            });
            this.toggle = true;
          } else if (!this.IsApproach() && this.toggle) {
            gsap.to(this.object.rotation, {
              duration: 2,
              y: 0,
            });
            this.toggle = false;
          }
        }
      }

      class HoverCharacter {
        constructor(objectNormal, objectHover) {
          this.objectNormal = objectNormal;
          this.objectHover = objectHover;
          this.objectHover.visible = false;
          this.toggle = false;
          this.func1 = null;
          this.func2 = null;
          this.disable = false;
          this._raycaster = new THREE.Raycaster();
        }
        cursorAttach() {
          // console.log('raycaster ',this._raycaster.intersectObjects([this.objectNormal]))
          return (
            this._raycaster.intersectObjects([this.objectNormal]).length > 0
          );

          // return this.attachDistance;
        }
        HideAll(hide) {
          if (typeof hide != "boolean")
            throw Error("HideAll must pass in boolean type");
          else {
            if (this.disable == true) this.objectNormal.visible = false;
            else this.objectNormal.visible = hide;
            // this.objectHover.visible = hide;
          }
        }
        HoverHandle() {
          if (this.cursorAttach()) {
            this.objectNormal.visible = false;
            this.objectHover.visible = true;
          } else {
            this.objectNormal.visible = true;
            this.objectHover.visible = false;
          }

          if (!this.toggle && this.cursorAttach()) {
            this.func1();
            this.toggle = true;
          } else if (this.toggle && !this.cursorAttach()) {
            this.toggle = false;
            this.func2();
          }
        }
        callbacksSetter(func1, func2) {
          this.func1 = func1;
          this.func2 = func2;
        }
        raycasterSetter(_mouse, _camera) {
          this._raycaster.setFromCamera(_mouse, _camera);
        }
      }
      class AddLight {
        constructor(lightObject) {
          this.lightObject = lightObject;

          switch (this.lightObject.type) {
            case "RectAreaLight":
              // this.lightObjectHelper = new HELPER.RectAreaLightHelper(
              //   this.lightObject
              // );
              // this.lightObject.add(this.lightObjectHelper);

              break;
            case "PointLight":
              this.lightObjectHelper = new THREE.PointLightHelper(
                this.lightObject,
                5
              );
              break;
            default:
              console.log(this.lightObject);
          }
          // this.lightObject.castShadow = true;
          scene.add(this.lightObject);
          scene.add(this.lightObjectHelper);
        }
        setPosition(x, y, z) {
          this.lightObject.position.set(x, y, z);
        }
      }
      let A_kon = new Array();

        let a_kon_start_position = new THREE.Vector3(
          17.410961389541626,
          1.68561190366745,
          -4.0269893407821655
        );
        let end_position = new THREE.Vector3(
          -4.440825462341309 * 10,
          0.168561190366745 * 10,
          -0.402698934078216 * 10
        ); // 需要*10 以符合放大10倍的比例

        let arrowList = new Array();
        arrowList.push(
          new AnimateObjectHide(
            new THREE.Vector3(
              6.991161108016968,
              0.8657156676054001,
              -0.7908161729574203
            ),
            6
          )
        );
        arrowList.push(
          new AnimateObjectHide(
            new THREE.Vector3(
              -8.720005750656128,
              0.865715742111206,
              2.573263347148895
            ),
            6
          )
        );
        arrowList.push(
          new AnimateObjectHide(
            new THREE.Vector3(
              -17.93976902961731,
              0.865715742111206,
              3.0435776710510254
            ),
            6
          )
        );
        arrowList.push(
          new AnimateObjectHide(
            new THREE.Vector3(
              -29.51202392578125,
              0.865715742111206,
              2.210468053817749
            ),
            6
          )
        );

        let FishmongerList = new Array();
        let Car = new AnimateObject(
          new THREE.Vector3(
            11.767337322235107,
            2.2295211255550385,
            0.0820380449295044
          ),
          6
        );
        Car.direction = 0;

        let KickMan = new AnimateObject(
          new THREE.Vector3(
            -2.7316588163375854,
            0.815223678946495,
            -7.15338945388794
          ),
          10
        );

        let SwordFish = new AnimateObject(
          new THREE.Vector3(
            -28.70699882507324,
            -1.7775985598564148,
            -11.736360788345337
          ),
          13
        );
        let act_swordfish_flip_tail =  new AnimateObject(
          new THREE.Vector3(
            -27.964,
            0.20713,
            -2.3082
          ),
          5
        );

        let DragLady = new AnimateObject(
          new THREE.Vector3(
            -21.90814971923828,
            0.25204645469784737,
            -3.91421377658844
          ),
          5
        );

        let mixer;
        let par_monger1 = new PasserBy(
          new THREE.Vector3(
            6.991161108016968,
            0.8657156676054001,
            -0.7908161729574203
          ),

          8
        );
        let par_monger4 = new PasserBy(
          new THREE.Vector3(
            -29.51202392578125,
            0.865715742111206,
            2.210468053817749
          ),
          8
        );
        let par_monger2 = new PasserBy(
          new THREE.Vector3(
            -8.720005750656128,
            0.865715742111206,
            2.573263347148895
          ),
          8
        );
        let par_monger3 = new PasserBy(
          new THREE.Vector3(
            -17.93976902961731,
            0.865715742111206,
            3.0435776710510254
          ),
          8
        );


      // let start_display = true;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      scene = new THREE.Scene();
      scene.background = new THREE.Color("#ffffff");
      canvas = document.querySelector("#three");
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true; // 設定需渲染陰影效果
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.gammaFactor = 3; //2.2
      renderer.gammaOutput = true;



      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        400
      );
      camera.position.x = 25;
      camera.position.y = 1.5;
      camera.position.z = -3.8;
      camera.lookAt(-25, 1.5, 3.8);

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

      const listener = new THREE.AudioListener();
      camera.add(listener);
      // scene.fog = new THREE.FogExp2(0x36fff8, 0.015);

      // create a global audio source
      const sound = new THREE.Audio(listener);

      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load("sound/sea.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        // sound.play();
      });

      const Hemilight = new THREE.HemisphereLight(0x00aeff, 0x080820, 3.1);
      scene.add(Hemilight);
      let light1 = new AddLight(
        new THREE.RectAreaLight(0xff6969, 4.1, 100, 100)
      );
      light1.setPosition(0, 50, 0);
      light1.lightObject.lookAt(
        light1.lightObject.position.x,
        0,
        light1.lightObject.position.z
      );
      let light3 = new AddLight(new THREE.PointLight(0x060075, 4.1, 100));
      light3.setPosition(0, 30, 0);
      let light5 = new AddLight(new THREE.PointLight(0xb55202, 0.5, 25));
      light5.setPosition(30, 5, 0);
      let light6 = new AddLight(new THREE.RectAreaLight(0x541500, 10, 100, 20));
      light6.setPosition(0, 0, -10);
      light6.lightObject.lookAt(
        light6.lightObject.position.x,
        light6.lightObject.position.y,
        1000
      );
      let light7 = new AddLight(
        new THREE.RectAreaLight(0x00e0e0, 7.1, 100, 20)
      );
      light7.setPosition(0, 0, -10);
      light7.lightObject.lookAt(
        light7.lightObject.position.x,
        light7.lightObject.position.y,
        -1000
      );

      let seaVertices = 100;
      let seaAmp = 0.8;

      sea = new Sea(seaAmp, seaVertices, seaVertices, 0.8, 0, 0);
      sea.init();
      // scene.add(sea.mesh);
      sea.mesh.position.y = -4;
      sea.mesh.castShadow = false;
      sea.mesh.receiveShadow = true;
      let PasserbyList = new Array();

      /**
       *
       *
       *
       *
       *
       *
       */

      const Lottieloader = new LottieLoader();
      // Lottieloader.setQuality(2);

      Lottieloader.load(
        "loadingLottie/flowers.json",
        function (texture) {
          // texture = new THREE.TextureLoader().load( 'textures/uv_grid_directx.jpg' );

          const geometry = new THREE.PlaneGeometry(2, 2);
          // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
          const material = new THREE.MeshPhysicalMaterial({
            roughness: 0.1,
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.3,
          });

          mesh = new THREE.Mesh(geometry, material);
          mesh.position.y = 1;
          mesh.lookAt(mesh.position.x, 1000, mesh.position.z);
          scene.add(mesh);
        },
        function (xhr) {
          console.log(xhr);
        },
        function (err) {
          console.log(err);
        }
      );

      //"../loadingLottie/loading.json"

      const geometry = new THREE.PlaneGeometry(0.5, 0.5);

      const loader = new THREE.TextureLoader();

      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: 0.2,
        map: loader.load("images/footprints.png"),
      });
      let NavigatingMash = new THREE.Mesh(geometry, material);
      NavigatingMash.position.y = 1;
      NavigatingMash.lookAt(
        NavigatingMash.position.x,
        1000,
        NavigatingMash.position.z
      );
      scene.add(NavigatingMash);

      if (1) {
        const axesHelper = new THREE.AxesHelper(400);
        scene.add(axesHelper);
      }

      {
        // instantiate a loader
        const loader = new THREE.ObjectLoader();
        // load a resource
        loader.load(
          // resource URL
          "../models/market3.json",
          // called when resource is loaded
          function (obj) {
            globalObject = obj;
            let ground = obj.getObjectByName("ground");
            ground.receiveShadow = true;

            // console.log(obj.animations);

            obj.traverse((child) => {
              if (
                // child.name.includes("boxShadow") ||
                child.name.includes("roof")
              ) {
                child.castShadow = true;
                if (child.name.includes("pillar")) child.receiveShadow = true;
                else child.receiveShadow = true;
              }
              if (child.isMesh) {
                if (child.name.includes("front"))
                  child.material.side = THREE.FrontSide;
                else if (child.name.includes("back"))
                  child.material.side = THREE.BackSide;
                child.material.alphaTest = 0.5;
                child.material.transparent = true;
              }
      if ( child.type == 'SkinnedMesh' ) {
        child.frustumCulled = false;
      }

            });

            obj.scale.set(10, 10, 10);
            obj.position.set(0, 0, 0);
            scene.add(obj);
            controls.colliders = obj;

            A_kon.push(new AKon(obj.getObjectByName("par_a_kon_start"), 3));
            Car.Object = obj.getObjectByName("par_car");
            Car.Object.position.z = -0.6;
            obj.getObjectByName("par_monger4");

            par_monger4.object = obj.getObjectByName("par_monger4");
            par_monger2.object = obj.getObjectByName("par_monger2");
            par_monger3.object = obj.getObjectByName("par_monger3");
            par_monger1.object = obj.getObjectByName("par_monger1");

            // a_kon_start = obj.getObjectByName("a_kon_start");


            let swordfish_flip = obj.getObjectByName("swordfish_flip_tail_armature");
            swordfish_flip.position.y += 3;





            Sheetlist.push(
              new HoverCharacter(
                obj.getObjectByName("sheet_power_normal"),
                obj.getObjectByName("sheet_power_white")
              )
            );
            Sheetlist.push(
              new HoverCharacter(
                obj.getObjectByName("sheet_brave_normal"),
                obj.getObjectByName("sheet_brave_white")
              )
            );
            Sheetlist[0].HideAll(false);
            Sheetlist[1].HideAll(false);
            Sheetlist[0].callbacksSetter(
              function () {
                vuexUpdatePool.id = "sheet_power";
              },
              function () {
                vuexUpdatePool.id = "";
              }
            );
            Sheetlist[1].callbacksSetter(
              function () {
                vuexUpdatePool.id = "sheet_brave";
              },
              function () {
                vuexUpdatePool.id = "";
              }
            );

            boat01 = obj.getObjectByName("boat01");
            boat02 = obj.getObjectByName("boat02");
            footprint = obj.getObjectByName("footprint_test");

            for (let j = 1; j <= 4; j++) {
              arrowList[j - 1].Object = obj.getObjectByName("arrow_monger" + j);
              arrowList[j - 1].Object.visible = false;
            }

            for (let j = 0; j <= 3; j++) {
              FishmongerList.push(
                new HoverCharacter(
                  obj.getObjectByName(`monger${j + 1}_normal`),
                  obj.getObjectByName(`monger${j + 1}_hover`)
                )
              );
              FishmongerList[j].callbacksSetter(
                () => {
                  vuexUpdatePool = {
                    id: `monger${j + 1}`,
                    display: true,
                  };
                },
                () => {
                  vuexUpdatePool = {
                    id: `monger${j + 1}`,
                    display: false,
                  };
                }
              );
            }

            mixer = new THREE.AnimationMixer(obj);

            for (let j = 0; j < obj.animations.length; j++) {
              let animation_name = obj.animations[j].name;
              // console.log(animation_name);
              if (
                animation_name.includes("car") ||
                animation_name.includes("tire")
              )
                Car.AppendInfiniteAnimation(
                  mixer.clipAction(obj.animations[j])
                );
              else if (animation_name.includes("swordfish"))
                SwordFish.AppendAnimation(mixer.clipAction(obj.animations[j]));
                else if (animation_name.includes("act_swordfish_flip_tail"))
                act_swordfish_flip_tail.AppendInfiniteAnimation(mixer.clipAction(obj.animations[j]));
              else if (animation_name.includes("drag"))
                DragLady.AppendAnimation(mixer.clipAction(obj.animations[j]));
              else if (animation_name.includes("kick"))
                KickMan.AppendAnimation(mixer.clipAction(obj.animations[j]));
              else if (animation_name.includes("act_arrow_monger")) {
                let seq = animation_name.split("monger")[1];
                let seqInt = parseInt(seq);
                arrowList[seqInt - 1].AppendInfinitAnimation(
                  mixer.clipAction(obj.animations[j])
                );
              }
            }

            DragLady.Object = obj.getObjectByName("par_drag_man");

            for (let j = 1; j <= 9; j++)
              if (j != 7)
                PasserbyList.push(
                  new PasserBy(obj.getObjectByName("par_passerby0" + j), 4.5)
                );
              else
                PasserbyList.push(
                  new PasserBy(obj.getObjectByName("par_passerby0" + j), 10)
                );
          },
          // called when loading is in progresses
          function (xhr) {
            callbacks(xhr);
            console.log(xhr.loaded);
            if (xhr.loaded / 129157615 >= 1) {
              market_loaded = true;
            }
          }
        );
      }
      ////

      controls = new FirstPersonCameraControl(camera, document.body);
      controls.enabled = true;
      controls.applyGravity = false;
      controls.applyCollision = true;
      controls.positionEasing = true;
      // console.log(scene)

      function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
            function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      function animate() {
        if (market_loaded) {
          // store.commit("setMarketLoadedTrue");

          delayForAnimate();
        }
        if (readyForOBJanimation) {
          // this.composer.render();
          renderer.render(scene, camera);
          //  composer.render();
        }

        sea.moveWaves();
        // Lowersea.moveWaves();
        requestAnimationFrame(animate);

        // console.log(camera.quaternion);

        if (controls.enabled) controls.update();
        if (isMobile) controls.mobileMove(); //isMobile
        raycaster.setFromCamera(mouse, camera);

        let disTo_end = camera.position.distanceTo(end_position);
        if (disTo_end < 3) {
          // console.log(store.state.marketDisplay)
          store.commit("marketChangeState", { id: "sence_end", display: true });
        }

        if (readyForOBJanimation) {
          const intersects = raycaster.intersectObjects(
            scene.children[scene.children.length - 1].children
          );

          if (intersects.length > 0) {


            // console.log(intersects);
            if (intersects[0].object.name == "ground") {
              {
                pointToGround.position = intersects[0].point;
                pointToGround.distance = intersects[0].distance;
              }

              // pointToGround
              let pos = Object.assign({}, intersects[0].point);
              NavigatingMash.position.set(
                (pos.x * 1).toFixed(5),
                (pos.y * 1 + 0.1).toFixed(5),
                (pos.z * 1).toFixed(5)
              );
              //  NavigatingMash.lookAt(camera.position)
              pointToGround.isTrue = true;

              // cube.position.set(
              //   intersects[0].point.x,
              //   intersects[0].point.y,
              //   intersects[0].point.z
              // );
            } else {
              pointToGround.isTrue = false;
            }

            // console.log(intersects[0].point)
          }
          // for (let i = 0; i < intersects.length; i++) {

          // }
          // console.log(camera.position)
          mixer.update(0.016);

          Sheetlist[0].raycasterSetter(mouse, camera);
          Sheetlist[1].raycasterSetter(mouse, camera);
          for (let j = 0; j <= 3; j++)
            FishmongerList[j].raycasterSetter(mouse, camera);

          // boat01.position.y = Math.sin(Date.now() / 500 + 300) * 0.05 - 0.3;
          // boat02.position.y = Math.sin(Date.now() / 500) * 0.05 - 0.3;
          //////////////////////////////////////

          // A_kon[0] means first a kon at start point of market
          if (A_kon[0].IsApproach()) {
            if (A_kon[0].DoOnce) {
              store.commit("marketChangeState", {
                id: "sence_start",
                display: true,
              });
              A_kon[0].DoOnce = false;
            }
            A_kon[0].Filp();
            Sheetlist[0].HoverHandle();
            Sheetlist[1].HoverHandle();
            Sheetlist[0].HideAll(true);
            Sheetlist[1].HideAll(true);
          } else {
            Sheetlist[0].HideAll(false);
            Sheetlist[1].HideAll(false);
          }

          if (Car.IsApproach() || Car.doOnce) {
            Car.doOnce = true;
            Car.PlayAnimation();

            if (Car.doOnce) {
              if (Car.Object.position.z < -0.5) {
                Car.direction = 1;
              } else if (Car.Object.position.z > 1.5) {
                Car.direction = 0;
              }

              if (Car.direction) {
                Car.Object.position.z += 0.003;
              } else if (!Car.direction) {
                Car.Object.position.z -= 0.003;
              }
            }
          }
          for (let j = 0; j <= 3; j++) {
            // FishmongerList[j].raycasterSetter(raycaster)
            if (arrowList[j].IsApproach()) {
              FishmongerList[j].HoverHandle();
              arrowList[j].ShowAvailable(true);
              arrowList[j].PlayAnimation();
              console.log(arrowList[j])
            } else {
              arrowList[j].ShowAvailable(false);
            }
          }

          if (par_monger4.IsApproach()) {
            par_monger4.object.lookAt(camera.position);
          }

          if (par_monger2.IsApproach()) {
            par_monger2.object.lookAt(camera.position);
          }

          if (par_monger3.IsApproach()) {
            par_monger3.object.lookAt(camera.position);
          }
          if (par_monger1.IsApproach()) {
            par_monger1.object.lookAt(camera.position);
          }

          if (KickMan.IsApproach()) {
            if (KickMan.DoOnce == true) {
              KickMan.DoOnce = false;
              let currentQuaternion = camera.position.clone();

              gsap.to(camera.position, {
                duration: 1,
                repeat: 0,
                x: 6.241002770590721,
                y: 1.5,
                z: -2.8831586237151945,
              });
              console.log(currentQuaternion);

              gsap.to(camera.rotation, {
                duration: 1,
                repeat: 0,
                y: Math.PI / 2,
              });

              setTimeout(KickMan.PlayAnimation(), 2500);
            }
          }

          if (SwordFish.IsApproach()) {
            if (SwordFish.DoOnce) {
              SwordFish.DoOnce = false;
              gsap.to(camera.position, {
                duration: 0.5,
                repeat: 0,
                x: -25.481761805844634,
                y: 1.5,
                z: -4.4241223574449045,
              });

              gsap.to(camera.quaternion, {
                duration: 1,
                repeat: 0,
                w: 0.9241902014275073,
                x: 0.07037400092097702,
                y: 0.37430947590170366,
                z: -0.028502417966723204,
              });
              // console.log(camera.position);
              setTimeout(SwordFish.PlayAnimation(), 1900);
            }
          }

          if (DragLady.IsApproach()) {
            DragLady.PlayAnimation();
            DragLady.Object.position.z += 0.005;
            DragLady.Object.position.x += 0.001;
          }

          {
            act_swordfish_flip_tail.PlayAnimation()
          }

          for (let j = 0; j < PasserbyList.length; j++) {
            // PasserbyList[j].Filp();
            // PasserbyList[j].object.lookAt(camera.position);
          }
          // A_kon[0].object.lookAt(camera.position)
          // DragLady.Object.lookAt(camera.position)
        }
        RunCommandMethod();
      }

      let doOnce = false;
      function delayForAnimate() {
        if (!doOnce) {
          doOnce = true;
          setTimeout(() => {
            readyForOBJanimation = true;
            camera.lookAt(25, 1.5, 3.8);
          }, 1000);
        }
      }
      window.addEventListener("mousemove", onMouseMove, false);
      window.addEventListener("resize", onWindowResize, false);

      this.$emit("scene", scene);
      this.$store.commit("setScene", scene.children);

      document.addEventListener("dblclick", function () {
         console.log("Before clear", vuexUpdatePool);
        console.log(pointToGround);
        if (pointToGround.isTrue) {
          console.clear();

          pointToGround.isTrue = false;
          controls.enabled = false;
          gsap.to(camera.position, {
            duration: pointToGround.distance / 4,
            repeat: 0,
            x: pointToGround.position.x,
            z: pointToGround.position.z,
          });
          setTimeout(() => {
            controls.enabled = true;
          }, pointToGround.distance / 4);
        } else {
          if (vuexUpdatePool.id != "") {
            store.commit("marketChangeState", {
              id: vuexUpdatePool.id,
              display: vuexUpdatePool.display,
            });
            if (vuexUpdatePool.id.includes("sheet")) {
              Sheetlist[0].disable = true;
              Sheetlist[1].disable = true;

              A_kon[0].object.visible = false;
              scene.remove(A_kon[0].object);
            }
            vuexUpdatePool.id = "";
            vuexUpdatePool.display = false;
          } else {
            vuexUpdatePool.id = "";
            vuexUpdatePool.display = false;
          }

          console.log("After clear", vuexUpdatePool);
        }
      });

      animate();
    },
  },
};
</script>

<style scoped>
.backgroung_back {
  background-color: black;
}
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
