import * as THREE from "three";
export function marketSetting(passInScene) {
  passInScene.traverse((child) => {
    if (
      // child.name.includes("boxShadow") ||
      child.name.includes("roof")
    ) {
      child.castShadow = true;
      if (child.name.includes("pillar")) child.receiveShadow = true;
      else child.receiveShadow = true;
    }
    if (child.isMesh) {
      if (child.name.includes("front")|| child.name.includes("sheet")) {
        child.material.side = THREE.FrontSide;
        // console.log(child);
      } else if (child.name.includes("back")) {
        child.material.side = THREE.BackSide;
        // console.log(child);
      }
      if(child.name.includes("cloud") )
      {
        child.material.side = THREE.DoubleSide;
        // console.log(child)
      }

      child.material.alphaTest = 0.5;
      child.material.transparent = true;
    }

  });
}

export function sceneSetting(passInScene){
  passInScene.traverse((child) => {
    if (child.isMesh) {
      child.material.alphaTest = 0.1;
      child.material.transparent = true;
      child.frustumCulled = false;

      }
  })

}

export function collectObject(passInMarket) {
  let keywrodList = ["monger", "ground","tutorial_click","sheet",'wall'];
  let intersectObjectList = new Array();
  passInMarket.traverse((child) => {
    keywrodList.forEach((elem) => {
      if (child.name.includes(elem)) {
        intersectObjectList.push(child);
      }
    });
  });
  // console.log('intersectObjectList:',intersectObjectList)
  return intersectObjectList;
}
