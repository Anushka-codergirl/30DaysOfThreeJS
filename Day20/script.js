import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 50);

var controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 20);
controls.update();

var scene = new THREE.Scene();

var globalMaterial = new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(generateSprite()),
  blending: THREE.AdditiveBlending,
});

let particles = [];
let numOfParticles = 50000;

let sigma = 10;
let rho = 30;
let beta = 3;

let dt = 0.008;

for (var i = 0; i < numOfParticles; i++) {
  let material = new THREE.Sprite(globalMaterial);

  let x, y, z;
  if (i == 0) {
    x = y = z = 0.1;
  } else {
    x = particles[i - 1].material.position.x;
    y = particles[i - 1].material.position.y;
    z = particles[i - 1].material.position.z;

    let dx = sigma * (y - x);
    let dy = x * (rho - z) - y;
    let dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }

  let particle = new Particle(material, x, y, z);
  particle.material.scale.x = 0.1;
  particle.material.scale.y = 0.2;
  particle.material.scale.z = 0.3;

  scene.add(particle.material);
  particles.push(particle);
}

dt = 0.001;
function render() {
  renderer.render(scene, camera);

  renderer.autoClearColor = false;
  for (var i = 0; i < numOfParticles; i++) {
    let x = particles[i].material.position.x;
    let y = particles[i].material.position.y;
    let z = particles[i].material.position.z;

    let dx = sigma * (y - x);
    let dy = x * (rho - z) - y;
    let dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    particles[i].material.position.x = x;
    particles[i].material.position.y = y;
    particles[i].material.position.z = z;
  }

  controls.update();
  requestAnimationFrame(render);
}

render();

// Generate particle and particle sprite
function Particle(material, x, y, z) {
  this.material = material;
  this.material.position.x = x;
  this.material.position.y = y;
  this.material.position.z = z;
}

function generateSprite() {
  var canvas = document.createElement("canvas");
  canvas.width = 12;
  canvas.height = 12;

  var context = canvas.getContext("2d");
  var gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(50, 50, 50, 1)");
  gradient.addColorStop(0.4, "rgba(0, 0, 64, 1)");
  gradient.addColorStop(0.6, "rgba(0, 0, 64, 1)");
  gradient.addColorStop(0.8, "rgba(128, 0, 64, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 255)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}
