var noise = new SimplexNoise();
var vizInit = function () {
  var file = document.getElementById("audioFile");
  var audio = document.getElementById("audioControls");
  var label = document.querySelector("label.file");

  document.onload = function (e) {
    console.log(e);
    audio.play();
    play();
  };

  file.onchange = function () {
    label.classList.add("normal");
    audio.classList.add("active");
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    play();
  };

  function play() {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var planeGeometry = new THREE.PlaneGeometry(500, 500, 40, 40);
    var planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xf0f,
      side: THREE.DoubleSide,
      wireframe: true,
    });

    var plane0 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane0.rotation.x = -0.5 * Math.PI;
    plane0.position.set(0, 30, 0);
    group.add(plane0);

    var plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane1.rotation.x = -0.5 * Math.PI;
    plane1.position.set(0, -30, 0);
    group.add(plane1);

    var sphereGeometry = new THREE.SphereGeometry(10, 300, 300);
    var lambertMaterial = new THREE.MeshNormalMaterial();

    var ball = new THREE.Mesh(sphereGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    var ambientLight = new THREE.AmbientLight(0xee82ee);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(group);

    document.getElementById("audioVisualizer").appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

      var lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
      var upperHalfArray = dataArray.slice(
        dataArray.length / 2 - 1,
        dataArray.length - 1
      );

      var lowerMax = max(lowerHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

      createGroud(plane0, modulate(upperAvgFr, 0, 1, 0.5, 4));
      createGroud(plane1, modulate(lowerMaxFr, 0, 1, 0.5, 4));

      createBlob(
        ball,
        modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
        modulate(upperAvgFr, 0, 1, 0, 4)
      );

      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function createBlob(mesh, bassFr, treFr) {
      mesh.geometry.vertices.forEach(function (vertex, i) {
        var offset = mesh.geometry.parameters.radius;
        var amp = 7;

        // Convert to polar coordinates
        var radius = offset + bassFr;
        var theta = Math.atan2(vertex.y, vertex.x);
        var phi = Math.acos(vertex.z / radius);

        // Apply Perlin noise to polar coordinates
        var noiseRadius = noise.noise3D(
          vertex.x * 0.1,
          vertex.y * 0.1,
          vertex.z * 0.1
        );
        var noiseTheta = noise.noise3D(
          vertex.x * 0.2,
          vertex.y * 0.2,
          vertex.z * 0.2
        );
        var noisePhi = noise.noise3D(
          vertex.x * 0.3,
          vertex.y * 0.3,
          vertex.z * 0.3
        );

        // Adjust the scale factor as needed
        radius += noiseRadius * amp * treFr;
        theta += noiseTheta * 0.1;
        phi += noisePhi * 0.1;

        // // Convert back to Cartesian coordinates
        vertex.x = radius * Math.sin(phi) * Math.cos(theta);
        vertex.y = radius * Math.sin(phi) * Math.sin(theta);
        vertex.z = radius * Math.cos(phi);
      });

      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }

    function createGroud(mesh, distortionFr) {
      mesh.geometry.vertices.forEach(function (vertex, i) {
        var amp = 2;
        var time = Date.now();
        var distance =
          (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) +
            0) *
          distortionFr *
          amp;
        vertex.z = distance;
      });

      // Change color based on time
      var timeInSeconds = Date.now() / 1000; // Convert milliseconds to seconds
      var hue = (timeInSeconds * 0.1) % 1; // Change color every 10 seconds

      // Set color for the entire mesh
      mesh.material.color.set(new THREE.Color().setHSL(hue, 1, 0.5));

      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }

    audio.play();
  }
};

window.onload = vizInit();

document.body.addEventListener("touchend", function (ev) {
  context.resume();
});

function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  });
}
