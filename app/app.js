const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 10, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
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

// sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  // MeshBasicMaterial does not react to light
  map: new THREE.TextureLoader().load("../assets/sun.jpg"),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
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

// sunlight
const sunLight = new THREE.PointLight(0xfafad2, 1);
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

const clock = new THREE.Clock();
let oldElapsedTime = 0;
TIME.timespeed = 1;
TIME.timespeed = 100000000; // UNCOMMENT TO SPEED UP TIME

// animation loop
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  TIME.update(deltaTime);

  updateHUD();

  updateMeshs();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();