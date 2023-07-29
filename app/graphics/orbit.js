// Orbit module
// Author: Lang Yang
// Create: new orbit(camera, centerObject, surroundObject, color)
// Usage: call this.update() in the updateMesh process

import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

class orbit extends Line2 {
  constructor(camera, centerObject, surroundObject, color) {
    const geometry = new LineGeometry();
    const material = new LineMaterial({
      color: color,
      linewidth: 2,
      alphaToCoverage: true,
    });

    const points = [];
    for (let i = 0; i <= 360; i++) {
      points.push([
        Math.cos((i * Math.PI) / 180),
        0,
        Math.sin((i * Math.PI) / 180),
      ]);
    }
    material.resolution.set(window.innerWidth, window.innerHeight);
    geometry.setPositions(points.flat());

    super(geometry, material);
    this.castShadow = false;
    this.receiveShadow = false;

    this.camera = camera;
    this.centerObject = centerObject;
    this.surroundObject = surroundObject;
  }

  // Usage: call this in the updateMesh process
  update() {
    // update geometry stuff
    this.position.copy(this.centerObject.position);
    this.lookAt(this.surroundObject.position);
    let r = this.centerObject.position.distanceTo(this.surroundObject.position);
    this.scale.set(r, r, r);

    // update material resolution
    this.material.resolution.set(window.innerWidth, window.innerHeight);

    // dynamic opacity
    const distance = this.surroundObject.position.distanceTo(this.camera.position);
    const invisibleDistance = 30 * this.surroundObject.geometry.parameters.radius;
    // const opacity = (distance - invisibleDistance) / invisibleDistance;
    // this.material.opacity = opacity;
    if (distance < invisibleDistance) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
}

export default orbit;
