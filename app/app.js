import * as THREE from "three";
import CustomControls from "./control.js";
import TIME from "./time";
import orbit from "./orbit";
import Traveller from "./traveller.js";
import * as ASTRO from "./astro.js";
import * as OBSERVE from "./observePoints.js";
import * as HUD from "./HUD.js"
import { Compositor } from "./compositor"

const SCALE = 1000;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.021, 50000);
camera.position.set(0, 0.2 * SCALE, 1.5 * SCALE);

let canvas = window.document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const compositor = new Compositor(renderer, scene, camera, sizes.width, sizes.height);

const controls = new CustomControls(camera, renderer.domElement);

const traveller = new Traveller(camera, controls);

// resize listener
let resizeTimeout;
function resizeEvent() {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  compositor.setSize(sizes.width, sizes.height);
}
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeEvent();
  }, 500); // 500 milliseconds debounce time
});

// skybox
scene.background = new THREE.CubeTextureLoader().setPath('../assets/skybox/').load([
  'posX.jpg',
  'negX.jpg',
  'posY.jpg',
  'negY.jpg',
  'posZ.jpg',
  'negZ.jpg',
]);

const texLoader = new THREE.TextureLoader();

// sun
const sunGeometry = new THREE.SphereGeometry(SCALE * ( ASTRO.SunRadius / ASTRO.AU ), 32, 32);
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

// earth
const earthGeometry = new THREE.SphereGeometry(SCALE * ( ASTRO.EarthRadius / ASTRO.AU ), 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: texLoader.load("../assets/texture/earth_albedo.jpg"),
  normalMap: texLoader.load("../assets/texture/earth_normal.png"),
  roughnessMap: texLoader.load("../assets/texture/earth_roughness.png")
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;

const earthCloudGeometry = new THREE.SphereGeometry(1.01 * earthGeometry.parameters.radius, 32, 32);
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

const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.TextureLoader().load("../assets/texture/sprite.png"),
  transparent: true,
  opacity: 0.1
}));
sprite.scale.set(0.15, 0.15, 1);

earth.add(earthCloud);
earth.remove(earthCloud);


// moon
const moonGeometry = new THREE.SphereGeometry(SCALE * ( ASTRO.MoonRadius / ASTRO.AU ), 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("../assets/texture/moon_albedo.png"),
  bumpMap: new THREE.TextureLoader().load("../assets/texture/moon_disp.png"),
  bumpScale: 0.0015,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;

// sunlight
const sunLight = new THREE.PointLight(0xFFF6ED, 1);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 16384;
sunLight.shadow.mapSize.height = 16384;
sunLight.shadow.camera.near = 0.021;
sunLight.shadow.camera.far = 3*SCALE;

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);

// Earth orbit
const earthOrbit = new orbit(camera, sun, earth, 0x87CEEB);
const moonOrbit = new orbit(camera, earth, moon, 0xffffff);


function initScene() {
  scene.add(sun);
  scene.add(earth);
  earth.add(sprite);
  earth.add(earthCloud);
  scene.add(moon);
  scene.add(earthOrbit);
  scene.add(moonOrbit);
  sun.add(sunLight);
  scene.add(ambientLight);
}

function updateMeshs() {
  let earthInfo = ASTRO.getEarthInfo(TIME.current);
  earth.position.copy(earthInfo.position).multiplyScalar(SCALE);
  earth.rotation.y = earthInfo.rotation;
  earth.rotation.x = -earthInfo.oblecl;

  let moonInfo = ASTRO.getMoonInfo(TIME.current);
  moon.position.copy(moonInfo.position).multiplyScalar(SCALE).add(earth.position);
  moon.rotation.y = moonInfo.rotation;

  earthOrbit.update();
  moonOrbit.update();
}

const sunLabel = document.getElementById("sun-label");
const earthLabel = document.getElementById("earth-label");
const moonLabel = document.getElementById("moon-label");

const pushConcealIgnore = () => {
  scene.remove(earthOrbit);
  scene.remove(moonOrbit);
  earth.remove(earthCloud);
  earth.remove(sprite);
}

const popConcealIgnore = () => {
  scene.add(moonOrbit);
  scene.add(earthOrbit);
  earth.add(earthCloud);
  earth.add(sprite);
}

