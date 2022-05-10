import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// FPS
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const dino = new THREE.SphereGeometry(1, 10, 10)
const plane = new THREE.PlaneGeometry(20, 20)

// Materials
const material1 = new THREE.MeshStandardMaterial({
  color: 0x228b22
})

const material2 = new THREE.MeshStandardMaterial({
  color: 0xfeaf1c
})

// Mesh
const robozavr = new THREE.Mesh(dino,material1)
robozavr.position.set(0,1,0)

const ground = new THREE.Mesh(plane,material2)
ground.rotateX(-1.5708)

scene.add(robozavr)
scene.add(ground)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(2,4,2)
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

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 5
camera.position.z = 5

scene.add(camera)

// const cameraHelper = new THREE.CameraHelper( camera );
// scene.add( cameraHelper );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    robozavr.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()