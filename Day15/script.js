import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

// Gen random paths
const N_PATHS = 50;
const MAX_POINTS_PER_LINE = 10000;
const MAX_STEP_DEG = 1;
const MAX_STEP_ALT = 0.01;
const paths = [...Array(N_PATHS).keys()].map(() => {
  let lat = (Math.random() - 0.5) * 90;
  let lng = (Math.random() - 0.5) * 360;
  let alt = 0;

  return [...Array(MAX_POINTS_PER_LINE).keys()].map(() => {
    lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
    lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
    alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
    alt = Math.max(0, alt);

    return [lat, lng, alt];
  });
});

const lines = paths.map((path) => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  });
  const lineObject = new THREE.Line(geometry, material);
  return { geometry, material, lineObject, path, numPoints: 0 };
});

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("globe-vectorLines").appendChild(renderer.domElement);

// Setup scene
const scene = new THREE.Scene();
lines.forEach((line) => {
  scene.add(line.lineObject);
});
scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 500;

// Add camera controls
const tbControls = new OrbitControls(camera, renderer.domElement);
tbControls.minDistance = 101;
tbControls.rotateSpeed = 5;
tbControls.zoomSpeed = 0.8;

// Kick-off renderer
(function animate() {
  tbControls.update();

  lines.forEach((line) => {
    line.material.color.offsetHSL(0.001, 0, 0); // Animate color
    if (line.numPoints < line.path.length) {
      line.geometry.setFromPoints(
        line.path.slice(0, line.numPoints + 1).map((coords) => {
          const [lat, lng, alt] = coords;
          const radius = 200 + alt * 50;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);

          return new THREE.Vector3(x, y, z);
        })
      );

      line.numPoints += 1;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
