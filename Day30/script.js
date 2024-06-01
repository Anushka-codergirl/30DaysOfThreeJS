import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

var container;
var camera, scene, renderer, controls;
var shapes = [];

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 800);

  controls = new OrbitControls(camera, container);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

  scene.add(camera);

  var light = new THREE.DirectionalLight(0x9955ff, 2);
  light.position.x = -500;
  light.position.y = 500;
  camera.add(light);

  var light2 = new THREE.DirectionalLight(0x9955ff, 1);
  light2.position.x = 500;
  light2.position.y = -500;
  light2.position.z = -150;
  camera.add(light2);

  scene.background = new THREE.Color("#000000");

  var heartShape = new THREE.Shape();
  heartShape.moveTo(25, 25);
  heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
  heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
  heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
  heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

  var extrudeSettings = {
    amount: 1,
    bevelEnabled: true,
    bevelSegments: 20,
    steps: 2,
    bevelSize: 20,
    bevelThickness: 10,
  };

  for (var i = -window.innerWidth / 2; i < window.innerWidth / 2; i += 60) {
    for (var j = -window.innerHeight / 2; j < window.innerHeight / 2; j += 60) {
      addShape(heartShape, extrudeSettings, "#ff0022", i, j, 0, 0, 0, 0, 0.3);
    }
  }

  loadFont(); // Load font and create text

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  render();
}

function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ color: color })
  );
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  shapes.push({
    shape: mesh,
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
  });
  scene.add(mesh);
}

function loadFont() {
  const fontLoader = new THREE.FontLoader();
  fontLoader.load(
    "https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json",
    function (font) {
      createText(font);
    }
  );
}

function createText(font) {
  const textGeometry = new THREE.TextGeometry("Thank You!", {
    font: font,
    size: 50,
    height: 10,
    curveSegments: 50,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 1,
    bevelSegments: 5,
  });

  const textMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Center the text in the screen
  const textBoundingBox = new THREE.Box3().setFromObject(textMesh);
  const textWidth = textBoundingBox.max.x - textBoundingBox.min.x;
  textMesh.position.set(-textWidth / 2, 0, 0);

  scene.add(textMesh);
}

function animate() {
  var speed = 0.015;
  shapes.forEach((el) => {
    el.shape.rotation.x += el.x * speed;
    el.shape.rotation.y += el.y * speed;
    el.shape.rotation.z += el.z * speed;
  });
  controls.update();
}

function render() {
  requestAnimationFrame(render);
  animate();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
