import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// FPS
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.getElementById('app')

// Scene
const scene = new THREE.Scene()


// Dino
const dinoParam = {
  size: [1, 2, 1],
  position: [0, 1, 0],
  color: 0x96d35f,
  eyeSize: [0.1, 0.2, 0.1],
  leftEyePosition: [-0.125, 0.5, 0.5],
  rightEyePosition: [0.125, 0.5, 0.5]
}

const dino = new THREE.Object3D();
scene.add(dino)

// body
const dinoBodyGeometry = new THREE.BoxGeometry(...dinoParam.size)
const dinoBodyMaterial = new THREE.MeshPhongMaterial({color: dinoParam.color})
const dinoBody = new THREE.Mesh(dinoBodyGeometry, dinoBodyMaterial)

dino.add(dinoBody)

// eyes
const eyeGeometry = new THREE.BoxGeometry(...dinoParam.eyeSize)
const eysMaterial = new THREE.MeshPhongMaterial({color: 0xffffff})
const leftEye = new THREE.Mesh(eyeGeometry, eysMaterial)
const rightEye = new THREE.Mesh(eyeGeometry, eysMaterial)

leftEye.position.set(...dinoParam.leftEyePosition)
rightEye.position.set(...dinoParam.rightEyePosition)

dino.add(leftEye, rightEye)

dino.position.set(...dinoParam.position)


// Ground
const groundParam = {
  size: 100,
  color: 0xfeaf1c
}

const groundGeometry = new THREE.PlaneGeometry(groundParam.size, groundParam.size)
const groundMaterial = new THREE.MeshPhongMaterial({color: groundParam.color})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)

ground.rotation.x = Math.PI * -.5

scene.add(ground)


/**
 * Light
 */

// Point Light
// const pointLight = new THREE.PointLight(0xffffff, 1)
// pointLight.position.set(0,4,2)
// scene.add(pointLight)

// const lightFolder = gui.addFolder('pointLight')

// lightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.5)
// lightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.5)
// lightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.5)
// lightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.5)

// const pointLightColor = {
//   color: 0xffffff
// }

// lightFolder.addColor(pointLightColor, 'color')
//   .onChange(() => {
//     pointLight.color.set(pointLightColor.color)
//   })

// Ambient Light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

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

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setClearColor(0x87ceeb)
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

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()