import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

// Set up scene
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

// Create TorusGeometry
const torusGeometry = new THREE.TorusGeometry(5, 1, 16, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xed2f32,
  wireframe: true,
  emissive: 0x000000,
  metalness: 0.5,
  roughness: 0.5,
  flatShading: false,
});
const torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

// Animation parameters
const animationDuration = 8000; // Total animation duration in milliseconds
const openDuration = animationDuration / 2; // Duration for opening or closing
const pauseDuration = 1000; // Duration to pause between open and close

// Animation
const animateTorus = () => {
  const startTime = Date.now();

  const animate = () => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) % animationDuration;

    let progress;
    if (elapsed < openDuration) {
      // Opening arc animation
      progress = elapsed / openDuration;
    } else {
      // Closing arc animation
      progress = 1 - (elapsed - openDuration) / openDuration;
    }

    // Set different colors for the torus's various parts
    const color = new THREE.Color();
    color.setHSL(progress, 1, 0.5);
    material.color = color;

    torus.geometry.dispose();
    torus.geometry = new THREE.TorusGeometry(
      5,
      1,
      16,
      Math.floor(progress * 100)
    );

    torus.geometry.dispose();
    torus.geometry = new THREE.TorusGeometry(
      5,
      1,
      16,
      Math.floor(progress * 100)
    );

    requestAnimationFrame(animate);
  };

  animate();
};

animateTorus();

// Set up camera position
camera.position.z = 20;

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
