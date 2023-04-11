import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const gui = new dat.GUI();
const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10,
  },
};

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: true });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

function generatePlane() {
  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
  const { array: positionArray } = plane.geometry.attributes.position;
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i + 2] += Math.random() * 0.5;
  }
}

const updatePlaneGeometry = () => {
  plane.geometry.dispose();
  generatePlane();
  plane.geometry.attributes.position.needsUpdate = true;
};
gui.add(world.plane, 'width', 3, 18).onChange(updatePlaneGeometry);
gui.add(world.plane, 'height', 3, 18).onChange(updatePlaneGeometry);
gui.add(world.plane, 'widthSegments', 3, 18).onChange(updatePlaneGeometry);
gui.add(world.plane, 'heightSegments', 3, 18).onChange(updatePlaneGeometry);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
new OrbitControls(camera, renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 2);
scene.add(light);

const backLight = new THREE.PointLight(0xffffff, 1, 1000);
backLight.position.set(0, 0, -2);
scene.add(backLight);

generatePlane();
scene.add(plane);

camera.position.z = 5;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
document.body.appendChild(renderer.domElement);
