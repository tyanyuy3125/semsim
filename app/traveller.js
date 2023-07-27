import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module";

// Author: Lang Yang
// Animation controller for camera
class Traveller {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.lookAt = new THREE.Vector3();

    this.aimAtTarget = (aimObject, aimDuration) => {
      this.lookAt.copy(this.controls.target);
      return new TWEEN.Tween(this.lookAt)
        .to(aimObject.position, aimDuration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          this.camera.lookAt(this.lookAt);
          this.controls.target = this.lookAt;
        });
    };

  }

  // Call this to travel to target object
  // targetObject: the object to travel to
  // focus : the object to look at when travelling
  travelToTarget(targetObject, focus, moveDuration = 2000) {
    focus = focus || targetObject;
    const scalar = targetObject.geometry.parameters.radius;
    let offsetVec3 = new THREE.Vector3()
      .subVectors(this.camera.position, targetObject.position)
      .normalize()
      .multiplyScalar(4 * scalar);
    let arrivalPosition = new THREE.Vector3().addVectors(
      targetObject.position,
      offsetVec3
    );

    this.dispatchLaunchEvent();
    const aimTween = this.aimAtTarget(focus, moveDuration * 0.5);
    return aimTween.onComplete(() => {
      new TWEEN.Tween(this.camera.position)
        .to(arrivalPosition, moveDuration)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
          this.controls.target = focus.position;
          arrivalPosition.addVectors(targetObject.position, offsetVec3);
        })
        .start()
        .onComplete(() => this.dispatchArriveEvent());
    });
  }

  // Call this in tick process
  update() {
    TWEEN.update();
  }

  dispatchLaunchEvent() {
    this.controls.enabled = false;
  }

  dispatchArriveEvent() {
    this.controls.enabled = true;
  }
}

export default Traveller;
