import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { cameraAt } from "./camera-path";
import { assetPath } from "./site";

export async function createAircraftScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 800);
  const light = new THREE.DirectionalLight("#e3f8ff", 4);
  light.position.set(-30, 50, 20);
  scene.add(light, new THREE.HemisphereLight("#bee4ee", "#142b36", 2));
  const rim = new THREE.DirectionalLight("#8fcad9", 3);
  rim.position.set(10, 12, -40);
  scene.add(rim);
  const material = new THREE.MeshStandardMaterial({ color: "#95b4bc", metalness: .5, roughness: .37 });
  const wireMaterial = new THREE.MeshBasicMaterial({ color: "#a5d8e3", wireframe: true, transparent: true, opacity: 0, depthWrite: false });
  let gltf;
  try {
    gltf = await new GLTFLoader().loadAsync(assetPath("/models/aircraft.glb"));
  } catch (error) {
    renderer.dispose(); material.dispose(); wireMaterial.dispose();
    throw error;
  }
  const aircraft = new THREE.Group();
  const wires: THREE.Mesh[] = [];
  gltf.scene.traverse(object => {
    if (!(object instanceof THREE.Mesh) || wires.includes(object)) return;
    if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
    else object.material.dispose();
    object.material = material;
    const wire = new THREE.Mesh(object.geometry, wireMaterial);
    object.add(wire); wires.push(wire);
  });
  aircraft.add(gltf.scene);
  scene.add(aircraft);
  // These curves are artistic linework; they carry no physical measurements.
  const lineGeometry = new THREE.BufferGeometry();
  const points: number[] = [];
  for (let lane = 0; lane < 30; lane++) {
    const z = (lane % 10 - 4.5) * 6;
    const y = Math.floor(lane / 10) * 9 - 4;
    for (let i = 0; i < 80; i++) {
      for (const x of [-90 + i * 2.25, -90 + (i + 1) * 2.25]) {
        const bend = Math.exp(-Math.pow(x / 22, 2));
        points.push(x, y + bend * (y > 0 ? 4 : -3), z + bend * z * .12);
      }
    }
  }
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: "#87bdca", transparent: true, opacity: .18, depthWrite: false });
  scene.add(new THREE.LineSegments(lineGeometry, lineMaterial));
  const grid = new THREE.GridHelper(240, 48, "#254149", "#172d35");
  grid.position.y = -7;
  scene.add(grid);
  let width = 0, height = 0;
  const render = (time: number) => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w !== width || h !== height) {
      width = w; height = h;
      renderer.setSize(w, h, false);
    }
    const pose = cameraAt(time);
    camera.position.set(...pose.position);
    camera.fov = pose.fov;
    camera.aspect = w / h;
    camera.clearViewOffset();
    if (camera.aspect < 1.6) {
      const full = h * 1.6;
      camera.aspect = 1.6;
      camera.setViewOffset(full, h, full - w, 0, w, h);
    }
    camera.lookAt(new THREE.Vector3(...pose.target));
    camera.updateProjectionMatrix();
    aircraft.rotation.z = THREE.MathUtils.degToRad(-6 - 6 * Math.sin(Math.PI * time));
    wireMaterial.opacity = time > .3 && time < .5 ? Math.sin((time - .3) / .2 * Math.PI) * .32 : 0;
    renderer.render(scene, camera);
  };
  const dispose = () => {
    gltf.scene.traverse(object => { if (object instanceof THREE.Mesh && !wires.includes(object)) object.geometry.dispose(); });
    material.dispose(); wireMaterial.dispose(); lineGeometry.dispose(); lineMaterial.dispose();
    grid.geometry.dispose();
    if (Array.isArray(grid.material)) grid.material.forEach(m => m.dispose()); else grid.material.dispose();
    renderer.dispose();
  };
  return { render, dispose };
}
