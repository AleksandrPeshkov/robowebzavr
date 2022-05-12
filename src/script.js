import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// FPS
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

// Debug
const gui = new dat.GUI()
gui.close()

class ClearingLogger {
  constructor(elem) {
    this.elem = elem
    this.lines = []
  }
  log(...args) {
    this.lines.push([...args].join(' '))
  }
  render() {
    this.elem.textContent = this.lines.join('\n')
    this.lines = []
  }
}

const logger = new ClearingLogger(document.querySelector('#debug pre'))

// Canvas
const canvas = document.getElementById('app')

// Scene
const scene = new THREE.Scene()

/**
 * Helpers
 */
// Grid
const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// Axis
const axesHelper = new THREE.AxesHelper(100);
// axesHelper.material.depthTest = false;
// axesHelper.renderOrder = 1;
scene.add(axesHelper);


// Dino
const dinoParam = {
  size: [1, 2, 1],
  position: [0, 1, 0],
  lightColor: 0xa7c957,
  darkColor: 0x6a994e,
  eyeSize: [0.1, 0.2, 0.1],
  leftEyePosition: [-0.125, 0.5, 0.5],
  rightEyePosition: [0.125, 0.5, 0.5]
}

const dino = new THREE.Object3D();
scene.add(dino)

// body
const dinoBodyGeometry = new THREE.BoxGeometry(...dinoParam.size)
const dinoBodyMaterial = new THREE.MeshPhongMaterial({color: dinoParam.lightColor, emissive: dinoParam.darkColor, specular: 0x000000})
const dinoBody = new THREE.Mesh(dinoBodyGeometry, dinoBodyMaterial)

dinoBody.castShadow = true

dino.add(dinoBody)

// eyes
const eyeGeometry = new THREE.BoxGeometry(...dinoParam.eyeSize)
const eysMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xffffff, specular: 0x000000})
const leftEye = new THREE.Mesh(eyeGeometry, eysMaterial)
const rightEye = new THREE.Mesh(eyeGeometry, eysMaterial)

leftEye.position.set(...dinoParam.leftEyePosition)
rightEye.position.set(...dinoParam.rightEyePosition)

dino.add(leftEye, rightEye)

dino.position.set(...dinoParam.position)


// Ground
const groundParam = {
  size: 100,
  lightColor: 0xfaedcd,
  darkColor: 0xffeedd
}

const groundGeometry = new THREE.PlaneGeometry(groundParam.size, groundParam.size)
const groundMaterial = new THREE.MeshPhongMaterial({color: groundParam.lightColor, emissive: groundParam.darkColor, specular: 0x000000})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)

ground.receiveShadow = true
ground.rotation.x = Math.PI * -.5

scene.add(ground)


/**
 * Light
 */
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity)

light.castShadow = true
light.position.set(3, 8, 2)
light.target.position.set(-5, 0, 0)
scene.add(light)
scene.add(light.target)

const helper = new THREE.DirectionalLightHelper(light)
scene.add(helper)

// Light GUI
function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name)
  folder.add(vector3, 'x', -100, 100).onChange(onChangeFn)
  folder.add(vector3, 'y', 0, 100).onChange(onChangeFn)
  folder.add(vector3, 'z', -100, 100).onChange(onChangeFn)
  folder.open()
}

function updateLight() {
  light.target.updateMatrixWorld()
  helper.update()
}
updateLight();

const colorGUIHelper = {
  color: 0xffffff
}

gui.addColor(colorGUIHelper, 'color').onChange(() => {
  light.color.set(colorGUIHelper.color)
})
gui.add(light, 'intensity', 0, 2, 0.01)
makeXYZGUI(gui, light.position, 'position', updateLight)
makeXYZGUI(gui, light.target.position, 'target', updateLight)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameraOptions = {
  fov: 45,
  near: 0.1,
  far: 50,
  position: [0, 10, 20],
  look: [0, 1, 0]
}

const camera = new THREE.PerspectiveCamera(cameraOptions.fov, sizes.width / sizes.height, cameraOptions.near, cameraOptions.far)
camera.position.set(...cameraOptions.position)
camera.lookAt(...cameraOptions.look)

scene.add(camera)

// Camera shadow helper
// const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(cameraHelper);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas: canvas})

renderer.shadowMap.enabled = true
renderer.setClearColor(0xa2d2ff)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  dino.rotation.y = .5 * elapsedTime

  logger.log('rotation y:', dino.rotation.y.toFixed(3));

  // Update Orbital Controls
  controls.update()

  // Render
  renderer.render(scene, camera)
  logger.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()