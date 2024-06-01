import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three/addons/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a Three.js Camera and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
  `https://cdn.glitch.global/9ba3bfd0-596b-4219-a48b-f1f3f3e2fc59/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container-3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = 25;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(1, 1, 1);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
scene.add(ambientLight);

// Create a rain material
const raindropTexture = new THREE.TextureLoader().load(
  "https://cdn.glitch.global/9ba3bfd0-596b-4219-a48b-f1f3f3e2fc59/waterdrop.webp?v=1703263578471"
);
const rainMaterial = new THREE.PointsMaterial({
  size: 0.1,
  map: raindropTexture,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Create rain particles
const rainGeometry = new THREE.BufferGeometry();
const rainVertices = [];

for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 40;
  const y = Math.random() * 40;
  const z = (Math.random() - 0.5) * 40;
  rainVertices.push(x, y, z);
}

rainGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(rainVertices, 3)
);

const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rainParticles);

// Update rain particles in the animate function
function animateRain() {
  const positions = rainParticles.geometry.attributes.position.array;

  for (let i = 1; i < positions.length; i += 3) {
    // Move the raindrops along the y-axis
    positions[i] -= 0.1;

    // Reset the raindrop's position if it goes below a certain threshold
    if (positions[i] < -20) {
      positions[i] = 20;
    }
  }

  rainParticles.geometry.attributes.position.needsUpdate = true;
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  object.rotation.y = -2 + (mouseX / window.innerWidth) * 4;
  object.rotation.x = -1 + (mouseY / window.innerHeight) * 2;

  animateRain(); // Update raindrop positions
  renderer.render(scene, camera);
  controls.update();
}

// Add controls for camera movement
controls = new OrbitControls(camera, renderer.domElement);

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add a listener to the mouse, so we can move the eye around
document.onmousemove = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
};

// Start the 3D rendering
animate();
