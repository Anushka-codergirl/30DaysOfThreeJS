import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

// Set up scene, camera, renderer
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

// Create cube
const geometry = new THREE.BoxGeometry(2, 2, 2);

const material0 = new THREE.MeshBasicMaterial({ color: 0xfd1d1d });
const material1 = new THREE.MeshBasicMaterial({ color: 0x833ab4 });
const cube0 = new THREE.Mesh(geometry, material0);
const cube1 = new THREE.Mesh(geometry, material1);
scene.add(cube0);
scene.add(cube1);

// Position the camera
camera.position.z = 5;

// Animation Loop
const animate = function () {
  requestAnimationFrame(animate);

  cube0.rotation.x += 0.05;
  cube0.rotation.y += 0.1;
  cube1.rotation.x += 0.1;
  cube1.rotation.y += 0.15;

  renderer.render(scene, camera);
};

animate();