import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

var renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

var sphereGeometry = new THREE.SphereGeometry(1, 300, 300);
var material = new THREE.MeshNormalMaterial();

var blob = new THREE.Mesh(sphereGeometry, material);
scene.add(blob);

var update = function () {
  var time = performance.now() * 0.0015;
  var k = 5;
  for (var i = 0; i < blob.geometry.vertices.length; i++) {
    var p = blob.geometry.vertices[i];
    p.normalize().multiplyScalar(
      2 + 0.5 * noise.perlin3(p.x * k + time, p.y * k, p.z + k)
    );
  }
  blob.geometry.computeVertexNormals();
  blob.geometry.normalsNeedUpdate = true;
};

function animate() {
  update();
  blob.rotation.x += 0.01;
  blob.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
