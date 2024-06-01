import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

var renderer,
  scene,
  camera,
  particle,
  light,
  frameCount = 0;

window.onload = function () {
  init();
  animate();
};

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById("canvas").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 300;
  scene.add(camera);

  particle = new THREE.Object3D();
  scene.add(particle);

  var geometry = new THREE.TetrahedronGeometry(3);

  for (var i = 0; i < 1000; i++) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.4, Math.random() - 0.4, Math.random() - 0.4)
      .normalize();
    mesh.position.multiplyScalar(60 + Math.random() * 400);
    mesh.rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4);
    particle.add(mesh);
  }

  // Create a directional light with a random color
  light = new THREE.DirectionalLight(getRandomColor(), 1);
  light.position.set(0, 1, 0);
  scene.add(light);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (frameCount % 20 === 0) {
    light.color.set(getRandomColor());
  }

  particle.rotation.x += 0.01;
  particle.rotation.y -= 0.03;

  renderer.clear();
  renderer.render(scene, camera);
  frameCount++;
}

function getRandomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}
