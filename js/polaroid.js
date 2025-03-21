import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

const catsElement = document.getElementById('cats-text');
const homeScreen = document.getElementsByClassName('hero-section')[0]; // Get the Home Screen div

// Create a transparent scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fully transparent background

// Append renderer to homeScreen div
homeScreen.appendChild(renderer.domElement);

// Style the renderer to overlay properly
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.pointerEvents = 'none';

camera.position.z = 100;

const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ambient light to illuminate the objects
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light to simulate sunlight
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

catsElement.addEventListener('mouseover', () => {
    addPolaroid();
    console.log("Hovered over cats text");
});

catsElement.addEventListener('mouseleave', () => {
    removePolaroid();
    console.log("Mouse left cats text");
});

let polaroidFrame;

function addPolaroid() {
    const imagePath = '/photos/mari-candid.jpg';
    const img = new Image();
    img.onload = () => {
        const imageWidth = img.width / 25;
        const imageHeight = img.height / 25;

        const frameWidth = imageWidth + 3;
        const frameHeight = imageHeight + 3;
        const frameDepth = 5;

        // Frame
        const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
        const frameMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1, // Semi-transparent
                roughness: 0.9,
                metalness: 0.5,
                normalMap: new THREE.TextureLoader().load('/images/glass-texture.jpeg'),
        });

        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.renderOrder = 1;
        frame.material.depthTest = false;

        // Image
        const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
        const imageTexture = new THREE.TextureLoader().load(imagePath);
        const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
        const image = new THREE.Mesh(imageGeometry, imageMaterial);
        image.position.set(0, 0, frameDepth / 2 + 0.1);
        image.renderOrder = 2;
        image.material.depthTest = false;

        frame.add(image);
        scene.add(frame);

        polaroidFrame = frame;

        frame.position.y = -200;
        animatePolaroidUp(frame);
    };

    img.src = imagePath;
}

function animatePolaroidUp(frame) {
    let startTime = null;
    const duration = 500;
    const startPos = frame.position.y;
    const targetPos = 10;

    function animate(time) {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / duration;
        if (progress < 1) {
            frame.position.y = startPos + (targetPos - startPos) * progress;
            requestAnimationFrame(animate);
        } else {
            frame.position.y = targetPos;
        }
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

function removePolaroid() {
    if (polaroidFrame) {
        animatePolaroidDown(polaroidFrame);
    }
}

function animatePolaroidDown(frame) {
    let startTime = null;
    const duration = 500;
    const startPos = frame.position.y;
    const targetPos = -200;

    function animate(time) {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / duration;
        if (progress < 1) {
            frame.position.y = startPos + (targetPos - startPos) * progress;
            requestAnimationFrame(animate);
        } else {
            frame.position.y = targetPos;
            scene.remove(frame);
        }
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();