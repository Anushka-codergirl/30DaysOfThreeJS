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

  var geometry = new THREE.TetrahedronGeometry(2, 0);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });

  var object = new THREE.Mesh(geometry, material);
  object.scale.x = object.scale.y = object.scale.z = 50;
  var object1 = new THREE.Mesh(geometry, material);
  object1.scale.x = object1.scale.y = object1.scale.z = -50;
  shape.add(object);
  shape.add(object1);

  var ambientLight = new THREE.AmbientLight(0x666699);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(-0.5, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x090979, 1);
  lights[1].position.set(1, 1, 0);
  lights[2] = new THREE.DirectionalLight(0xfdbb2d, 1);
  lights[2].position.set(-0.5, -0.5, 1);
  lights[3] = new THREE.DirectionalLight(0x22c1c3, 1);
  lights[3].position.set(1, 5, -1.5);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
  scene.add(lights[3]);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  shape.rotation.x -= 0.01;
  shape.rotation.y -= 0.04;
  renderer.clear();

  renderer.render(scene, camera);
}