import * as THREE from "three";
import gsap from "gsap";

export class AnimateObject {
  constructor(object, toggleDistance, camera) {
    this.toggleDistance = toggleDistance;
    this.animationList = new Array();
    this.camera = camera;
    this.object = object;
    this.DoOnce = true;
    if(this.object == null)
      console.error("Error due to null object",)
  }

  distanceToCamera() {
    return this.camera.position.distanceTo(this.object.position.clone().multiplyScalar(10));
  }
  isApproach() {
    if (this.distanceToCamera() < this.toggleDistance) return true;
    else return false;
  }

  AppendAnimation(animateObjectTemp) {
    animateObjectTemp.setLoop(THREE.LoopOnce);
    animateObjectTemp.clampWhenFinished = true;
    this.animationList.push(animateObjectTemp);
  }
  AppendInfiniteAnimation(animateObjectTemp) {
    this.animationList.push(animateObjectTemp);
  }
  PlayAnimation() {
    for (let i = 0; i < this.animationList.length; i++) {


      this.animationList[i].play();
      // console.log(this.animationList[i]," now is playing.")
    }
  }
  PlayAnimationReset() {
    for (let i = 0; i < this.animationList.length; i++) {
      this.animationList[i].reset();

      this.animationList[i].play();
      // console.log(this.animationList[i]," now is playing.")
    }
  }
  ResetAnimation(){
    for (let i = 0; i < this.animationList.length; i++) {
      // this.animationList[i].reset();
      this.animationList[i].paused = true;
      // console.log(this.animationList[i]," now is playing.")
    }
  }
  CallBacks() {
    this.CallBacks();
  }
}
export class AnimateObjectHide extends AnimateObject {
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

export class PasserBy {
  constructor(camera, object, distance) {
    this.camera = camera;
    this.object = object;
    this.distance = distance;
    this.toggle = false;
    this.DoOnce = false;
  }
  isApproach() {
    return (
      this.camera.position.distanceTo(
        this.object.getWorldPosition(new THREE.Vector3())
      ) < this.distance
    );
  }

  Filp() {
    if (this.isApproach() && !this.toggle) {
      gsap.to(this.object.rotation, {
        duration: 2,
        y: this.object.rotation.y + Math.PI,
        onUpdate: () => {
          // const scrollTop = Math.round(tween.target.y)
          this.object.rotation.x = 0;
          this.object.rotation.z = 0;
        },
      });
      this.toggle = true;
    } else if (!this.isApproach() && this.toggle) {
      gsap.to(this.object.rotation, {
        onUpdate: () => {
          // const scrollTop = Math.round(tween.target.y)
          this.object.rotation.x = 0;
          this.object.rotation.z = 0;
        },
        duration: 2,
        y: this.object.rotation.y - Math.PI,
      });
      this.toggle = false;
    }
  }
  FilpOption(side) {
    if (side&& !this.toggle) {
      gsap.to(this.object.rotation, {
        duration: 2,
        y: this.object.rotation.y + Math.PI,
        onUpdate: () => {
          // const scrollTop = Math.round(tween.target.y)
          this.object.rotation.x = 0;
          this.object.rotation.z = 0;
        },
      });
      this.toggle = true;
    } else if (!side && this.toggle) {
      gsap.to(this.object.rotation, {
        onUpdate: () => {
          // const scrollTop = Math.round(tween.target.y)
          this.object.rotation.x = 0;
          this.object.rotation.z = 0;
        },
        duration: 2,
        y: this.object.rotation.y - Math.PI,
      });
      this.toggle = false;
    }
  }
  watchMe() {
    if(this.toggle )
    return
    this.object.lookAt(this.camera.position);
  }
  watchMyC() {
    let pos = this.object.position
    if(this.toggle )
    return
    let dis = this.camera.position.clone().distanceToSquared(pos);
    let originVector = this.camera.position
      .clone()
      .sub(pos.clone())
      .normalize();
    let crossVector = originVector.cross(new THREE.Vector3(0, 1, 0));
    this.object.lookAt(crossVector.multiplyScalar(dis));
  }
  watchMyCOppsite() {
    let pos = this.object.position
    if(this.toggle )
    return
    let dis = this.camera.position.clone().distanceToSquared(pos);
    let originVector = this.camera.position
      .clone()
      .sub(pos.clone())
      .normalize();
    let crossVector = originVector.cross(new THREE.Vector3(0, -1, 0));
    this.object.lookAt(crossVector.multiplyScalar(dis));
  }
  watchMyCrossVector(pos) {
    if(this.toggle )
    return
    let dis = this.camera.position.clone().distanceToSquared(pos);
    let originVector = this.camera.position
      .clone()
      .sub(pos.clone())
      .normalize();
    let crossVector = originVector.cross(new THREE.Vector3(0, 1, 0));
    this.object.lookAt(crossVector.multiplyScalar(dis));
  }
}
export class Akon extends PasserBy {
  constructor(object) {
    this.DoOnce = true;
  }
  Filp() {
    if (this.isApproach() && !this.toggle) {
      gsap.to(this.object.rotation, {
        duration: 2,
        y: Math.PI * 0.5,
      });
      this.toggle = true;
    } else if (!this.isApproach() && this.toggle) {
      gsap.to(this.object.rotation, {
        duration: 2,
        y: 0,
      });
      this.toggle = false;
    }
  }
}

export class HoverCharacter {
  constructor(objectNormal, objectHover, objectParent) {
    this.objectNormal = objectNormal;
    this.objectHover = objectHover;
    this.objectParent = objectParent;
    this.objectHover.visible = false;
    this.toggle = false;
  }

  // return this.attachDistance;

  HideAll(hide) {
    if (typeof hide != "boolean")
      throw Error("HideAll must pass in boolean type");
    else {
      if (this.disable == true) this.objectNormal.visible = false;
      else this.objectNormal.visible = hide;
      // this.objectHover.visible = hide;
    }
  }

  showHover() {
    this.objectNormal.visible = false;
    this.objectHover.visible = true;
  }
  showNormal() {
    this.objectNormal.visible = true;
    this.objectHover.visible = false;
  }
}

export class FishMonger extends HoverCharacter {
  constructor(
    objectNormal,
    objectHover,
    objectParent,
    camera,
    approachDistance
  ) {
    super(objectNormal, objectHover, objectParent);
    this.camera = camera;
    this.approachDistance = approachDistance;
  }
  isApproach() {
    return (
      this.camera.position.distanceTo(
        this.objectNormal.getWorldPosition(new THREE.Vector3())
      ) < this.approachDistance
    );
  }
  watchMe() {
    this.objectParent.lookAt(this.camera.position);
  }
}
