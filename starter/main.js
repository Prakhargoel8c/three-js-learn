import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';
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
const planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: true, vertexColors: true });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

function generatePlane() {
  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
  const { array: positionArray } = plane.geometry.attributes.position;
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i + 2] += Math.random() * 0.5;
  }
  const colors = [];
  for (let i = 0; i < plane.geometry.attributes.position.count; i++) colors.push(0, 0.19, 0.4);
  plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
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
const rayCaster = new THREE.Raycaster();

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
const mousePosition = { x: undefined, y: undefined };

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObject(plane);
  if (intersects.length) {
    const { color } = intersects[0].object.geometry.attributes;
    ['a', 'b', 'c'].forEach((index) => {
      color.setX(intersects[0].face[index], 0.1);
      color.setY(intersects[0].face[index], 0.5);
      color.setZ(intersects[0].face[index], 1);
    });
    color.needsUpdate = true;
    const intialColor = { r: 0, g: 0.19, b: 0.4 };
    const hoverColor = { r: 0.1, g: 0.5, b: 1 };
    gsap.to(hoverColor, {
      r: intialColor.r,
      g: intialColor.g,
      b: intialColor.b,
      onUpdate: () => {
        ['a', 'b', 'c'].forEach((index) => {
          color.setX(intersects[0].face[index], hoverColor.r);
          color.setY(intersects[0].face[index], hoverColor.g);
          color.setZ(intersects[0].face[index], hoverColor.b);
        });
        color.needsUpdate = true;
      },
    });
  }
}
animate();
document.body.appendChild(renderer.domElement);
document.addEventListener('mousemove', (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
