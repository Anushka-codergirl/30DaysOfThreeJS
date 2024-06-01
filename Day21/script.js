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

// Create cubes and position them in a circle
const circleRadius = 4;
const numCubes = 200;
const cubeSize = 1;

const cubes = [];

for (let i = 0; i < numCubes; i++) {
  const angle = (i / numCubes) * Math.PI * 2;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      specular: 0xffffff,
    })
  );

  const x = circleRadius * Math.cos(angle);
  const y = circleRadius * Math.sin(angle);

  cube.position.x = x;
  cube.position.y = y;

  scene.add(cube);
  cubes.push(cube);
}

const originalPositions = cubes.map((cube) => cube.position.clone());
// Set up animation to spread out cubes
const spreadCubes = () => {
  cubes.forEach((cube, index) => {
    const targetX = (Math.random() - 0.5) * 200; // Random x position
    const targetY = (Math.random() - 0.5) * 200; // Random y position

    new TWEEN.Tween(cube.position)
      .to({ x: targetX, y: targetY, z: -10 }, 3000) // Move cubes to random positions
      .easing(TWEEN.Easing.Back.Out)
      .start();
  });
};

// Set up animation to come back together in a circle
const formCircle = () => {
  cubes.forEach((cube, index) => {
    const originalPosition = originalPositions[index];

    new TWEEN.Tween(cube.position)
      .to(
        { x: originalPosition.x, y: originalPosition.y, z: originalPosition.z },
        3000
      )
      .easing(TWEEN.Easing.Back.Out)
      .start();
  });
};

// Set up overall animation sequence
const animate = () => {
  requestAnimationFrame(animate);

  TWEEN.update();

  // Rotate cubes
  cubes.forEach((cube) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
};

// Initial call to start the animation
animate();

// Initial call to spread out cubes
spreadCubes();

// Wait for spreading animation to complete, then form circle
setTimeout(() => {
  formCircle();
}, 3000); // Adjust the delay as needed
