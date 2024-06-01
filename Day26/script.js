import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

// Get window size

var scene = new THREE.Scene();
// Create a Three.js Camera and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 500;

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: document.querySelector("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

var points = [
  [160, 50],
  [93, 80],
];

// Convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
  var x = points[i][0];
  var y = 0;
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}
var path = new THREE.CatmullRomCurve3(points);
var geometry = new THREE.TubeGeometry(path, 10, 20, 40, true);
var colors = [0xff0000, 0x00ff00, 0x0000ff];
for (var i = 0; i < colors.length; i++) {
  var geometry = new THREE.TubeGeometry(path, 100, i * 4 + 1, 20, true);
  var material = new THREE.MeshBasicMaterial({
    color: colors[i],
    wireframe: true,
  });
  var tube = new THREE.Mesh(geometry, material);
  scene.add(tube);
}

// Add ambient light for scene illumination
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create a mesh
var tube = new THREE.Mesh(geometry, material);
scene.add(tube);

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

var percentage = 0;
function render() {
  percentage += 0.001;
  var p1 = path.getPointAt(percentage % 10);
  var p2 = path.getPointAt((percentage + 0.01) % 1);
  camera.position.set(p1.x, p1.y, p1.z);
  camera.lookAt(p2);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
