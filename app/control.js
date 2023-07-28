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
    // this.noZoom = true;
    // this.lastTarget = new THREE.Vector3().copy(this.target);

    this.addEventListener('change', () => {
      this.isMouseWheelMoving = true;

      
    });
  }

  update() {
    super.update();
  // TODO: When target is moving, the distance between camera and target should be constant.
  }
}

export default CustomTrackballControls;
