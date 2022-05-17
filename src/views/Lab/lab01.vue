<template>
  <div></div>
</template>
<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export default {
  setup() {},

  mounted() {
    let camera, controls, scene, renderer, mixer;

    init();
    //render(); // remove when using next line for animation loop (requestAnimationFrame)
    animate();

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);
      // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        1,
        200
      );
      camera.position.set(1, 1, 1);

      // controls

      controls = new OrbitControls(camera, renderer.domElement);
      controls.listenToKeyEvents(window); // optional

      //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

      controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05;

      controls.screenSpacePanning = false;

      controls.minDistance = 5;
      controls.maxDistance = 10;

      controls.maxPolarAngle = Math.PI / 2;

      // world

      const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
      });
      const loader = new GLTFLoader().setPath("models/");
      loader.load("swordfish.gltf", function (gltf) {
        let model = gltf.scene;

        scene.add(gltf.scene);
        gltf.scene.scale.set(10, 10, 10);
        console.log(gltf.animations);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[2]).play();


      });

      // const loader = new THREE.ObjectLoader().setPath("models/");
      // // const loader = new GLTFLoader();
      //  loader.load("swordfish.json", (obj) => {
      //    console.log(obj)
      //   obj.scale.set(10, 10, 10);
      //   obj.position.set(0, 0, 0);
      //   scene.add(obj)
      // });

      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 1600 - 800;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
      }

      // lights

      const dirLight1 = new THREE.DirectionalLight(0xffffff);
      dirLight1.position.set(1, 1, 1);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x002288);
      dirLight2.position.set(-1, -1, -1);
      scene.add(dirLight2);

      const ambientLight = new THREE.AmbientLight(0x222222);
      scene.add(ambientLight);

      //

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      if(mixer != undefined)
      mixer.update(0.016);
      controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

      render();
    }

    function render() {
      renderer.render(scene, camera);
    }
  },
};
</script>
<style lang="scss" scoped>
three {
  width: 100vw;
  height: 100vh;
}
</style>
