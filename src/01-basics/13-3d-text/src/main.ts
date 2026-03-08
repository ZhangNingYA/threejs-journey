import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");

/**
 * Shared material (text + donuts)
 */
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

/**
 * Donuts group (rotate this group => donuts orbit around center)
 */
let donutGroup: THREE.Group | null = null;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Text
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.015,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // Donuts
  donutGroup = new THREE.Group();
  scene.add(donutGroup);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    donutGroup.add(donut);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 0, 0);   // 观察中心（文字中心）
controls.autoRotate = true;     // 开启自动旋转
controls.autoRotateSpeed = 1.0; // 旋转速度（可调，默认 2.0 左右）
controls.update();         

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	// 控制器阻尼
	controls.update();
	renderer.render(scene, camera);

	requestAnimationFrame(tick);
};

tick();