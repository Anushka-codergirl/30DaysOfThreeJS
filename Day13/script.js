import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";

fetch(
  "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson"
)
  .then((res) => res.json())
  .then((countries) => {
    const Globe = new ThreeGlobe()
      .globeImageUrl(
        "https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg"
      )
      .polygonsData(
        countries.features.filter((d) => d.properties.ISO_A2 !== "AQ")
      )
      .polygonCapColor(() => "rgba(0, 100, 0, 0.7)")
      .polygonSideColor(() => "rgba(100, 000, 0, 0.1)")
      .polygonStrokeColor(() => "#111");

    setTimeout(() => Globe.polygonAltitude(() => Math.random()), 400);

    const CLOUDS_IMG_URL =
      "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/clouds/clouds.png";
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.1;

    const Clouds = new THREE.Mesh(
      new THREE.SphereGeometry(
        Globe.getGlobeRadius() * (1 + CLOUDS_ALT),
        75,
        75
      )
    );
    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      Clouds.material = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
      });
    });

    (function rotateClouds() {
      Clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      requestAnimationFrame(rotateClouds);
    })();

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(Clouds);
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 101;
    controls.rotateSpeed = 5;
    controls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    })();
  });
