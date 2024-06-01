import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

// Create a scene
const scene = new THREE.Scene();

// Create multiple wheels
const numWheels = 10;
const wheels = [];

for (let i = 0; i < numWheels; i++) {
  const radius = 2 + i * 1;

  // Create a shiny material with a different color for each wheel
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    shininess: 100,
  });

  const wheelGeometry = new THREE.TorusGeometry(radius, 0.5, 16, 100);
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

  if (i > 0) {
    // If not the first wheel, position it inside the previous wheel
    wheel.position.x = wheels[i - 1].position.x;
    wheels[i - 1].add(wheel); // Add the wheel as a child
  } else {
    // Position the first wheel at the center of the scene
    wheel.position.x = 0;
    scene.add(wheel);
  }

  wheels.push(wheel);
}

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 70;

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add a directional light to create highlights and shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Enable shadows for all objects in the scene
scene.children.forEach((child) => {
  if (child instanceof THREE.Mesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

// Create a renderer with shadow map support
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Animation logic
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate all wheels together
  wheels.forEach((wheel) => {
    wheel.rotation.x += 0.01;
    wheel.rotation.y += 0.01;
    wheel.rotation.z += 0.01;
  });

  renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
