/* =========================================================
   Nexus AI — Hero Scene
   Three.js + GSAP + Lenis
   ========================================================= */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }     from 'three/addons/postprocessing/OutputPass.js';

/* ---------------------------------------------------------
   Lenis smooth scrolling
--------------------------------------------------------- */
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ---------------------------------------------------------
   Three.js Scene Setup
--------------------------------------------------------- */
const canvas = document.getElementById('particle-canvas');
const container = canvas.parentElement;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050816, 0.08);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 6.2);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
}

/* ---------------------------------------------------------
   Post-processing — Bloom
--------------------------------------------------------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.9, 0.6, 0.05);
bloom.threshold = 0.05;
bloom.strength  = 0.95;
bloom.radius    = 0.75;
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------------------------------------------------------
   The Particle Ring (organic, wavy, shader-deformed)
--------------------------------------------------------- */
const PARTICLE_COUNT = 14000;

const ringGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const seeds     = new Float32Array(PARTICLE_COUNT);     // per-particle randomness
const radiusArr = new Float32Array(PARTICLE_COUNT);     // distance from center (for layered ring)
const angleArr  = new Float32Array(PARTICLE_COUNT);     // base angle
const sizesArr  = new Float32Array(PARTICLE_COUNT);     // base size

const BASE_R = 1.85;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = Math.random() * Math.PI * 2;

  // Ring thickness — most particles near edge, some layered inward (cluster profile)
  // Use mix of two distributions for depth
  const band = Math.random();
  let r;
  if (band < 0.78) {
    // Main wavy ring band
    r = BASE_R + (Math.random() - 0.5) * 0.22;
  } else if (band < 0.94) {
    // Softer inner halo
    r = BASE_R - Math.random() * 0.55;
  } else {
    // Outer drift particles
    r = BASE_R + Math.random() * 0.45;
  }

  // Initial position on XY plane (Z adds subtle depth)
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  const z = (Math.random() - 0.5) * 0.35;

  positions[i * 3 + 0] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  angleArr[i]  = angle;
  radiusArr[i] = r;
  seeds[i]     = Math.random();
  sizesArr[i]  = 0.6 + Math.random() * 1.4;
}

ringGeometry.setAttribute('position',  new THREE.BufferAttribute(positions, 3));
ringGeometry.setAttribute('aSeed',     new THREE.BufferAttribute(seeds, 1));
ringGeometry.setAttribute('aRadius',   new THREE.BufferAttribute(radiusArr, 1));
ringGeometry.setAttribute('aAngle',    new THREE.BufferAttribute(angleArr, 1));
ringGeometry.setAttribute('aSize',     new THREE.BufferAttribute(sizesArr, 1));

