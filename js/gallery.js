import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
);
camera.position.z = -400;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xF0F0F0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;
controls.minDistance = -300;
controls.maxDistance = 900;

const textureLoader = new THREE.TextureLoader();
const images = [
  '/photos/tahoe-mountain.jpg',
  '/photos/ming.jpg',
  '/photos/tahoe-lake.jpg',
  '/photos/mari-candid.jpg',
  '/photos/mari-flower.jpg',
  '/photos/mari-tail-up.jpg',
  '/photos/yoga-arms-up.jpg',
  '/photos/yoga-backbend.png',
  '/photos/yoga-bridge.png',
  '/photos/yoga-splits.jpg',
  '/photos/dodge-ridge-clear-lake.jpg',
  '/photos/dodge-ridge-diner.jpg',
  '/photos/dodge-ridge-lake-kids.jpg',
  '/photos/dodge-ridge-lake.jpg',
  '/photos/lovey-flowers-down.jpg',
  '/photos/lovey-flowers.jpg',
  '/photos/lovey-main.jpg',
  '/photos/lovey-running.jpg',
  '/photos/lovey-sitting.jpg',
];
console.log(images)
const imageMeshes = [];

const spacing = 100;
const zSpacing = 150;

let lastXPosition = -Infinity;
let lastYPosition = -Infinity;
let lastZPosition = -Infinity;

images.forEach((image, index) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
        const imageWidth = img.width;
        const imageHeight = img.height;

        const texture = textureLoader.load(image);
        
        const geometry = new THREE.PlaneGeometry(imageWidth / 6, imageHeight / 6);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        
        let scatterX;
        do {
            scatterX = (Math.random() - 0.5) * 2000;
        } while (Math.abs(scatterX - lastXPosition) < spacing);

        lastXPosition = scatterX;

        let scatterY;
        do {
            scatterY = (Math.random() - 0.5) * 700;
        } while (Math.abs(scatterY - lastYPosition) < spacing);

        lastYPosition = scatterY;

        let scatterZ;
        do {
            scatterZ = (Math.random() - 0.5) * 1000;
        } while (Math.abs(scatterZ - lastZPosition) < zSpacing);

        lastZPosition = scatterZ;

        mesh.position.set(scatterX, scatterY, scatterZ);
        scene.add(mesh);
        imageMeshes.push(mesh);
    };
});

let progress = 0;
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

let moveSpeed = 10;
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.y += moveSpeed;
            break;
        case 'ArrowDown':
            camera.position.y -= moveSpeed;
            break;
        case 'ArrowLeft':
            camera.position.x -= moveSpeed;
            break;
        case 'ArrowRight':
            camera.position.x += moveSpeed;
            break;
        case 'w':
            camera.position.z -= moveSpeed;
            break;
        case 's':
            camera.position.z += moveSpeed;
            break;
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
