import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

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

// Create an array to store cube information
const cubes = [];

// Function to generate a random color
const getRandomColor = () => Math.random() * 0xffffff;

// Create multiple cubes
for (let i = 0; i < 1000; i++) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
  const cube = new THREE.Mesh(geometry, material);

  // Set random initial position and movement direction
  cube.position.x = (Math.random() - 0.5) * 10;
  cube.position.y = (Math.random() - 0.5) * 10;
  cube.direction = Math.random() > 0.5 ? 1 : -1; // Randomly set the direction

  scene.add(cube);
  cubes.push(cube);
}

// Set up the camera position
camera.position.z = 15;

// Animation function
const animate = () => {
  requestAnimationFrame(animate);

  // Move each cube up and down
  cubes.forEach((cube) => {
    cube.position.y += 0.05 * cube.direction;

    // Check if the cube is out of bounds, reverse its direction
    if (cube.position.y > 5 || cube.position.y < -5) {
      cube.direction *= -2;
    }
  });

  // Render the scene
  renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Start the animation loop
animate();
