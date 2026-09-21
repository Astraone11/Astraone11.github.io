import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#hero-canvas');
const view = document.querySelector('#hero-3d-view');
const hero = document.querySelector('#home');
const loaderUI = document.querySelector('#hero-loader');
const progressText = document.querySelector('#hero-load-progress');
const progressBar = document.querySelector('#hero-load-bar');
const engineeringButton = document.querySelector('#engineering-view');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 760px)');

if (!canvas || !view || !window.WebGLRenderingContext) {
  view?.classList.add('is-3d-failed');
  if (loaderUI) loaderUI.textContent = '3D tidak didukung · menampilkan visual cadangan';
} else {
  startExperience().catch(() => {
    view.classList.add('is-3d-failed');
    loaderUI?.remove();
  });
}

async function startExperience() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact.matches, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = !compact.matches;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .05, 100);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let environmentTarget = pmrem.fromScene(new RoomEnvironment(), .04);
  scene.environment = environmentTarget.texture;
  new EXRLoader().load('environment/studio-small-09-2k.exr', texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const nextEnvironment = pmrem.fromEquirectangular(texture);
    texture.dispose();
    environmentTarget.dispose();
    environmentTarget = nextEnvironment;
    scene.environment = nextEnvironment.texture;
  }, undefined, () => {});

  const key = new THREE.DirectionalLight(0xffffff, 3.7);
  key.position.set(4.5, 7.5, 5.5);
  key.castShadow = !compact.matches;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd9e9f8, 2.6);
  rim.position.set(-5, 3.5, -4);
  scene.add(rim);
  const accentLight = new THREE.PointLight(0xe7f2ff, 8, 13, 2);
  accentLight.position.set(-3, 1.8, 3);
  const roofLight = new THREE.RectAreaLight(0xffffff, 7, 5.5, 2.5);
  roofLight.position.set(0, 6, 1.5);
  roofLight.lookAt(0, 0, 0);
  const sideLight = new THREE.RectAreaLight(0xcfe7ff, 4.5, 3, 4);
  sideLight.position.set(-4.5, 2.8, -1.5);
  sideLight.lookAt(0, .7, 0);
  scene.add(accentLight, roofLight, sideLight, new THREE.HemisphereLight(0xffffff, 0xb8c5d2, 2.15));

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5.7, compact.matches ? 48 : 96),
    new THREE.MeshStandardMaterial({ color: 0xe8edf1, metalness: .2, roughness: .42, transparent: true, opacity: .88 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.scale.y = .42;
  floor.receiveShadow = !compact.matches;
  scene.add(floor);

  const chunks = Array.from({ length: 9 }, (_, index) => `models/porsche-911-${String(index).padStart(2, '0')}.txt`);
  let encoded = '';
  for (let index = 0; index < chunks.length; index += 1) {
    const response = await fetch(chunks[index]);
    if (!response.ok) throw new Error(`Model chunk ${index + 1} gagal dimuat`);
    encoded += await response.text();
    const percent = Math.round(((index + 1) / chunks.length) * 86);
    progressText.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
  }
  const compressed = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  const modelBuffer = await new Response(stream).arrayBuffer();
  progressText.textContent = '94%';
  progressBar.style.width = '94%';
  const model = await new Promise((resolve, reject) => {
    new GLTFLoader().parse(modelBuffer, '', resolve, reject);
  });

  const car = model.scene;
  const pivot = new THREE.Group();
  pivot.add(car);
  scene.add(pivot);
  car.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(car);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 5.2 / Math.max(size.x, size.z);
  car.scale.setScalar(scale);
  car.position.set(-center.x * scale, -box.min.y * scale + .03, -center.z * scale);
  floor.position.y = .02;

  const wheels = [];
  const lightMaterials = [];
  car.traverse(object => {
    if (object.isMesh) {
      object.castShadow = !compact.matches;
      object.receiveShadow = !compact.matches;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        if (!material) return;
        material.envMapIntensity = material.name === 'WindowsTint' ? 1.3 : 1.55;
        if (material.isMeshStandardMaterial && material.name !== 'WindowsTint') {
          material.roughness = THREE.MathUtils.clamp(material.roughness ?? .34, .2, .48);
          material.metalness = THREE.MathUtils.clamp(material.metalness ?? .55, .18, .92);
        }
        if (material.name === 'WindowsTint') {
          material.transparent = true;
          material.opacity = .58;
          material.depthWrite = false;
        }
        if (material.emissive && material.emissive.getHex() !== 0) {
          material.emissiveIntensity = .35;
          lightMaterials.push(material);
        }
      });
    }
    if (/wheel/i.test(object.name)) wheels.push({ object, base: object.position.clone() });
  });

  const mobileScale = compact.matches ? 1.2 : 1;
  const path = [
    new THREE.Vector3(4.8, 2.2, 6.7),
    new THREE.Vector3(4.3, 1.82, 5.65),
    new THREE.Vector3(6.5, 1.72, 1.35),
    new THREE.Vector3(3.05, 1.02, 3.15),
    new THREE.Vector3(3.45, 1.28, 4.05),
    new THREE.Vector3(7.15, 1.75, .1),
    new THREE.Vector3(4.05, 1.22, 3.65),
    new THREE.Vector3(3.3, .98, 3.02),
    new THREE.Vector3(5.15, 2.0, -5.75),
    new THREE.Vector3(6.35, 1.75, 1.25),
    new THREE.Vector3(4.65, 2.12, 6.3)
  ].map(point => point.multiplyScalar(mobileScale));
  const targets = [
    new THREE.Vector3(0, .78, 0),
    new THREE.Vector3(0, .72, .2),
    new THREE.Vector3(0, .72, .15),
    new THREE.Vector3(.54, .42, .78),
    new THREE.Vector3(.52, .45, .7),
    new THREE.Vector3(0, .72, 0),
    new THREE.Vector3(.42, .58, .82),
    new THREE.Vector3(.5, .55, .9),
    new THREE.Vector3(0, .72, -.2),
    new THREE.Vector3(0, .76, .15),
    new THREE.Vector3(0, .76, 0)
  ];
  const focus = targets[0].clone();
  const desiredFocus = focus.clone();
  const presets = {
    front: new THREE.Vector3(4.8, 2.15, 6.4).multiplyScalar(mobileScale),
    side: new THREE.Vector3(7.1, 1.75, .1).multiplyScalar(mobileScale),
    rear: new THREE.Vector3(4.9, 2.2, -6.4).multiplyScalar(mobileScale),
    top: new THREE.Vector3(-.8, 5.9, -4.4).multiplyScalar(mobileScale),
    reset: path[0]
  };
  const desired = path[0].clone();
  let desiredFov = compact.matches ? 43 : 34;
  camera.position.copy(desired);
  camera.lookAt(focus);

  let active = true;
  let scrollProgress = 0;
  let manualTarget = null;
  let manualYaw = 0;
  let targetYaw = 0;
  let zoom = 0;
  let targetZoom = 0;
  let engineering = 0;
  let engineeringTarget = 0;
  let dragging = false;
  let previousX = 0;
  const pointers = new Map();
  let pinchDistance = 0;

  const cameraCurve = new THREE.CatmullRomCurve3(path, false, 'centripetal', .45);
  const targetCurve = new THREE.CatmullRomCurve3(targets, false, 'centripetal', .45);
  const cameraAt = progress => cameraCurve.getPoint(THREE.MathUtils.smootherstep(progress, 0, 1));
  const targetAt = progress => targetCurve.getPoint(THREE.MathUtils.smootherstep(progress, 0, 1));
  const fovAt = progress => {
    const close = Math.max(0, 1 - Math.abs(progress - .45) / .16);
    return (compact.matches ? 43 : 34) - close * (compact.matches ? 3 : 6);
  };
  addEventListener('nitrova:story', event => {
    scrollProgress = event.detail.progress;
    if (!manualTarget) {
      desired.copy(cameraAt(scrollProgress));
      desiredFocus.copy(targetAt(scrollProgress));
      desiredFov = fovAt(scrollProgress);
    }
  });
  const updateScroll = () => {
    const rect = hero.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
    if (!manualTarget) {
      desired.copy(cameraAt(scrollProgress));
      desiredFocus.copy(targetAt(scrollProgress));
      desiredFov = fovAt(scrollProgress);
    }
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  document.querySelectorAll('[data-3d-camera]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset['3dCamera'];
    manualTarget = name === 'reset' ? null : presets[name].clone();
    if (name === 'reset') {
      targetYaw = 0;
      targetZoom = 0;
      desired.copy(cameraAt(scrollProgress));
      desiredFocus.copy(targetAt(scrollProgress));
      desiredFov = fovAt(scrollProgress);
    } else {
      desired.copy(manualTarget);
      desiredFocus.set(0, .78, 0);
      desiredFov = compact.matches ? 43 : 34;
    }
    document.querySelectorAll('[data-3d-camera]').forEach(item => item.setAttribute('aria-pressed', String(item === button && name !== 'reset')));
  }));

  engineeringButton?.addEventListener('click', () => {
    engineeringTarget = engineeringTarget ? 0 : 1;
    engineeringButton.setAttribute('aria-pressed', String(Boolean(engineeringTarget)));
    engineeringButton.textContent = engineeringTarget ? 'Assemble' : 'Engineering';
  });

  view.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    view.setPointerCapture(event.pointerId);
    dragging = pointers.size === 1;
    previousX = event.clientX;
    if (pointers.size === 2) {
      const points = [...pointers.values()];
      pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }
  });
  view.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1 && dragging) {
      targetYaw += (event.clientX - previousX) * .008;
      previousX = event.clientX;
    } else if (pointers.size === 2) {
      const points = [...pointers.values()];
      const next = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      targetZoom = THREE.MathUtils.clamp(targetZoom + (pinchDistance - next) * .008, -1.4, 2.2);
      pinchDistance = next;
    }
  });
  const release = event => {
    pointers.delete(event.pointerId);
    dragging = false;
  };
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);
  view.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    targetZoom = THREE.MathUtils.clamp(targetZoom + event.deltaY * .002, -1.4, 2.2);
  }, { passive: false });

  const visibility = new IntersectionObserver(entries => { active = entries[0].isIntersecting; }, { threshold: .01 });
  visibility.observe(hero);

  const resize = () => {
    const width = Math.max(1, view.clientWidth);
    const height = Math.max(1, view.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = desiredFov;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(view);
  resize();

  progressText.textContent = '100%';
  progressBar.style.width = '100%';
  view.classList.add('is-3d-ready');
  setTimeout(() => loaderUI?.remove(), 700);

  const clock = new THREE.Clock();
  let lastRender = 0;
  function render(time) {
    requestAnimationFrame(render);
    if (!active && time - lastRender < 180) return;
    lastRender = time;
    const delta = Math.min(.04, clock.getDelta());
    const ease = reducedMotion.matches ? 1 : 1 - Math.pow(.001, delta);
    manualYaw = THREE.MathUtils.lerp(manualYaw, targetYaw, ease);
    zoom = THREE.MathUtils.lerp(zoom, targetZoom, ease);
    engineering = THREE.MathUtils.lerp(engineering, engineeringTarget, ease);
    pivot.rotation.y = manualYaw + (reducedMotion.matches ? 0 : Math.sin(time * .00018) * .025);
    pivot.position.y = reducedMotion.matches ? 0 : Math.sin(time * .0012) * .025;
    wheels.forEach(({ object, base }) => {
      object.rotation.x -= delta * (reducedMotion.matches ? 0 : .35);
      object.position.x = THREE.MathUtils.lerp(base.x, base.x * 1.45, engineering);
      object.position.z = THREE.MathUtils.lerp(base.z, base.z * 1.05, engineering);
    });
    const zoomed = desired.clone().addScaledVector(desired.clone().normalize(), zoom);
    camera.position.lerp(zoomed, ease);
    focus.lerp(desiredFocus, ease);
    camera.fov = THREE.MathUtils.lerp(camera.fov, desiredFov, ease);
    camera.updateProjectionMatrix();
    camera.lookAt(focus);
    rim.intensity = 2.35 + Math.sin(time * .001) * .22;
    accentLight.position.z = Math.sin(time * .0005) * 3.5;
    const headlightPhase = Math.max(0, 1 - Math.abs(scrollProgress - .66) / .12);
    lightMaterials.forEach(material => { material.emissiveIntensity = .35 + headlightPhase * 2.4; });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);

  addEventListener('pagehide', () => {
    visibility.disconnect();
    car.traverse(object => {
      object.geometry?.dispose?.();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => material?.dispose?.());
    });
    floor.geometry.dispose();
    floor.material.dispose();
    pmrem.dispose();
    environmentTarget.dispose();
    renderer.dispose();
  }, { once: true });
}
