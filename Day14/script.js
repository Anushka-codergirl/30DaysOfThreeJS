import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";

// Gen random data
const N = 50;
const scene = new THREE.Scene();

const arcsData = [...Array(N).keys()].map(() => ({
  startLat: (Math.random() - 0.5) * 180,
  startLng: (Math.random() - 0.5) * 360,
  endLat: (Math.random() - 0.5) * 180,
  endLng: (Math.random() - 0.5) * 360,
  color: ["#6e40c9", "#d2a8ff", "#1158c7", "#c9d1d9", "#1f6feb", "#79c0ff"],
}));

const Globe0 = new ThreeGlobe()
  .arcsData(arcsData)
  .arcColor("color")
  .arcDashLength(1)
  .arcDashGap(5)
  .arcDashInitialGap(() => Math.random() * 5)
  .arcDashAnimateTime(1000);

scene.add(Globe0);

fetch(
  "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson"
)
  .then((res) => res.json())
  .then((countries) => {
    const Globe = new ThreeGlobe()
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.1)
      .hexPolygonUseDots(true)
      .hexPolygonColor(() => "#6e40c9");

    const globeMaterial = Globe.globeMaterial();
    globeMaterial.bumpScale = 25;
    globeMaterial.specular = new THREE.Color("#1f6feb");
    globeMaterial.shininess = 25;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globe").appendChild(renderer.domElement);

    //Setup scene
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    //Add camera controls
    const obControls = new OrbitControls(camera, renderer.domElement);
    obControls.minDistance = 101;
    obControls.rotateSpeed = 5;
    obControls.zoomSpeed = 0.8;
    obControls.enableRotate = true;

    //Kick-off renderer
    (function animate() {
      requestAnimationFrame(animate);
      obControls.update();
      renderer.render(scene, camera);
      scene.rotation.x += 0.01;
    })();
  });
