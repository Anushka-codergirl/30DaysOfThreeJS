import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

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

// Set initial camera position
camera.position.z = 5;

// Function to generate a random color
function getRandomColor() {
  return Math.random() * 0xffffff;
}

// Create multiple bubbles
const numBubbles = 100;
const bubbles = [];

for (let i = 0; i < numBubbles; i++) {
  const radius = Math.random() * 0.5 + 0.1;
  const segments = 32; // Number of segments in the sphere
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshPhongMaterial({
    color: getRandomColor(),
    transparent: true,
    opacity: 0.7,
  });
  const bubble = new THREE.Mesh(geometry, material);
  bubble.position.set(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  scene.add(bubble);
  bubbles.push(bubble);
}

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Rotate and change colors for each bubble
  bubbles.forEach((bubble) => {
    bubble.rotation.x += 0.01;
    bubble.rotation.y += 0.01;

    // Simulate floating motion
    bubble.position.y += Math.sin(Date.now() * 0.001) * 0.01;
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Start animation
animate();
