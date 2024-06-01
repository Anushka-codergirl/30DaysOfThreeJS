// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Set up camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add point lights for better visibility
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

// Create cubes and position them in a triangle
const triangleSize = 15;
const cubeSize = 1;

const cubes = [];

for (let i = 0; i < triangleSize; i++) {
  for (let j = 0; j <= i; j++) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
      })
    );

    // center cubes like triangle
    cube.position.x = j * (cubeSize + 0.1) - (i * (cubeSize + 0.1)) / 2;
    cube.position.y = (i * (cubeSize + 0.1)) / 2;

    scene.add(cube);

    cubes.push(cube);
  }
}

// Set up animation
const animate = function () {
  requestAnimationFrame(animate);

  TWEEN.update();

  //Rotate and move cubes
  cubes.forEach((cube, index) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });
  // Render the scene
  renderer.render(scene, camera);
};

animate();

const dropCubes = () => {
  // Store initial cube positions for restoration
  const initialPositions = cubes.map((cube) => cube.position.clone());

  // Dropping animation
  cubes.forEach((cube, index) => {
    cube.material.color.setHex(0xff00ff);
    cube.material.specular.setHex(0xff0f00);
    cube.material.shininess = 100;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    const targetY = -index * (cubeSize + 0.1);
    new TWEEN.Tween(cube.position)
      .to({ y: targetY }, 3000)
      .easing(TWEEN.Easing.Back.Out)
      .start();
  });

  // Wait for dropping animation to complete, then restore cubes
  setTimeout(() => {
    cubes.forEach((cube, index) => {
      const initialPosition = initialPositions[index];
      new TWEEN.Tween(cube.position)
        .to({ y: initialPosition.y }, 3000)
        .easing(TWEEN.Easing.Back.Out)
        .start();
    });

    // Reset cube rotation and other properties
    cubes.forEach((cube) => {
      cube.rotation.set(0, 0, 0);
      cube.material.color.setHex(0xf0b0ff);
      cube.material.specular.setHex(0xffffff);
      cube.material.shininess = 100;
    });

    // Render the scene after restoration
    renderer.render(scene, camera);
  }, 3000);
};

// Initial call to start the animation
dropCubes();
