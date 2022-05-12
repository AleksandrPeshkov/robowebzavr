// import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as dat from 'dat.gui'

// FPS
// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

function main() {
  // Debug
  // const gui = new dat.GUI();
  // gui.close();

  // Custom logger
  class ClearingLogger {
    constructor(elem) {
      this.elem = elem;
      this.lines = [];
    }
    log(...args) {
      this.lines.push([...args].join(' '));
    }
    render() {
      this.elem.textContent = this.lines.join('\n');
      this.lines = [];
    }
  }

  const logger = new ClearingLogger(document.querySelector('#debug pre'));

  // Canvas
  const canvas = document.getElementById('app');

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a2d2ff');

  /**
   * Helpers
   */
  // Grid
  const gridHelper = new THREE.GridHelper(100, 100);
  scene.add(gridHelper);

  // Axis
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);


  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  })


  /**
   * Camera
   */
  
  const cameraParam = {
    fov: 45,
    near: 0.1,
    far: 50,
    position: [0, 10, 20],
    target: [0, 1, 0]
  };

  const camera = new THREE.PerspectiveCamera(cameraParam.fov, sizes.width / sizes.height, cameraParam.near, cameraParam.far)
  camera.position.set(...cameraParam.position)
  camera.lookAt(...cameraParam.target)

  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true


  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true


  /**
   * Light
   */

  // Spher light
  {
    const skyColor = 0xB1E1FF;
    const groundColor = 0xB97A20;
    const intensity = 0.1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  // Directional light
  {
    const color = 0xFFFFFF;
    const intensity = 0.4;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-5, 15, 4);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
    //  const helper = new THREE.DirectionalLightHelper(light)
    //  scene.add(helper)
  }
 

  /**
   * Object Loader
   */
  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('donut.gltf', (gltf) => {
      const donut = gltf.scene;
      const donutMatrial = new THREE.MeshPhongMaterial({color: 0xf1c0e8, emissive: 0xe4c1f9, specular: 0x000000});
      donut.traverse((o) => {
        if (o.isMesh) o.material = donutMatrial;
      });
      donut.position.set(4, 1, 0);
      donut.scale.set(20, 20, 20);

      scene.add(donut);
    });
  }


  /**
   * Dino
   */
  const dinoParam = {
    size: [1, 2, 1],
    position: [0, 1, 0],
    lightColor: 0xa7c957,
    darkColor: 0x6a994e,
    eyeSize: [0.1, 0.2, 0.1],
    leftEyePosition: [-0.125, 0.5, 0.5],
    rightEyePosition: [0.125, 0.5, 0.5]
  };

  const dino = new THREE.Object3D();
  scene.add(dino);

  // body
  const dinoBodyGeometry = new THREE.BoxGeometry(...dinoParam.size);
  const dinoBodyMaterial = new THREE.MeshPhongMaterial({color: dinoParam.lightColor, emissive: dinoParam.darkColor, specular: 0x000000});
  const dinoBody = new THREE.Mesh(dinoBodyGeometry, dinoBodyMaterial);

  dinoBody.castShadow = true;

  dino.add(dinoBody);

  // eyes
  const eyeGeometry = new THREE.BoxGeometry(...dinoParam.eyeSize);
  const eysMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xffffff, specular: 0x000000});
  const leftEye = new THREE.Mesh(eyeGeometry, eysMaterial);
  const rightEye = new THREE.Mesh(eyeGeometry, eysMaterial);

  leftEye.position.set(...dinoParam.leftEyePosition);
  rightEye.position.set(...dinoParam.rightEyePosition);

  dino.add(leftEye, rightEye);

  dino.position.set(...dinoParam.position);


  /**
   * Ground
   */
  const groundParam = {
    size: 100,
    lightColor: 0xf9dcc4,
    darkColor: 0xd4a373
  };

  const groundGeometry = new THREE.PlaneGeometry(groundParam.size, groundParam.size);
  const groundMaterial = new THREE.MeshLambertMaterial({color: groundParam.lightColor, emissive: groundParam.darkColor});
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)

  ground.receiveShadow = true;
  ground.rotation.x = Math.PI * -.5;

  scene.add(ground);


  /**
   * Animate
   */
  const clock = new THREE.Clock()

  const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // dino.rotation.y = .5 * elapsedTime

    // logger.log('rotation y:', dino.rotation.y.toFixed(3));

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Logger
    logger.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}

main();