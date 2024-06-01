import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

const nearDistance = 0.1;
const farDistance = 10000;

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a Three.js Camera and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  nearDistance,
  farDistance
);

camera.position.x = farDistance * -2;
camera.position.z = 500;

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("canvas").appendChild(renderer.domElement);

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const cubeSize = 120;
const geometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshNormalMaterial();

const group = new THREE.Group();
for (let i = 0; i < 200; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  const distance = farDistance / 3;
  const doubleDistance = distance * 2;
  const tau = 2 * Math.PI;

  mesh.position.x = Math.random() * doubleDistance - distance;
  mesh.position.y = Math.random() * doubleDistance - distance;
  mesh.position.z = Math.random() * doubleDistance - distance;

  mesh.rotation.x = Math.random() * tau;
  mesh.rotation.y = Math.random() * tau;
  mesh.rotation.z = Math.random() * tau;

  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  group.add(mesh);
}

scene.add(group);

// Add spheres to the scene
const sphereRadius = 60;
const sphereSegments = 32;
const sphereGeometry = new THREE.SphereGeometry(
  sphereRadius,
  sphereSegments,
  sphereSegments
);
const sphereMaterial = new THREE.MeshNormalMaterial();

for (let i = 0; i < 200; i++) {
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const distance = farDistance / 3;
  const doubleDistance = distance * 2;

  sphereMesh.position.x = Math.random() * doubleDistance - distance;
  sphereMesh.position.y = Math.random() * doubleDistance - distance;
  sphereMesh.position.z = Math.random() * doubleDistance - distance;

  sphereMesh.rotation.x = Math.random() * Math.PI;
  sphereMesh.rotation.y = Math.random() * Math.PI;
  sphereMesh.rotation.z = Math.random() * Math.PI;

  sphereMesh.matrixAutoUpdate = false;
  sphereMesh.updateMatrix();
  group.add(sphereMesh);
}

// Add triangles to the scene
const triangleGeometry = new THREE.ConeGeometry(50, 100, 32);
const triangleMaterial = new THREE.MeshNormalMaterial();

for (let i = 0; i < 200; i++) {
  const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
  const distance = farDistance / 3;
  const doubleDistance = distance * 2;

  triangleMesh.position.x = Math.random() * doubleDistance - distance;
  triangleMesh.position.y = Math.random() * doubleDistance - distance;
  triangleMesh.position.z = Math.random() * doubleDistance - distance;

  triangleMesh.rotation.x = Math.random() * Math.PI;
  triangleMesh.rotation.y = Math.random() * Math.PI;
  triangleMesh.rotation.z = Math.random() * Math.PI;

  triangleMesh.matrixAutoUpdate = false;
  triangleMesh.updateMatrix();
  group.add(triangleMesh);
}

const loader = new THREE.FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = (font) => {
  const word = "Hello World";
  const typoProperties = {
    font: font,
    size: cubeSize,
    height: cubeSize / 2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: true,
    bevelSize: 6,
    bevelOffset: 1,
    bevelSegments: 8,
  };

  const text = new THREE.TextGeometry(word, typoProperties);
  textMesh.geometry = text;
  textMesh.material = material;
  textMesh.position.x = cubeSize * -2;
  textMesh.position.z = cubeSize * -1;
  scene.add(textMesh);
};

loader.load(
  "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
  createTypo
);

// Keep track of the mouse position, so we can make the eye move
let mouseX = 0;
let mouseY = 0;

const mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: function (coordX, coordY) {
    mouseX = (coordX - mouseFX.windowHalfX) * 10;
    mouseY = (coordY - mouseFX.windowHalfY) * 10;
  },
  onMouseMove: function (e) {
    mouseFX.coordinates(e.clientX, e.clientY);
  },
  onTouchMove: function (e) {
    mouseFX.coordunates(
      e.changedTouches[0].clientX,
      e.changedTouces[0].clientY
    );
  },
};

document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

// Render the scene
const render = () => {
  requestAnimationFrame(render);

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  const t = Date.now() * 0.001;
  const rx = Math.sin(t * 0.7) * 0.5;
  const ry = Math.sin(t * 0.7) * 0.5;
  const rz = Math.sin(t * 0.7) * 0.5;

  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;

  textMesh.rotation.x = rx;
  textMesh.rotation.y = ry;
  textMesh.rotation.z = rz;

  renderer.render(scene, camera);
};

render();
