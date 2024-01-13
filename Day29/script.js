import * as THREE from "https://esm.sh/three";

console.clear();

function init() {

    const canvas = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({ canvas });

    const scene = new THREE.Scene();


    const cameraNum = 10;
    const camera = new THREE.OrthographicCamera(
        window.innerWidth / -cameraNum,
        window.innerWidth / cameraNum,
        window.innerHeight / cameraNum,
        window.innerHeight / -cameraNum,
        1,
        1000
    );

    camera.position.x = 500;
    camera.position.y = 500;
    camera.position.z = 500;
    camera.lookAt(scene.position);

    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = 0.7 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.visible = false;

    scene.add(plane);

    let cubeArray = [];
    const rows = 70;
    const cols = 70;
    const planeSize = planeGeometry.parameters.height;
    const cubeSize = planeSize / cols;

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xABCDEF
            })

            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.z = j * cubeSize - ((planeSize - cubeSize) / 2) + j + 5;
            cube.position.x = i * cubeSize - ((planeSize - cubeSize) / 2) + i + 5;
            cube.position.y = 5;

            cubeArray.push(cube);
            scene.add(cube);
        }
    }
    const tl = gsap.timeline();
    const position = cubeArray.map((a) => a.position);
    tl.to(position, {
        duration: 1,
        y: 50,
        stagger: {
            amount: 5,
            grid: [rows, cols],
            repeat: -2,
            yoyo: true,
            ease: Sine.easeIn,
        }
    });

    {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 50, 100);
        scene.add(directionalLight);
    }

    {
        const ambientLight = new THREE.AmbientLight(0xefefef, 0.5);
        scene.add(ambientLight);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

init();