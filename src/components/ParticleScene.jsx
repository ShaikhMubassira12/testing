import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { theme } from '../theme';

const ParticleScene = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const ringMaterialRef = useRef(null);
  const composerRef = useRef(null);
  const bloomRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement || window;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.08);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
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
    renderer.setSize(width, height);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.35, 0.6, 0.08);
    bloom.threshold = theme.bloom.threshold;
    bloom.strength = theme.bloom.strength;
    bloom.radius = theme.bloom.radius;
    bloomRef.current = bloom;
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // Vertex Shader
    const vertexShader = `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSize;
      uniform float uNoiseStrength;
      uniform float uWaveStrength;
      uniform float uAssemble;
      uniform vec3  uMouse;
      uniform float uMouseStrength;

      attribute float aSeed;
      attribute float aRadius;
      attribute float aAngle;
      attribute float aSize;

      varying float vSeed;
      varying float vGlow;
      varying float vDepth;

      // Simplex noise (Ashima / Ian McEwan)
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
        float angle = aAngle;
        float radius = aRadius;

        float t = uTime * 0.35;
        float n1 = snoise(vec3(cos(angle)*1.4, sin(angle)*1.4, t));
        float n2 = snoise(vec3(cos(angle)*3.0, sin(angle)*3.0, t*1.4 + 10.0)) * 0.5;
        float n3 = snoise(vec3(cos(angle)*6.0, sin(angle)*6.0, t*1.8 + 20.0)) * 0.25;
        float wave = (n1 + n2 + n3) * uWaveStrength;

        float pulse = sin(uTime * 0.9 + aSeed * 6.28) * 0.02;
        float r = radius + wave + pulse;

        vec3 pos;
        pos.x = cos(angle) * r;
        pos.y = sin(angle) * r;

        float zNoise = snoise(vec3(cos(angle)*2.0, sin(angle)*2.0, t*0.8 + 50.0));
        pos.z = zNoise * uNoiseStrength * 0.45 + (aSeed - 0.5) * 0.2;

        vec3 startPos = normalize(vec3(aSeed - 0.5, fract(aSeed*3.7) - 0.5, fract(aSeed*7.1) - 0.5)) * 6.0;
        pos = mix(startPos, pos, smoothstep(0.0, 1.0, uAssemble));

        vec3 toMouse = pos - uMouse;
        float md = length(toMouse);
        float repelRadius = 1.35;
        float repel = smoothstep(repelRadius, 0.0, md);
        float smoothRepel = repel * repel * (3.0 - 2.0 * repel);
        vec3 repelDir = normalize(toMouse + vec3(0.0001));
        vec3 swirlDir = normalize(cross(vec3(0.0, 0.0, 1.0), repelDir));
        pos += repelDir * smoothRepel * uMouseStrength * 1.05;
        pos += swirlDir * smoothRepel * uMouseStrength * 0.22;

        vGlow = smoothRepel;
        vDepth = pos.z;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPos;

        float sizeBoost = 0.72 + smoothRepel * 0.95 + abs(wave) * 0.7;
        gl_PointSize = uSize * aSize * sizeBoost * uPixelRatio * (1.0 / -mvPos.z);
        gl_PointSize *= smoothstep(0.0, 0.6, uAssemble);
      }
    `;

    // Fragment Shader
    const fragmentShader = `
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
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float outer = smoothstep(0.5, 0.0, d);
        float rim = smoothstep(0.5, 0.35, d) - smoothstep(0.35, 0.22, d);
        float alpha = pow(outer, 1.8) * 0.11 + rim * 0.04;

        float mixA = fract(vSeed + uTime * 0.03);
        vec3 col1 = mix(uColorA, uColorC, smoothstep(0.0, 1.0, mixA));
        vec3 col2 = mix(uColorB, vec3(0.90, 0.95, 1.0), smoothstep(0.2, 1.0, mixA));
        vec3 col  = mix(col1, col2, 0.45);

        float highlight = smoothstep(0.16, 0.0, length(uv - vec2(-0.12, 0.12)));
        col = mix(col, vec3(1.0), highlight * 0.20);
        col = mix(col, vec3(0.94, 0.99, 1.0), vGlow * 0.16);
        alpha += vGlow * 0.03;

        col *= 0.70 + vDepth * 0.12;

        gl_FragColor = vec4(col, alpha);
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

    // Particles
    const PARTICLE_COUNT = theme.particles.count;
    const ringGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const radiusArr = new Float32Array(PARTICLE_COUNT);
    const angleArr = new Float32Array(PARTICLE_COUNT);
    const sizesArr = new Float32Array(PARTICLE_COUNT);

    const BASE_R = theme.particles.baseRadius;
    const CLOUD_X = theme.particles.cloudX;
    const CLOUD_Y = theme.particles.cloudY;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const band = Math.random();
      const angle = Math.random() * Math.PI * 2;
      let r;
      if (band < 0.68) {
        r = BASE_R * (0.3 + Math.random() * 0.7);
      } else {
        r = BASE_R * (1.0 + Math.random() * 0.5);
      }

      const squash = 0.72 + Math.random() * 0.36;
      const x = Math.cos(angle) * r * CLOUD_X * squash;
      const y = Math.sin(angle) * r * CLOUD_Y * squash;
      const z = (Math.random() - 0.5) * 0.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      seeds[i] = Math.random();
      radiusArr[i] = r;
      angleArr[i] = angle;
      sizesArr[i] = 0.5 + Math.random() * 1.5;
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ringGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    ringGeometry.setAttribute('aRadius', new THREE.BufferAttribute(radiusArr, 1));
    ringGeometry.setAttribute('aAngle', new THREE.BufferAttribute(angleArr, 1));
    ringGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArr, 1));

    const ringMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: theme.particles.size },
        uNoiseStrength: { value: theme.particles.noiseStrength },
        uWaveStrength: { value: theme.particles.waveStrength },
        uAssemble: { value: 0.0 },
        uMouse: { value: new THREE.Vector3(999, 999, 0) },
        uMouseStrength: { value: theme.particles.mouseStrength },
        uColorA: { value: new THREE.Color('#00D1FF') },
        uColorB: { value: new THREE.Color('#6C5CE7') },
        uColorC: { value: new THREE.Color('#00F5FF') },
        uColorD: { value: new THREE.Color('#FFFFFF') },
      },
    });

    ringMaterialRef.current = ringMaterial;

    const ring = new THREE.Points(ringGeometry, ringMaterial);
    scene.add(ring);

    // Dust particles
    const DUST_COUNT = theme.dust.count;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustSeed = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 20;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      dustSeed[i] = Math.random();
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1));

    const dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
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
      fragmentShader: `
        varying float vSeed;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d);
          vec3 c = mix(vec3(0.35, 0.75, 1.0), vec3(0.65, 0.55, 1.0), vSeed);
          gl_FragColor = vec4(c, a * 0.08);
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
    });

    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Mouse tracking
    const mouseNDC = new THREE.Vector2(999, 999);
    const mouseWorld = new THREE.Vector3(999, 999, 0);
    const raycaster = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(mousePlane, mouseWorld);

      ringMaterial.uniforms.uMouse.value = mouseWorld;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Handle resize
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    const clock = new THREE.Clock();
    let assembleValue = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      ringMaterial.uniforms.uTime.value = t;
      dustMat.uniforms.uTime.value = t;

      // Animate particles entrance over 2.4 seconds
      assembleValue = Math.min(1, t / 2.4);
      ringMaterial.uniforms.uAssemble.value = assembleValue;

      composer.render();
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      composer.dispose();
    };
  }, []);

  return <canvas id="particle-canvas" ref={canvasRef}></canvas>;
};

export default ParticleScene;
