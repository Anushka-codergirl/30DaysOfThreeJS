import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

var renderer, scene, camera, shape;

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
  camera.position.z = 400;
  scene.add(camera);

  shape = new THREE.Object3D();

  scene.add(shape);

  var geometry = new THREE.TorusKnotGeometry(4.123, 0.7524, 132, 8, 20, 3);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  var object = new THREE.Mesh(geometry, material);
  object.scale.x = object.scale.y = object.scale.z = 15;
  shape.add(object);

  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xfc466b, 1);
  lights[0].position.set(-1, 10, 0);
  lights[1] = new THREE.DirectionalLight(0xff0000, 0.5);
  lights[1].position.set(1, 1, 0);
  lights[2] = new THREE.DirectionalLight(0x090979, 1);
  lights[2].position.set(-0.5, -0.5, 1);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  shape.rotation.z += 0.03;

  renderer.clear();

  renderer.render(scene, camera);
}