/* ---------------------------------------------------------
   Shaders — with simplex noise for organic deformation
--------------------------------------------------------- */
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uNoiseStrength;
  uniform float uWaveStrength;
  uniform float uAssemble;      // 0 -> 1 entrance
  uniform vec3  uMouse;         // mouse world position
  uniform float uMouseStrength;

  attribute float aSeed;
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSize;

  varying float vSeed;
  varying float vGlow;
  varying float vDepth;

  // ---- Simplex noise (Ashima / Ian McEwan) ----
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vSeed = aSeed;

    // Base ring position
    float angle = aAngle;
    float radius = aRadius;

    // --- Organic wavy deformation: multi-octave noise on radius ---
    float t = uTime * 0.35;
    float n1 = snoise(vec3(cos(angle)*1.4, sin(angle)*1.4, t));
    float n2 = snoise(vec3(cos(angle)*3.0, sin(angle)*3.0, t*1.4 + 10.0)) * 0.5;
    float n3 = snoise(vec3(cos(angle)*6.0, sin(angle)*6.0, t*1.8 + 20.0)) * 0.25;
    float wave = (n1 + n2 + n3) * uWaveStrength;

    // Soft breathing pulse
    float pulse = sin(uTime * 0.9 + aSeed * 6.28) * 0.02;

    float r = radius + wave + pulse;

    vec3 pos;
    pos.x = cos(angle) * r;
    pos.y = sin(angle) * r;

    // Z-deformation using noise for 3D feel
    float zNoise = snoise(vec3(cos(angle)*2.0, sin(angle)*2.0, t*0.8 + 50.0));
    pos.z = zNoise * uNoiseStrength * 0.45 + (aSeed - 0.5) * 0.2;

    // Entrance assemble — start from random position
    vec3 startPos = normalize(vec3(aSeed - 0.5, fract(aSeed*3.7) - 0.5, fract(aSeed*7.1) - 0.5)) * 6.0;
    pos = mix(startPos, pos, smoothstep(0.0, 1.0, uAssemble));

    // --- Mouse repel interaction ---
    vec4 mvPosCheck = modelViewMatrix * vec4(pos, 1.0);
    // Convert mouse from NDC-ish world to same space (we pass in world-space mouse)
    vec3 toMouse = pos - uMouse;
    float md = length(toMouse);
    float repelRadius = 0.85;
    float repel = smoothstep(repelRadius, 0.0, md);
    pos += normalize(toMouse + vec3(0.0001)) * repel * uMouseStrength;

    vGlow = repel;                                   // pass to fragment for brighter hover
    vDepth = pos.z;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Point size — attenuated by depth, scaled by wave intensity
    float sizeBoost = 1.0 + repel * 1.6 + abs(wave) * 1.8;
    gl_PointSize = uSize * aSize * sizeBoost * uPixelRatio * (1.0 / -mvPos.z);
    gl_PointSize *= smoothstep(0.0, 0.6, uAssemble);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform vec3  uColorD;

  varying float vSeed;
  varying float vGlow;
  varying float vDepth;

  void main() {
    // Soft circular particle with glow falloff
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 1.6);

    // Core highlight
    float core = smoothstep(0.25, 0.0, d);

    // Color gradient per-particle based on seed + depth + time
    float mixA = fract(vSeed + uTime * 0.03);
    vec3 col1 = mix(uColorA, uColorB, smoothstep(0.0, 0.5, mixA));
    vec3 col2 = mix(uColorB, uColorC, smoothstep(0.5, 1.0, mixA));
    vec3 col  = mix(col1, col2, 0.5);

    // White hot highlight in core
    col = mix(col, uColorD, core * 0.7);

    // Hover brightens + shifts toward white/cyan
    col = mix(col, vec3(0.85, 0.98, 1.0), vGlow * 0.65);

    // Depth subtle tint
    col *= 0.85 + vDepth * 0.25;

    gl_FragColor = vec4(col, alpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

const ringMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime:           { value: 0 },
    uPixelRatio:     { value: Math.min(window.devicePixelRatio, 2) },
    uSize:           { value: 34 },
    uNoiseStrength:  { value: 1.0 },
    uWaveStrength:   { value: 0.22 },
    uAssemble:       { value: 0.0 },
    uMouse:          { value: new THREE.Vector3(999, 999, 0) },
    uMouseStrength:  { value: 0.35 },
    uColorA:         { value: new THREE.Color('#00D1FF') },
    uColorB:         { value: new THREE.Color('#6C5CE7') },
    uColorC:         { value: new THREE.Color('#00F5FF') },
    uColorD:         { value: new THREE.Color('#FFFFFF') },
  },
});

const ring = new THREE.Points(ringGeometry, ringMaterial);
scene.add(ring);

/* ---------------------------------------------------------
   Ambient dust particles (background depth)
--------------------------------------------------------- */
const DUST_COUNT = 400;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(DUST_COUNT * 3);
const dustSeed = new Float32Array(DUST_COUNT);
for (let i = 0; i < DUST_COUNT; i++) {
  dustPos[i*3]   = (Math.random() - 0.5) * 10;
  dustPos[i*3+1] = (Math.random() - 0.5) * 8;
  dustPos[i*3+2] = (Math.random() - 0.5) * 4 - 1.5;
  dustSeed[i]    = Math.random();
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeo.setAttribute('aSeed',    new THREE.BufferAttribute(dustSeed, 1));

const dustMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime:       { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  vertexShader: /* glsl */`
    uniform float uTime;
    uniform float uPixelRatio;
    attribute float aSeed;
    varying float vSeed;
    void main() {
      vSeed = aSeed;
      vec3 p = position;
      p.y += sin(uTime * 0.3 + aSeed * 10.0) * 0.15;
      p.x += cos(uTime * 0.22 + aSeed * 8.0) * 0.15;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = (1.5 + aSeed * 2.5) * uPixelRatio * (1.0 / -mv.z);
    }
  `,
  fragmentShader: /* glsl */`
    varying float vSeed;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      float a = smoothstep(0.5, 0.0, d);
      vec3 c = mix(vec3(0.35, 0.75, 1.0), vec3(0.65, 0.55, 1.0), vSeed);
      gl_FragColor = vec4(c, a * 0.35);
      if (gl_FragColor.a < 0.01) discard;
    }
  `,
});
const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

/* ---------------------------------------------------------
   Mouse tracking — projected into 3D space on z=0 plane
--------------------------------------------------------- */
const mouseNDC   = new THREE.Vector2(999, 999);
const mouseWorld = new THREE.Vector3(999, 999, 0);
const raycaster  = new THREE.Raycaster();
const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
let mouseActive = false;

function updateMouseWorld() {
  if (!mouseActive) {
    ringMaterial.uniforms.uMouse.value.set(999, 999, 0);
    return;
  }
  raycaster.setFromCamera(mouseNDC, camera);
  const hit = new THREE.Vector3();
  raycaster.ray.intersectPlane(mousePlane, hit);
  // Smoothly approach
  mouseWorld.lerp(hit, 0.18);
  ringMaterial.uniforms.uMouse.value.copy(mouseWorld);
}

canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  mouseActive = true;

  // Boost wave + glow intensity on hover
  gsap.to(ringMaterial.uniforms.uWaveStrength, { value: 0.34, duration: 0.8, ease: 'power2.out', overwrite: true });
  gsap.to(ringMaterial.uniforms.uMouseStrength, { value: 0.55, duration: 0.8, ease: 'power2.out', overwrite: true });
});

canvas.addEventListener('pointerleave', () => {
  mouseActive = false;
  gsap.to(ringMaterial.uniforms.uWaveStrength, { value: 0.22, duration: 1.2, ease: 'power2.out', overwrite: true });
  gsap.to(ringMaterial.uniforms.uMouseStrength, { value: 0.35, duration: 1.2, ease: 'power2.out', overwrite: true });
});

/* Click ripple */
canvas.addEventListener('pointerdown', () => {
  gsap.fromTo(ringMaterial.uniforms.uWaveStrength,
    { value: 0.55 },
    { value: 0.22, duration: 1.6, ease: 'power3.out', overwrite: true });
  gsap.fromTo(bloom, { strength: 1.6 }, { strength: 0.95, duration: 1.2, ease: 'power2.out', overwrite: true });
});

/* ---------------------------------------------------------
   Parallax — subtle camera response to global mouse
--------------------------------------------------------- */
const globalMouse = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  globalMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

/* ---------------------------------------------------------
   Animation loop
--------------------------------------------------------- */
const clock = new THREE.Clock();
let frame = 0;

function animate() {
  const elapsed = clock.getElapsedTime();
  frame++;

  // Uniforms
  ringMaterial.uniforms.uTime.value = elapsed;
  dustMat.uniforms.uTime.value = elapsed;

  // Gentle rotation + floating
  ring.rotation.z = Math.sin(elapsed * 0.15) * 0.08;
  ring.rotation.y = Math.sin(elapsed * 0.2) * 0.12 + globalMouse.x * 0.15;
  ring.rotation.x = Math.cos(elapsed * 0.18) * 0.08 - globalMouse.y * 0.10;
  ring.position.y = Math.sin(elapsed * 0.5) * 0.06;

  // Subtle camera parallax
  camera.position.x += (globalMouse.x * 0.35 - camera.position.x) * 0.04;
  camera.position.y += (-globalMouse.y * 0.25 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  updateMouseWorld();

  composer.render();
  requestAnimationFrame(animate);
}

/* ---------------------------------------------------------
   Resize handling (debounced)
--------------------------------------------------------- */
let resizeTO;
function onResize() {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    resize();
    ringMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    dustMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }, 80);
}
window.addEventListener('resize', onResize);

resize();
animate();

/* ---------------------------------------------------------
   GSAP Entrance Timeline
--------------------------------------------------------- */
// Prepare text elements
const titleLines = document.querySelectorAll('.hero-title .line > span');
const fades      = document.querySelectorAll('[data-anim="fade"]');
const chips      = document.querySelectorAll('.chips .chip');
const visualLabels = document.querySelectorAll('.visual-label');
const visualRing = document.querySelector('.visual-ring');

gsap.set(titleLines, { yPercent: 110 });
gsap.set(fades, { y: 24, opacity: 0 });
gsap.set(chips, { y: 14, opacity: 0 });
gsap.set(visualLabels, { opacity: 0, y: 10 });
gsap.set(visualRing, { opacity: 0, scale: 0.85 });
gsap.set(canvas, { opacity: 0 });

const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

tl.to(canvas, { opacity: 1, duration: 1.4 }, 0)
  .to(ringMaterial.uniforms.uAssemble, { value: 1.0, duration: 2.4, ease: 'power3.inOut' }, 0.1)
  .to(visualRing, { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.4)
  .to(titleLines, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.3)
  .to(fades, { y: 0, opacity: 1, duration: 1.0, stagger: 0.08 }, 0.6)
  .to(chips, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 1.0)
  .to(visualLabels, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 1.2)
  .fromTo(bloom, { strength: 0.2 }, { strength: 0.95, duration: 1.8, ease: 'power2.out' }, 0.4);

/* ---------------------------------------------------------
   Hover micro-interactions on chips
--------------------------------------------------------- */
chips.forEach((chip) => {
  chip.addEventListener('mouseenter', () => {
    gsap.to(chip, { y: -3, duration: 0.3, ease: 'power2.out' });
  });
  chip.addEventListener('mouseleave', () => {
    gsap.to(chip, { y: 0, duration: 0.4, ease: 'power2.out' });
  });
});

/* ---------------------------------------------------------
   Pause animation when tab not visible (perf)
--------------------------------------------------------- */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop();
  } else {
    clock.start();
  }
});