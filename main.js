import "./style.css";
import * as THREE from "three";

// Setup the objects to display your 3D object
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

/* Create the Object*/
// Geometry - set of vectors that define the object itself
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// Material - the wrapping paper for an object
const material = new THREE.MeshStandardMaterial({
  color: 0xb1ddf1,
});
// Combination of the geometry and the material
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

/* Add lighting to the object*/
// Pointlight - emits light in all directions
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
// Ambientlight - Light up everything in the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Generates stars throughout the scene
const addStar = () => {
  // Basic wireframe for a star object
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Randomly generate x, y, and z coordinates for each star
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
};

// Create 300 randomly positioned stars
Array(300).fill().forEach(addStar);

/* Create the background for the scene*/
const spaceTexture = new THREE.TextureLoader().load("/images/space.jpg");
scene.background = spaceTexture;

/* Create your avatar mesh here */
const opiyoTexture = new THREE.TextureLoader().load("/images/opiyo.JPG");
const opiyo = new THREE.Mesh(
  // takes the image and maps it onto a cube
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: opiyoTexture })
);
scene.add(opiyo);

/* Create the moon object */
const moonTexture = new THREE.TextureLoader().load("/images/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("/images/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

// Set the position of the moon and the avatar objects
moon.position.setZ(30);
moon.position.setX(-10);

opiyo.position.setZ(-5);
opiyo.position.setX(2);

// Scroll Animation
const moveCamera = () => {
  // Calculate where the user is currently scrolled to
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  opiyo.rotation.y += 0.01;
  opiyo.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
};
// Fire the function whenever the user scrolls
document.body.onscroll = moveCamera;
moveCamera();

// Recursive function that renders the scene every time the UI changes
const animate = () => {
  // tells the browser that you want to perform an animation
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  renderer.render(scene, camera);
};

animate();
