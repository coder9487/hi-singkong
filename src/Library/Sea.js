import * as THREE from "three";
export  class Sea {
  constructor(
    ampValue,
    vertX,
    vertY,
    waveOpacity,
    textOffsetX,
    textOffsetY
  ) {
    this.ampValue = ampValue;
    this.vertX = vertX;
    this.vertY = vertY;
    this.waveOpacity = waveOpacity;
    this.textOffsetX = textOffsetX;
    this.textOffsetY = textOffsetY;
  }

  init() {
    this.mesh = new THREE.Object3D();

    let geomWaves = new THREE.PlaneBufferGeometry(
      800,
      800,
      this.vertX,
      this.vertY
    );
    let textWaves = new THREE.TextureLoader().load(
      "../images/water4.jpeg"
    );
    textWaves.wrapS = THREE.RepeatWrapping;
    textWaves.wrapT = THREE.RepeatWrapping;
    textWaves.offset = new THREE.Vector2(
      this.textOffsetX,
      this.textOffsetY
    );
    textWaves.repeat.set(20, 20);

    let matWaves = new THREE.MeshPhysicalMaterial({
      //color:0x307ddd,
      transparent: true,
      opacity: this.waveOpacity,
      map: textWaves,
      side: THREE.DoubleSide,



      // depthWrite:true,
    });
    this.mesh = new THREE.Mesh(geomWaves, matWaves);

    geomWaves.applyMatrix4(
      new THREE.Matrix4().makeRotationX(Math.PI / 2)
    );
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
        amp: this.ampValue - 0.2,
        speed: 0.016 + Math.random() * 0.048,
      });
    }
  }
  initWideSea()
  {
    this.mesh = new THREE.Object3D();

    let geomWaves = new THREE.PlaneBufferGeometry(
      8000,
      8000,
      this.vertX,
      this.vertY
    );
    let textWaves = new THREE.TextureLoader().load(
      "../images/water4.jpeg"
    );
    textWaves.wrapS = THREE.RepeatWrapping;
    textWaves.wrapT = THREE.RepeatWrapping;
    textWaves.offset = new THREE.Vector2(
      this.textOffsetX,
      this.textOffsetY
    );
    textWaves.repeat.set(80, 80);

    let matWaves = new THREE.MeshPhysicalMaterial({
      //color:0x307ddd,
      transparent: true,
      opacity: this.waveOpacity,
      map: textWaves,
      side: THREE.DoubleSide,



      // depthWrite:true,
    });
    this.mesh = new THREE.Mesh(geomWaves, matWaves);

    geomWaves.applyMatrix4(
      new THREE.Matrix4().makeRotationX(Math.PI / 2)
    );
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
        amp: this.ampValue - 0.2,
        speed: 0.016 + Math.random() * 0.048,
      });
    }
  }
  moveWaves() {
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
  }
}
