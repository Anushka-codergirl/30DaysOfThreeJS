import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { GlitchPass } from "https://esm.sh/three/examples/jsm/postprocessing/GlitchPass.js";
import { EffectComposer } from "https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js";

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

// Create a plane with a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "https://images.unsplash.com/photo-1549907062-15122f762606?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDI5MDk1OTJ8&ixlib=rb-4.0.3&q=85"
);
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Add glitch effect with modified color channels

// Add glitch effect
const glitchPass = new GlitchPass();
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(glitchPass);

// Set up camera position
camera.position.z = 10;

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update glitch pass
  glitchPass.uniforms["seed"].value = Math.random() * 0.1;
  glitchPass.uniforms["byp"].value = Math.random() > 0.8;

  // Render the scene
  composer.render();
};

// Handle window resize
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
  composer.setSize(newWidth, newHeight);
});

// Start the animation
animate();
