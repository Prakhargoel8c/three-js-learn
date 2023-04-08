import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10,
  },
};

gui.add(world.plane, 'width', 3, 18).onChange(() => {
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
  const { array: positionArray } = plane.geometry.attributes.position;
  for (let i = 0; i < positionArray.length; i += 3) {
    const cordinate = new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]);
    positionArray[i + 2] += Math.random() * 0.5;
  }
  plane.geometry.attributes.position.needsUpdate = true;
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: true });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(plane);

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 2);
scene.add(light);

const { array: positionArray } = plane.geometry.attributes.position;

for (let i = 0; i < positionArray.length; i += 3) {
  const cordinate = new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]);
  positionArray[i + 2] += Math.random() * 0.5;
}
camera.position.z = 5;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
document.body.appendChild(renderer.domElement);
