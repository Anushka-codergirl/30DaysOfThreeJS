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

// Function to generate spiral points
const generateSpiralPoints = () => {
  const points = [];
  const totalPoints = 200;
  const radius = 1;
  const height = 20;
  const turns = 5;

  for (let i = 0; i < totalPoints; i++) {
    const angle = (i / totalPoints) * Math.PI * turns;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = (height / totalPoints) * i - height / 2;

    points.push(x, y, z);
  }

  return points;
};

// Create multiple instances of the spiral
const numSpirals = 20;
const distanceBetweenSpirals = 2;

for (let i = 0; i < numSpirals; i++) {
  const spiralPoints = generateSpiralPoints();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(spiralPoints, 3)
  );

  const material = new THREE.PointsMaterial({
    color: Math.random() * 0xffffff,
    size: 0.02,
  });

  const points = new THREE.Points(geometry, material);
  points.position.z = i * distanceBetweenSpirals;
  scene.add(points);
}

// Position the camera
camera.position.z = 30;

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate all spirals
  scene.children.forEach((spiral) => {
    spiral.rotation.x += 0.015;
    spiral.rotation.y += 0.015;
  });

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

animate();
