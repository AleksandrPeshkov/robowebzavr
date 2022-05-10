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


// Objects
const dino = new THREE.BoxGeometry(1, 1, 1)
const plane = new THREE.PlaneGeometry(100, 100)


// Materials
const dinoMaterial = new THREE.MeshPhongMaterial({
  color: 0x96d35f
})

const groundMaterial = new THREE.MeshPhongMaterial({
  color: 0xfeaf1c
})


// Mesh
const robozavr = new THREE.Mesh(dino, dinoMaterial)
robozavr.position.set(0, 0.5, 0)

const ground = new THREE.Mesh(plane, groundMaterial)
ground.rotateX(-1.5708)

scene.add(robozavr)
scene.add(ground)


// Lights
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(0,4,2)
scene.add(pointLight)

const lightFolder = gui.addFolder('pointLight')

lightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.5)
lightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.5)
lightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.5)
lightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.5)

const pointLightColor = {
    color: 0xffffff
}

lightFolder.addColor(pointLightColor, 'color')
  .onChange(() => {
    pointLight.color.set(pointLightColor.color)
  })

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
scene.add( axesHelper );


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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 50)
camera.position.set(0, 2, 5)

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

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  robozavr.rotation.y = .5 * elapsedTime

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()