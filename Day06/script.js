import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
var renderer,
  scene,
  camera,
  snowflakes = [];

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

  // Create snowflake geometry
  var snowflakeGeometry = new THREE.CircleGeometry(1, 32);

  // Create snowflake material
  var snowflakeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  // Create a number of snowflakes and add them to the scene
  for (var i = 0; i < 1000; i++) {
    var snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);

    // Set random initial position and scale for each snowflake
    snowflake.position.set(
      Math.random() * window.innerWidth - window.innerWidth / 2,
      Math.random() * window.innerHeight - window.innerHeight / 2,
      Math.random() * 200
    );
    var scale = Math.random() * 2;
    snowflake.scale.set(scale, scale, 1);

    scene.add(snowflake);
    snowflakes.push(snowflake);
  }

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Move each snowflake down the screen
  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].position.y -= 2;

    // If a snowflake goes below the screen, reset its position to the top
    if (snowflakes[i].position.y < -window.innerHeight / 2) {
      snowflakes[i].position.y = window.innerHeight / 2;
    }
  }

  renderer.render(scene, camera);
}