const labelConceal = (object, label, raycaster) => {
  const vector = object.position.clone();
  vector.project(camera);

  // check if it's outside the front of the camera
  if (vector.z >= 1.0000) {
    label.classList.add('invisible');
    return;
  }

  // check if it is behind another celestialbody
  raycaster.setFromCamera(vector, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0 && intersects[0].object !== object) {
    label.classList.add('invisible');
    return;
  }

  const translateX = (vector.x + 1) * sizes.width * 0.5;
  const translateY = (-vector.y + 1) * sizes.height * 0.5;
  label.style.transform = `translate(${translateX}px,${translateY}px)`;
};

function updateLabels() {
  (sun.position.distanceTo(camera.position) < 0.3 * SCALE) ?
    sunLabel.classList.add('invisible') :
    sunLabel.classList.remove('invisible');

  (earth.position.distanceTo(camera.position) < 0.01 * SCALE) ?
    (earthLabel.classList.add('invisible'),
      moonLabel.classList.remove('invisible'))
    :
    (earthLabel.classList.remove('invisible'),
      moonLabel.classList.add('invisible'));

  if (moon.position.distanceTo(camera.position) < 0.002 * SCALE) {
    moonLabel.classList.add('invisible');
    earthLabel.classList.remove('invisible');
  }

  const raycaster = new THREE.Raycaster();
  pushConcealIgnore();
  labelConceal(sun, sunLabel, raycaster);
  labelConceal(earth, earthLabel, raycaster);
  labelConceal(moon, moonLabel, raycaster);
  popConcealIgnore();
}

// TIME.current = new Date(2023, 3, 20, 11, 16, 44, 0); // 135.9, -16.8
// TIME.current = new Date(2001, 11, 14, 23, 31, 56, 0); // -130.7, 52.6
function updateTextures() {
  sunMaterial.uniforms.uTime.value = TIME.RelativeSecondInSunCycle();
}

// animation loop
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  window.requestAnimationFrame(tick);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  TIME.update(deltaTime);

  HUD.updateHUD();

  updateMeshs();

  updateTextures();

  controls.update();
  traveller.update();

  // Perfect sun eclipse:
  // camera.position.copy(earth.position);
  // camera.position.copy(landOnEarth(-130.7, 52.6));
  // camera.lookAt(sun.position);
  // camera.fov = 3;
  // camera.updateProjectionMatrix();

  // IMPORTANT: update label after render
  // renderer.render(scene, camera);
  compositor.render();
  updateLabels();
}

initScene();
resizeEvent();
tick();


// transform from lon and lat to position on earth
function landOnEarth(lonDeg, latDeg) {
  lonDeg = THREE.MathUtils.degToRad(lonDeg);
  latDeg = THREE.MathUtils.degToRad(latDeg);
  const r = 1.00 * SCALE * ( ASTRO.EarthRadius / ASTRO.AU );
  const vec3 = new THREE.Vector3(
    r * Math.cos(latDeg) * Math.cos(lonDeg),
    r * Math.sin(latDeg),
    -r * Math.cos(latDeg) * Math.sin(lonDeg)
  );
  var er = earth.rotation;
  vec3.applyAxisAngle(new THREE.Vector3(0, 1, 0), er.y);
  vec3.applyAxisAngle(new THREE.Vector3(1, 0, 0), er.x);
  vec3.applyAxisAngle(new THREE.Vector3(0, 0, 1), er.z);
  vec3.add(earth.position);
  return vec3;
}


document.getElementById("earth-label").addEventListener("click", () => {
  traveller.travelToTarget(earth).start();
});

document.getElementById("moon-label").addEventListener("click", () => {
  traveller.travelToTarget(moon).start();
});

document.getElementById("sun-label").addEventListener("click", () => {
  traveller.travelToTarget(sun).start();
});


// TO BE ADDED TO EVENT LISTENER:
export function resetView() {
  traveller.travelToTarget(OBSERVE.reset, sun).start()
  controls.maxDistance = 2000;
}

export function topView() {
  traveller.travelToTarget(OBSERVE.above, sun).start()
}

export function sideView() {
  traveller.travelToTarget(OBSERVE.side, sun).start()
}

// oringal method doesn't work and may cause frame drop?
export function mapSwitch() {
  // if (earth.children.includes(earthCloud)) {
  //   earth.remove(earthCloud);
  // } else {
  //   earth.add(earthCloud);
  // }
  earthCloud.visible = !earthCloud.visible;
}


topView_.addEventListener("click", (event) => {
  topView();
});

sideView_.addEventListener("click", (event) => {
  sideView();
});

resetView_.addEventListener("click", (event) => {
  resetView();
});