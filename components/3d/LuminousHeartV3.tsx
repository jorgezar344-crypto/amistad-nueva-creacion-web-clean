'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LuminousHeartV3Props {
  className?: string;
  enableMouseInteraction?: boolean;
  scale?: number;
  simulatedState?: 'auto' | 'reposo' | 'latido' | 'flow' | 'cursor-left' | 'cursor-right' | 'depth';
}

export const LuminousHeartV3: React.FC<LuminousHeartV3Props> = ({
  className = '',
  enableMouseInteraction = true,
  scale = 1.0,
  simulatedState = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL Check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Master Hierarchy Groups for Differential Parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const backGroup = new THREE.Group(); // Parallax 0.70x
    const coreGroup = new THREE.Group(); // Parallax 1.00x
    const frontGroup = new THREE.Group(); // Parallax 1.15x
    const escapeGroup = new THREE.Group(); // Parallax 1.30x
    const ambientGroup = new THREE.Group(); // Parallax 0.35x

    rootGroup.add(backGroup);
    rootGroup.add(coreGroup);
    rootGroup.add(frontGroup);
    rootGroup.add(escapeGroup);
    rootGroup.add(ambientGroup);

    // Exact Parametric Cardiod Curve Function
    function getHeartPoint(
      t: number,
      radiusScale: number = 0.22,
      zOffset: number = 0,
      asymmetryFactor: number = 1.0
    ): THREE.Vector3 {
      // Base Cardiod formulas
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      // Subtle organic asymmetry: Left side (sin(t) < 0) breathes slightly differently
      if (Math.sin(t) < 0) {
        x *= asymmetryFactor;
      }

      return new THREE.Vector3(
        x * radiusScale * scale,
        (y - 1.4) * radiusScale * scale,
        zOffset
      );
    }

    // High-Resolution Soft Glow Texture
    function createEnergyGlowTexture(): THREE.Texture {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.15, 'rgba(200, 248, 255, 0.95)');
      grad.addColorStop(0.35, 'rgba(0, 240, 255, 0.75)');
      grad.addColorStop(0.65, 'rgba(0, 168, 232, 0.30)');
      grad.addColorStop(0.88, 'rgba(0, 70, 140, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const energyTexture = createEnergyGlowTexture();

    // ==========================================================
    // LAYER 1: 7 Intertwined Main Energy Currents (Filament Ribbon)
    // ==========================================================
    const filamentConfigs = [
      // 1. Hot White-Cyan Ultra Core
      { color: 0xffffff, opacity: 0.92, rMult: 1.0, zBase: 0.0, freq: 4.0, amp: 0.04, speed: 2.2, group: coreGroup },
      // 2. Left-Breathing Electric Cyan Current
      { color: 0x00f0ff, opacity: 0.85, rMult: 1.018, zBase: 0.16, freq: 5.2, amp: 0.07, speed: 1.8, group: frontGroup },
      // 3. Right-Breathing Aqua Filament
      { color: 0x7df9ff, opacity: 0.80, rMult: 0.982, zBase: 0.26, freq: 6.0, amp: 0.08, speed: 2.5, group: frontGroup },
      // 4. Braided Cyan Spiral Strand
      { color: 0x00d2e0, opacity: 0.72, rMult: 1.032, zBase: 0.08, freq: 7.5, amp: 0.09, speed: 3.0, group: coreGroup },
      // 5. Deep Turquoise Mid-Back Strand
      { color: 0x00a8e8, opacity: 0.60, rMult: 0.968, zBase: -0.22, freq: 3.8, amp: 0.10, speed: 1.4, group: backGroup },
      // 6. Ethereal Outer Glow Strand
      { color: 0x0077b6, opacity: 0.42, rMult: 1.050, zBase: -0.32, freq: 4.6, amp: 0.12, speed: 1.2, group: backGroup },
      // 7. Inner Whispering Ribbon
      { color: 0x004e89, opacity: 0.35, rMult: 0.945, zBase: -0.12, freq: 5.0, amp: 0.06, speed: 1.6, group: backGroup },
    ];

    const filamentSegments = isMobile ? 180 : 300;
    const filamentLines: { line: THREE.Line; geom: THREE.BufferGeometry; cfg: (typeof filamentConfigs)[0] }[] = [];

    filamentConfigs.forEach((cfg) => {
      const positions = new Float32Array((filamentSegments + 1) * 3);
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geom, mat);
      cfg.group.add(line);
      filamentLines.push({ line, geom, cfg });
    });

    // ==========================================================
    // LAYER 2: 6 Escaping Outer Tendrils / Secondary Energy Arcs
    // ==========================================================
    const tendrilConfigs = [
      // 1. Left Upper Lobe Escaping Arc
      { tStart: 0.65 * Math.PI, length: 1.6, dir: new THREE.Vector3(-0.6, 0.7, 0.2), color: 0x00f0ff, opacity: 0.65 },
      // 2. Right Upper Lobe Escaping Arc
      { tStart: 1.35 * Math.PI, length: 1.6, dir: new THREE.Vector3(0.6, 0.7, -0.2), color: 0x7df9ff, opacity: 0.65 },
      // 3. Left Flank Downward Sweep
      { tStart: 0.35 * Math.PI, length: 1.4, dir: new THREE.Vector3(-0.8, -0.4, 0.15), color: 0x00d2e0, opacity: 0.50 },
      // 4. Right Flank Downward Sweep
      { tStart: 1.65 * Math.PI, length: 1.4, dir: new THREE.Vector3(0.8, -0.4, -0.15), color: 0x00a8e8, opacity: 0.50 },
      // 5. Lower Apex Ascending Loop (Left)
      { tStart: 0.95 * Math.PI, length: 1.2, dir: new THREE.Vector3(-0.4, 0.5, 0.3), color: 0x00f0ff, opacity: 0.55 },
      // 6. Crown Ethereal Arch (Top Notch)
      { tStart: 0.02 * Math.PI, length: 1.1, dir: new THREE.Vector3(0.0, 0.6, 0.1), color: 0xffffff, opacity: 0.60 },
    ];

    const tendrilSegments = 40;
    const tendrilLines: { line: THREE.Line; geom: THREE.BufferGeometry; cfg: (typeof tendrilConfigs)[0] }[] = [];

    if (!isMobile) {
      tendrilConfigs.forEach((cfg) => {
        const positions = new Float32Array((tendrilSegments + 1) * 3);
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: cfg.opacity,
          blending: THREE.AdditiveBlending,
        });

        const line = new THREE.Line(geom, mat);
        escapeGroup.add(line);
        tendrilLines.push({ line, geom, cfg });
      });
    }

    // ==========================================================
    // LAYER 3: Directional Flow Particles (2,800 Points Bound to Currents)
    // ==========================================================
    const flowCount = isMobile ? 1200 : 2800;
    const flowPos = new Float32Array(flowCount * 3);
    const flowColors = new Float32Array(flowCount * 3);
    const flowT = new Float32Array(flowCount);
    const flowSpeed = new Float32Array(flowCount);
    const flowFilamentIdx = new Float32Array(flowCount);
    const flowScatter = new Float32Array(flowCount * 3);

    const cyanPalette = [
      new THREE.Color('#FFFFFF'), // Pure Core Spark
      new THREE.Color('#C8F8FF'), // White-Cyan Hot
      new THREE.Color('#7DF9FF'), // Electric Aqua
      new THREE.Color('#00F0FF'), // Bright Cyan
      new THREE.Color('#00D2E0'), // Vivid Turquoise
      new THREE.Color('#00A8E8'), // Deep Rich Cyan
    ];

    for (let i = 0; i < flowCount; i++) {
      const t = Math.random() * Math.PI * 2;
      flowT[i] = t;
      // Directed flow velocities along the spline
      flowSpeed[i] = (0.16 + Math.random() * 0.32) * (Math.random() > 0.25 ? 1 : -1);
      const fIdx = Math.floor(Math.random() * filamentConfigs.length);
      flowFilamentIdx[i] = fIdx;

      flowScatter[i * 3] = (Math.random() - 0.5) * 0.08;
      flowScatter[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      flowScatter[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      const cfg = filamentConfigs[fIdx];
      const pt = getHeartPoint(t, 0.22 * cfg.rMult, cfg.zBase + flowScatter[i * 3 + 2]);
      flowPos[i * 3] = pt.x + flowScatter[i * 3];
      flowPos[i * 3 + 1] = pt.y + flowScatter[i * 3 + 1];
      flowPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * cyanPalette.length)];
      flowColors[i * 3] = col.r;
      flowColors[i * 3 + 1] = col.g;
      flowColors[i * 3 + 2] = col.b;
    }

    const flowGeom = new THREE.BufferGeometry();
    flowGeom.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    flowGeom.setAttribute('color', new THREE.BufferAttribute(flowColors, 3));

    const flowMat = new THREE.PointsMaterial({
      size: isMobile ? 0.24 : 0.30,
      map: energyTexture,
      transparent: true,
      opacity: 0.90,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const flowPoints = new THREE.Points(flowGeom, flowMat);
    coreGroup.add(flowPoints);

    // ==========================================================
    // LAYER 4: Escaping Micro-Sparks with Energy Afterglow (650 Points)
    // ==========================================================
    const escapeCount = isMobile ? 220 : 650;
    const escPos = new Float32Array(escapeCount * 3);
    const escColors = new Float32Array(escapeCount * 3);
    const escData: {
      tOrigin: number;
      life: number;
      maxLife: number;
      vx: number;
      vy: number;
      vz: number;
    }[] = [];

    for (let i = 0; i < escapeCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const pt = getHeartPoint(t, 0.22, (Math.random() - 0.5) * 0.3);
      escPos[i * 3] = pt.x;
      escPos[i * 3 + 1] = pt.y;
      escPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * 4)];
      escColors[i * 3] = col.r;
      escColors[i * 3 + 1] = col.g;
      escColors[i * 3 + 2] = col.b;

      const maxLife = 1.4 + Math.random() * 2.2;
      const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.5;
      const speed = 0.003 + Math.random() * 0.008;

      escData.push({
        tOrigin: t,
        life: Math.random() * maxLife,
        maxLife,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.002, // Gentle ascent
        vz: (Math.random() - 0.5) * 0.004,
      });
    }

    const escGeom = new THREE.BufferGeometry();
    escGeom.setAttribute('position', new THREE.BufferAttribute(escPos, 3));
    escGeom.setAttribute('color', new THREE.BufferAttribute(escColors, 3));

    const escMat = new THREE.PointsMaterial({
      size: 0.20,
      map: energyTexture,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const escPoints = new THREE.Points(escGeom, escMat);
    escapeGroup.add(escPoints);

    // ==========================================================
    // LAYER 5: Orbiting 3D Energy Arcs (450 Points)
    // ==========================================================
    const orbitCount = isMobile ? 150 : 450;
    const orbitPos = new Float32Array(orbitCount * 3);
    const orbitData: { angle: number; speed: number; rx: number; ry: number; tilt: number; zDepth: number }[] = [];

    for (let i = 0; i < orbitCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rx = 3.3 + Math.random() * 1.8;
      const ry = 2.5 + Math.random() * 1.4;
      const tilt = (Math.random() - 0.5) * 0.5;
      const zDepth = (Math.random() - 0.5) * 1.2;
      const speed = (0.22 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1);

      orbitData.push({ angle, speed, rx, ry, tilt, zDepth });

      orbitPos[i * 3] = Math.cos(angle) * rx;
      orbitPos[i * 3 + 1] = Math.sin(angle) * ry;
      orbitPos[i * 3 + 2] = Math.sin(angle) * tilt * 2.2 + zDepth;
    }

    const orbitGeom = new THREE.BufferGeometry();
    orbitGeom.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
    const orbitMat = new THREE.PointsMaterial({
      size: 0.17,
      map: energyTexture,
      transparent: true,
      opacity: 0.50,
      color: 0x7df9ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const orbitPoints = new THREE.Points(orbitGeom, orbitMat);
    frontGroup.add(orbitPoints);

    // ==========================================================
    // LAYER 6: Deep Ambient Space & Subtle Interior Specks (450 Points)
    // ==========================================================
    const dustCount = isMobile ? 180 : 450;
    const dustPos = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      // 85% in deep background, 15% ultra-subtle in hollow interior
      const isInterior = Math.random() < 0.15;
      if (isInterior) {
        dustPos[i * 3] = (Math.random() - 0.5) * 2.2;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      } else {
        dustPos[i * 3] = (Math.random() - 0.5) * 15.0;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 7.0;
      }

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.0018,
        y: (Math.random() - 0.5) * 0.0018 + 0.0012,
        z: (Math.random() - 0.5) * 0.0015,
      });
    }

    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.10,
      map: energyTexture,
      transparent: true,
      opacity: 0.35,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustPoints = new THREE.Points(dustGeom, dustMat);
    ambientGroup.add(dustPoints);

    // ==========================================================
    // LAYER 7: Subdued Apex Convergence Point
    // ==========================================================
    const apexPt = getHeartPoint(Math.PI, 0.22, 0);
    const apexSpriteMat = new THREE.SpriteMaterial({
      map: energyTexture,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const apexSprite = new THREE.Sprite(apexSpriteMat);
    apexSprite.position.copy(apexPt);
    apexSprite.scale.set(0.65, 0.65, 1);
    coreGroup.add(apexSprite);

    // ==========================================================
    // INTERACTION & REFINED SUBTLE CURSOR SPRINGS
    // ==========================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false };
    const mouse3D = new THREE.Vector3(0, 0, 0);

    const onMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
      mouse.isHovering = true;
      mouse3D.set(x * 5.2, y * 3.6, 0);
    };

    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovering = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ==========================================================
    // ANIMATION LOOP (Contemplative 50 BPM Pulse & Energy Propagation)
    // ==========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // --- 1. Contemplative Pulse (50 BPM ~ 1.20s cycle) ---
      let pulseScale = 1.0;
      let pulseLuminance = 1.0;
      let waveProgress = 0.0;

      if (simulatedState === 'reposo') {
        pulseScale = 1.0;
        pulseLuminance = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'latido') {
        pulseScale = 1.020;
        pulseLuminance = 1.22;
        waveProgress = 0.5;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'flow') {
        // Dedicated Flow state: continuous energy circulation
        pulseScale = 1.0;
        pulseLuminance = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'cursor-left') {
        pulseScale = 1.0;
        mouse.targetX = -0.75;
        mouse.targetY = 0.12;
        mouse.isHovering = true;
        mouse3D.set(-3.9, 0.4, 0);
      } else if (simulatedState === 'cursor-right') {
        pulseScale = 1.0;
        mouse.targetX = 0.75;
        mouse.targetY = 0.12;
        mouse.isHovering = true;
        mouse3D.set(3.9, 0.4, 0);
      } else if (simulatedState === 'depth') {
        // QA 3D depth review state
        pulseScale = 1.0;
        mouse.targetX = 0.90;
        mouse.targetY = 0.30;
      } else if (!prefersReducedMotion) {
        const cycle = elapsedTime % 1.2; // 1.20s per calm heartbeat cycle (~50 BPM)

        if (cycle < 0.15) {
          // Apex ignite & gentle expansion
          const p = cycle / 0.15;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.020;
          pulseLuminance = 1.0 + Math.sin(p * Math.PI) * 0.22;
          waveProgress = p;
        } else if (cycle < 0.35) {
          // Energy wave travels up flanks to lobes
          const p = (cycle - 0.15) / 0.20;
          pulseScale = 1.0 + (1 - p) * 0.006;
          waveProgress = 1.0 + p;
        } else if (cycle < 0.50) {
          // Wave dissipates into escaping tendrils
          const p = (cycle - 0.35) / 0.15;
          pulseScale = 1.0;
          pulseLuminance = 1.0 + (1 - p) * 0.08;
        } else {
          // Calm rest period (diastole contemplation)
          pulseScale = 1.0;
          pulseLuminance = 1.0;
        }
      }

      rootGroup.scale.set(pulseScale, pulseScale, pulseScale);
      apexSprite.scale.set(0.65 * pulseLuminance, 0.65 * pulseLuminance, 1);

      // --- 2. Parallax Dampening & Maximum 2.8° Rotation ---
      const springFactor = simulatedState !== 'auto' ? 0.12 : 0.040;
      mouse.x += (mouse.targetX - mouse.x) * springFactor;
      mouse.y += (mouse.targetY - mouse.y) * springFactor;

      // Max Rotation: 0.048 rad (~2.75°) in Y, 0.032 rad (~1.8°) in X
      const maxRotY = simulatedState === 'depth' ? 0.28 : 0.048;
      const maxRotX = simulatedState === 'depth' ? 0.16 : 0.032;

      rootGroup.rotation.y = mouse.x * maxRotY;
      rootGroup.rotation.x = -mouse.y * maxRotX;

      // Differential Layer Parallax
      escapeGroup.position.set(mouse.x * 0.16, mouse.y * 0.12, 0); // 1.30x
      frontGroup.position.set(mouse.x * 0.14, mouse.y * 0.10, 0); // 1.15x
      coreGroup.position.set(mouse.x * 0.10, mouse.y * 0.08, 0); // 1.00x
      backGroup.position.set(mouse.x * 0.06, mouse.y * 0.05, 0); // 0.70x
      ambientGroup.position.set(mouse.x * 0.03, mouse.y * 0.02, 0); // 0.35x

      // Dynamic organic asymmetry breathing cycle
      const asymmetry = 1.0 + Math.sin(elapsedTime * 0.8) * 0.03;

      // --- 3. Animate 7 Main Energy Currents ---
      filamentLines.forEach(({ geom, cfg }) => {
        const pos = (geom.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i <= filamentSegments; i++) {
          const t = (i / filamentSegments) * Math.PI * 2;
          const wave = Math.sin(t * cfg.freq + elapsedTime * cfg.speed) * cfg.amp;
          const pt = getHeartPoint(t, 0.22 * cfg.rMult + wave * 0.04, cfg.zBase + wave, asymmetry);

          // Micro-organic noise
          pt.x += Math.cos(t * 6 + elapsedTime * 1.5) * 0.012;
          pt.y += Math.sin(t * 4 - elapsedTime * 1.2) * 0.012;

          pos[i * 3] = pt.x;
          pos[i * 3 + 1] = pt.y;
          pos[i * 3 + 2] = pt.z;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 4. Animate 6 Escaping Tendrils ---
      tendrilLines.forEach(({ geom, cfg }) => {
        const pos = (geom.attributes.position as THREE.BufferAttribute).array as Float32Array;
        const originPt = getHeartPoint(cfg.tStart, 0.22, 0, asymmetry);

        for (let i = 0; i <= tendrilSegments; i++) {
          const progress = i / tendrilSegments;
          const reach = progress * cfg.length;
          const wiggle = Math.sin(progress * 4.0 - elapsedTime * 2.5) * 0.08 * progress;

          const px = originPt.x + cfg.dir.x * reach + wiggle;
          const py = originPt.y + cfg.dir.y * reach + wiggle * 0.5;
          const pz = originPt.z + cfg.dir.z * reach + wiggle * 0.8;

          pos[i * 3] = px;
          pos[i * 3 + 1] = py;
          pos[i * 3 + 2] = pz;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 5. Animate Flow Particles (Circulating Directionally) ---
      const flowPosArr = (flowGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < flowCount; i++) {
        flowT[i] += flowSpeed[i] * delta * 0.40;
        const t = flowT[i];
        const fIdx = flowFilamentIdx[i];
        const cfg = filamentConfigs[fIdx];

        // Wave propagation luminance/expansion calculation
        const distFromApex = Math.abs(t - Math.PI);
        const waveReach = Math.max(0, 1.0 - Math.abs(distFromApex - waveProgress * Math.PI));
        const dynamicSpread = cfg.rMult + waveReach * 0.012;

        const pt = getHeartPoint(t, 0.22 * dynamicSpread, cfg.zBase + flowScatter[i * 3 + 2], asymmetry);

        let curX = pt.x + flowScatter[i * 3];
        let curY = pt.y + flowScatter[i * 3 + 1];
        let curZ = pt.z + Math.sin(elapsedTime * 2.5 + i) * 0.03;

        // Micro Cursor Avoidance
        if (mouse.isHovering && !prefersReducedMotion) {
          const dx = curX - mouse3D.x;
          const dy = curY - mouse3D.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1.4) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / 1.18) * 0.12;
            curX += (dx / (dist + 0.001)) * force;
            curY += (dy / (dist + 0.001)) * force;
          }
        }

        flowPosArr[i * 3] = curX;
        flowPosArr[i * 3 + 1] = curY;
        flowPosArr[i * 3 + 2] = curZ;
      }
      flowGeom.attributes.position.needsUpdate = true;

      // --- 6. Animate Escaping Micro-Sparks ---
      const escPosArr = (escGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < escapeCount; i++) {
        const d = escData[i];
        d.life += delta;

        if (d.life > d.maxLife) {
          d.life = 0;
          d.tOrigin = Math.random() * Math.PI * 2;
          const pt = getHeartPoint(d.tOrigin, 0.22, (Math.random() - 0.5) * 0.2, asymmetry);
          escPosArr[i * 3] = pt.x;
          escPosArr[i * 3 + 1] = pt.y;
          escPosArr[i * 3 + 2] = pt.z;

          const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.5;
          const spd = 0.003 + Math.random() * 0.007;
          d.vx = Math.cos(angle) * spd;
          d.vy = Math.sin(angle) * spd + 0.0015;
          d.vz = (Math.random() - 0.5) * 0.003;
        } else {
          escPosArr[i * 3] += d.vx;
          escPosArr[i * 3 + 1] += d.vy;
          escPosArr[i * 3 + 2] += d.vz;
        }
      }
      escGeom.attributes.position.needsUpdate = true;

      // --- 7. Animate Orbiting Loops ---
      const orbPosArr = (orbitGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < orbitCount; i++) {
        const orb = orbitData[i];
        orb.angle += orb.speed * delta * 0.35;
        orbPosArr[i * 3] = Math.cos(orb.angle) * orb.rx;
        orbPosArr[i * 3 + 1] = Math.sin(orb.angle) * orb.ry;
        orbPosArr[i * 3 + 2] = Math.sin(orb.angle) * orb.tilt * 2.2 + orb.zDepth;
      }
      orbitGeom.attributes.position.needsUpdate = true;

      // --- 8. Animate Deep Ambient & Interior Dust ---
      const dustPosArr = (dustGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dustPosArr[i * 3] += dustVelocities[i].x;
        dustPosArr[i * 3 + 1] += dustVelocities[i].y;
        dustPosArr[i * 3 + 2] += dustVelocities[i].z;

        if (dustPosArr[i * 3 + 1] > 6.0) dustPosArr[i * 3 + 1] = -6.0;
        if (dustPosArr[i * 3] > 8.0) dustPosArr[i * 3] = -8.0;
        if (dustPosArr[i * 3] < -8.0) dustPosArr[i * 3] = 8.0;
      }
      dustGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      energyTexture.dispose();
      flowGeom.dispose();
      flowMat.dispose();
      escGeom.dispose();
      escMat.dispose();
      orbitGeom.dispose();
      orbitMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      filamentLines.forEach((f) => {
        f.geom.dispose();
        (f.line.material as THREE.Material).dispose();
      });
      tendrilLines.forEach((t) => {
        t.geom.dispose();
        (t.line.material as THREE.Material).dispose();
      });
    };
  }, [enableMouseInteraction, scale, simulatedState]);

  if (!isSupported) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src="/brand/corazon-luz-reference.png"
          alt="Corazón de Luz — Amistad Nueva Creación"
          className="max-w-md w-full object-contain filter drop-shadow-cyanGlow"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[520px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="Experiencia interactiva 3D: Corazón de Luz V3 Energy"
    />
  );
};

