import * as THREE from 'three';
export const observeGeometry = new THREE.SphereGeometry(10, 32, 32);
const ghostMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
export const above = new THREE.Mesh(observeGeometry, ghostMaterial);
export const side = new THREE.Mesh(observeGeometry, ghostMaterial);
export const reset = new THREE.Mesh(observeGeometry, ghostMaterial);
above.position.set(0, 1500, 0);
side.position.set(2000, 0, 0);
reset.position.set(0, 200, 1500);
