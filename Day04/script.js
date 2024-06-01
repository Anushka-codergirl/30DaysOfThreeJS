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

  var geometry = new THREE.IcosahedronGeometry(2, 2);
  var material = new THREE.MeshPhongMaterial({
    wireframe: true,
    color: 0xffffff,
    specular: 0x555555,
  });

  var object = new THREE.Mesh(geometry, material);
  object.scale.x = object.scale.y = object.scale.z = 40;
  shape.add(object);

  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xff0000);
  lights[0].position.set(0, 1, 0);
  lights[1] = new THREE.DirectionalLight(0x00ff00);
  lights[1].position.set(0, -1, 0);
  lights[2] = new THREE.DirectionalLight(0x0000ff);
  lights[2].position.set(0, 0, 1);
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

  // Add rotation to both x and y axes for a more dynamic effect
  shape.rotation.x += 0.02;
  shape.rotation.y += 0.02;

  // Adjust the scale of the shape to create a pulsating effect
  shape.scale.x = Math.sin(Date.now() * 0.001) * 0.2 + 1;
  shape.scale.y = Math.sin(Date.now() * 0.001) * 0.2 + 1;
  shape.scale.z = Math.sin(Date.now() * 0.001) * 0.2 + 1;

  // Move the shape in a circular motion
  const radius = 5;
  const theta = Date.now() * 0.001;
  shape.position.x = radius * Math.cos(theta);
  shape.position.z = radius * Math.sin(theta);

  // Clear the renderer and render the scene
  renderer.clear();
  renderer.render(scene, camera);
}