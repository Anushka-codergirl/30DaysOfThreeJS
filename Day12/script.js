import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 101;
controls.rotateSpeed = 5;
controls.zoomSpeed = 0.8;

// Set initial camera position
camera.position.z = 500;

// Gen random data
const N = 100;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.1) * 180,
  lng: (Math.random() - 0.4) * 360,
  size: Math.random() / 3,
  color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
}));

const Globe = new ThreeGlobe()
  .globeImageUrl(
    "https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg"
  )
  .bumpImageUrl(
    "https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png"
  )
  .pointsData(gData)
  .pointAltitude("size")
  .pointColor("color");

const globeMaterial = Globe.globeMaterial();
globeMaterial.bumpScale = 10;
new THREE.TextureLoader().load(
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  (texture) => {
    globeMaterial.specularMap = texture;
    globeMaterial.specular = new THREE.Color("grey");
    globeMaterial.shininess = 15;
  }
);

setTimeout(() => {
  gData.forEach((d) => (d.size = Math.random()));
  Globe.pointsData(gData);
}, 4000);

scene.add(Globe);
scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));
scene.background = new THREE.Color(0x40d21);

var dLight0 = new THREE.DirectionalLight(0xffffff, 0.8);
var dLight1 = new THREE.DirectionalLight(0x7982f6, 0.8);
var dLight2 = new THREE.DirectionalLight(0x8566cc, 0.8);
dLight0.position.set(1, 1, 1);
dLight1.position.set(-200, 500, 200);
dLight2.position.set(-200, 500, 200);
camera.add(dLight0);
camera.add(dLight1);
camera.add(dLight2);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start animation
animate();
