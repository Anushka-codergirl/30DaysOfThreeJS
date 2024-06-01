import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

// Set up scene
const scene = new THREE.Scene();

// Set up camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spheres
const numberOfSpheres = 10;
const spheres = [];

for (let i = 0; i < numberOfSpheres; i++) {
  const angle = (i / numberOfSpheres) * Math.PI * 2;
  const radius = 1;

  const sphereGeometry = new THREE.SphereGeometry(radius, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    depthTest: false,
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  sphereMesh.position.set(x, y, 0);

  spheres.push(sphereMesh);
  scene.add(sphereMesh);
}

//Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the spheres
  spheres.forEach((sphere) => {
    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;
  });

  renderer.render(scene, camera);
}

renderer.render(scene, camera);

// Handle window resize
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

//Start animation loop
animate();
