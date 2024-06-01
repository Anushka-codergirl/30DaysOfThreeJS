import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
var renderer, scene, camera, circle, particle;

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

  circle = new THREE.Object3D();
  particle = new THREE.Object3D();

  scene.add(circle);
  scene.add(particle);

  var geometry0 = new THREE.TetrahedronGeometry(2, 5);
  var geometry1 = new THREE.IcosahedronGeometry(8, 5);

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  for (var i = 0; i < 300; i++) {
    var mesh = new THREE.Mesh(geometry0, material);
    mesh.position
      .set(Math.random() - 0.4, Math.random() - 0.4, Math.random() - 0.4)
      .normalize();
    mesh.position.multiplyScalar(60 + Math.random() * 400);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  var coreMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
  });

  var planetCore = new THREE.Points(geometry1, coreMaterial);
  planetCore.scale.x = planetCore.scale.y = planetCore.scale.z = 10;
  circle.add(planetCore);

  var surfaceMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 100,
    wireframe: true,
  });

  var planetSurface = new THREE.Mesh(geometry1, surfaceMaterial);
  planetSurface.scale.x = planetSurface.scale.y = planetSurface.scale.z = 10;
  circle.add(planetSurface);

  var ambientLight = new THREE.DirectionalLight(0x666699);
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

  particle.rotation.x += 0.015;
  particle.rotation.y += 0.03;
  circle.rotation.x -= 0.015;
  circle.rotation.y -= 0.03;
  renderer.clear();

  renderer.render(scene, camera);
}
