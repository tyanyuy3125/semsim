// Trackball controls module
// Provides a way to move the camera using the mouse.

import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class CustomTrackballControls extends TrackballControls {
  constructor(camera, domElement) {
    super(camera, domElement);

    this.minDistance = camera.near;
    this.maxDistance = 2000;
    this.isMouseWheelMoving = false;
    this.enableDamping = true;
    this.dampingFactor = 0.1; 
    this.noPan = true;

    this.addEventListener('change', () => {
      this.isMouseWheelMoving = true;
    });
  }

  update() {
    super.update();
  }
}

export default CustomTrackballControls;
