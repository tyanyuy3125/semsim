import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TIME from "./time";
import * as HUD from "./HUD";
import { Compositor } from "./compositor"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 10, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const compositor = new Compositor(renderer, scene, camera, sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 100;

// append the renderer's canvas element as child of 'canvas-container'
window.document
  .getElementById("canvas-container")
  .appendChild(renderer.domElement);

// resize listener
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    compositor.setSize(sizes.width, sizes.height);
  }, 500); // 500 milliseconds debounce time
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

const texLoader = new THREE.TextureLoader();

// sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
import * as sunShader from "../assets/shader/sun";
const sunMaterial = new THREE.ShaderMaterial(
  {
    vertexShader: sunShader.vertShader,
    fragmentShader: sunShader.fragShader,
    uniforms: 
    {
      uTime: { value: 0 }
    }
  }
);

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = false;
sun.receiveShadow = false;
scene.add(sun);

// earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: texLoader.load("../assets/texture/earth_albedo.jpg"),
  normalMap: texLoader.load("../assets/texture/earth_normal.png"),
  roughnessMap: texLoader.load("../assets/texture/earth_roughness.png")
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;

const earthCloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
const cloudMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0xFFFFFF,
    alphaMap: texLoader.load("../assets/texture/earth_cloud_alpha.jpg"),
    transparent: true
  }
);
const earthCloud = new THREE.Mesh(earthCloudGeometry, cloudMaterial);
earthCloud.receiveShadow = true;
earthCloud.castShadow = true;
earth.add(earthCloud);
earth.remove(earthCloud);

const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load("../assets/texture/sprite.png"),
  transparent: true,
  opacity: 0.1
}));
sprite.scale.set(3.4, 3.4, 1);
earth.add(sprite);

scene.add(earth);

// moon
const moonGeometry = new THREE.SphereGeometry(0.5, 256, 128);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("../assets/texture/moon_albedo.png"),
  bumpMap: new THREE.TextureLoader().load("../assets/texture/moon_disp.png"),
  bumpScale: 0.1,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// sunlight
const sunLight = new THREE.PointLight(0xFFF6ED, 1);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 16384;
sunLight.shadow.mapSize.height = 16384;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sun.add(sunLight);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

earth.rotateX((-23.5 / 180) * Math.PI);

function updateMeshs() {
  // TODO: more accurate moon position?
  var py = TIME.ProportionInYear();
  var pd = TIME.ProportionInDay();
  var pl = TIME.ProportionInLunarMonth();

  earth.rotation.y = (py + pd - 0.72) * 2 * Math.PI;
  earth.position.set(
    -20 * Math.cos((py - 0.22) * 2 * Math.PI),
    0,
    20 * Math.sin((py - 0.22) * 2 * Math.PI)
  );

  moon.rotation.y = (py + pl - 0.72) * 2 * Math.PI;
  moon.position.x = earth.position.x + 3 * Math.cos((py + pl - 0.22) * 2 * Math.PI);
  moon.position.z = earth.position.z + 3 * Math.sin((0.22 - py - pl) * 2 * Math.PI);
}

function updateTextures() {
  sunMaterial.uniforms.uTime.value = TIME.RelativeSecondInSunCycle();
}

const clock = new THREE.Clock();
let oldElapsedTime = 0;
// TIME.timespeed = 0;
TIME.timespeed = 24 * 60 * 60 * 1000; // UNCOMMENT TO SPEED UP TIME

// animation loop
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  TIME.update(deltaTime);

  HUD.updateHUD();

  updateMeshs();
  updateTextures();

  controls.update();

  // renderer.render(scene, camera);
  compositor.render();

  window.requestAnimationFrame(tick);
}

tick();

function mapSwitch() {
  if (earth.children.includes(earthCloud)) {
    earth.remove(earthCloud);
  } else {
    earth.add(earthCloud);
  }
}
export { mapSwitch };
