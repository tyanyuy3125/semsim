import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 10, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 100;

// append the renderer's canvas element as child of 'canvas-container'
window.document
  .getElementById("canvas-container")
  .appendChild(renderer.domElement);

// resize listener
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// stupid starry background (randomly generated)
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  sizeAttenuation: false,
});
const stars = new Array(10000).fill(0).map(() => {
  const star = new THREE.Vector3();
  star.x = THREE.MathUtils.randFloatSpread(1000);
  star.y = THREE.MathUtils.randFloatSpread(1000);
  star.z = THREE.MathUtils.randFloatSpread(1000);
  return star;
});
starsGeometry.setFromPoints(stars);
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  // MeshBasicMaterial does not react to light
  map: new THREE.TextureLoader().load("../assets/sun.jpg"),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// sunlight
const sunLight = new THREE.PointLight(0xffffff, 1);
sun.add(sunLight);
scene.add(sun);

// earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("../assets/earth.jpg"),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

// moon
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("../assets/moon.jpg"),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);
earth.add(moon);

// NOT PRECISE AT ALL :)
function updateMeshs() {
  sun.rotation.y += 0.005;
  earth.rotation.y += 0.0365;
  // moon.rotation.y += 0.0003

  earth.position.x = 20 * Math.cos(Date.now() * 0.0001);
  earth.position.z = 20 * Math.sin(Date.now() * 0.0001);

  moon.position.x = 3 * Math.cos(Date.now() * 0.0003);
  moon.position.z = 3 * Math.sin(Date.now() * 0.0003);
}

// animation loop
function animate() {
  updateMeshs();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
}

animate();
