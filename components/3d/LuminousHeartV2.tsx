'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LuminousHeartV2Props {
  className?: string;
  enableMouseInteraction?: boolean;
  scale?: number;
  simulatedState?: 'auto' | 'reposo' | 'latido' | 'cursor-left' | 'cursor-right' | 'depth';
}

export const LuminousHeartV2: React.FC<LuminousHeartV2Props> = ({
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

    // Check WebGL support
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

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
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

    // Master Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Separate Layer Groups for Parallax Differentials
    const backFilamentsGroup = new THREE.Group();
    const coreFilamentsGroup = new THREE.Group();
    const contourParticlesGroup = new THREE.Group();
    const escapingSparksGroup = new THREE.Group();
    const orbitalParticlesGroup = new THREE.Group();
    const ambientDustGroup = new THREE.Group();

    rootGroup.add(backFilamentsGroup);
    rootGroup.add(coreFilamentsGroup);
    rootGroup.add(contourParticlesGroup);
    rootGroup.add(escapingSparksGroup);
    rootGroup.add(orbitalParticlesGroup);
    rootGroup.add(ambientDustGroup);

    // Exact Parametric Cardiod Curve Function
    function getHeartPoint(t: number, radiusScale: number = 0.22, zOffset: number = 0): THREE.Vector3 {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      return new THREE.Vector3(
        x * radiusScale * scale,
        (y - 1.4) * radiusScale * scale,
        zOffset
      );
    }

    // Texture Generator: Multi-stage Soft Glowing Particle
    function createGlowTexture(): THREE.Texture {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
      grad.addColorStop(0.45, 'rgba(0, 168, 232, 0.45)');
      grad.addColorStop(0.8, 'rgba(0, 70, 120, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const glowTexture = createGlowTexture();

    // ==========================================================
    // LAYER 1: Multi-strand Intertwined Energy Filaments (5 Strands)
    // ==========================================================
    const filamentConfigs = [
      // Core Intense White-Cyan
      { color: 0xffffff, opacity: 0.85, rMult: 1.0, zBase: 0.0, waveFreq: 4.0, waveAmp: 0.05, isCore: true },
      // Electric Cyan Main
      { color: 0x00f0ff, opacity: 0.9, rMult: 1.012, zBase: 0.15, waveFreq: 5.0, waveAmp: 0.08, isCore: true },
      // Aqua Depth Strand (Front)
      { color: 0x7df9ff, opacity: 0.75, rMult: 0.988, zBase: 0.28, waveFreq: 6.0, waveAmp: 0.09, isCore: true },
      // Back Turquoise Strand
      { color: 0x00a8e8, opacity: 0.65, rMult: 1.025, zBase: -0.22, waveFreq: 3.5, waveAmp: 0.1, isCore: false },
      // Ethereal Outer Glow Strand (Back)
      { color: 0x0077b6, opacity: 0.45, rMult: 0.975, zBase: -0.35, waveFreq: 4.5, waveAmp: 0.12, isCore: false },
    ];

    const filamentSegments = isMobile ? 180 : 320;
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
      if (cfg.isCore) {
        coreFilamentsGroup.add(line);
      } else {
        backFilamentsGroup.add(line);
      }
      filamentLines.push({ line, geom, cfg });
    });

    // ==========================================================
    // LAYER 2: Contour Hugger Particles (2,400 points)
    // ==========================================================
    const contourCount = isMobile ? 1000 : 2400;
    const contourPos = new Float32Array(contourCount * 3);
    const contourColors = new Float32Array(contourCount * 3);
    const contourSizes = new Float32Array(contourCount);
    const contourT = new Float32Array(contourCount);
    const contourSpeed = new Float32Array(contourCount);
    const contourRadiusMult = new Float32Array(contourCount);
    const contourZOffset = new Float32Array(contourCount);
    const contourBaseSize = new Float32Array(contourCount);

    const cyanPalette = [
      new THREE.Color('#FFFFFF'), // Pure core spark
      new THREE.Color('#7DF9FF'), // Electric light cyan
      new THREE.Color('#00F0FF'), // Bright cyan
      new THREE.Color('#00D2E0'), // Vivid turquoise
      new THREE.Color('#0077B6'), // Deep rich cyan
    ];

    for (let i = 0; i < contourCount; i++) {
      const t = Math.random() * Math.PI * 2;
      contourT[i] = t;
      contourSpeed[i] = (0.12 + Math.random() * 0.28) * (Math.random() > 0.3 ? 1 : -1);
      // Small Gaussian scatter around the heart curve
      const spread = (Math.random() - 0.5) * 0.09;
      contourRadiusMult[i] = 1.0 + spread;
      contourZOffset[i] = (Math.random() - 0.5) * 0.45;

      const pt = getHeartPoint(t, 0.22 * contourRadiusMult[i], contourZOffset[i]);
      contourPos[i * 3] = pt.x;
      contourPos[i * 3 + 1] = pt.y;
      contourPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * cyanPalette.length)];
      contourColors[i * 3] = col.r;
      contourColors[i * 3 + 1] = col.g;
      contourColors[i * 3 + 2] = col.b;

      const baseS = (Math.random() * 0.12 + 0.08) * (isMobile ? 0.8 : 1.0);
      contourBaseSize[i] = baseS;
      contourSizes[i] = baseS;
    }

    const contourGeom = new THREE.BufferGeometry();
    contourGeom.setAttribute('position', new THREE.BufferAttribute(contourPos, 3));
    contourGeom.setAttribute('color', new THREE.BufferAttribute(contourColors, 3));

    const contourMat = new THREE.PointsMaterial({
      size: isMobile ? 0.24 : 0.32,
      map: glowTexture,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const contourParticles = new THREE.Points(contourGeom, contourMat);
    contourParticlesGroup.add(contourParticles);

    // ==========================================================
    // LAYER 3: Escaping Micro-Ember Sparks (500 points)
    // ==========================================================
    const escapeCount = isMobile ? 180 : 500;
    const escapePos = new Float32Array(escapeCount * 3);
    const escapeColors = new Float32Array(escapeCount * 3);
    const escapeData: {
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
      escapePos[i * 3] = pt.x;
      escapePos[i * 3 + 1] = pt.y;
      escapePos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * 3)];
      escapeColors[i * 3] = col.r;
      escapeColors[i * 3 + 1] = col.g;
      escapeColors[i * 3 + 2] = col.b;

      const maxLife = 1.2 + Math.random() * 2.0;
      // Normal vector outward direction
      const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.6;
      const speed = 0.003 + Math.random() * 0.008;

      escapeData.push({
        tOrigin: t,
        life: Math.random() * maxLife,
        maxLife,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.002, // Subtle rise
        vz: (Math.random() - 0.5) * 0.004,
      });
    }

    const escapeGeom = new THREE.BufferGeometry();
    escapeGeom.setAttribute('position', new THREE.BufferAttribute(escapePos, 3));
    escapeGeom.setAttribute('color', new THREE.BufferAttribute(escapeColors, 3));

    const escapeMat = new THREE.PointsMaterial({
      size: 0.18,
      map: glowTexture,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const escapeParticles = new THREE.Points(escapeGeom, escapeMat);
    escapingSparksGroup.add(escapeParticles);

    // ==========================================================
    // LAYER 4: Orbital Particle Loops (350 points)
    // ==========================================================
    const orbitalCount = isMobile ? 120 : 350;
    const orbitalPos = new Float32Array(orbitalCount * 3);
    const orbitalData: { angle: number; speed: number; rx: number; ry: number; tilt: number }[] = [];

    for (let i = 0; i < orbitalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rx = 3.2 + Math.random() * 1.6;
      const ry = 2.4 + Math.random() * 1.2;
      const tilt = (Math.random() - 0.5) * 0.45;
      const speed = (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);

      orbitalData.push({ angle, speed, rx, ry, tilt });

      orbitalPos[i * 3] = Math.cos(angle) * rx;
      orbitalPos[i * 3 + 1] = Math.sin(angle) * ry;
      orbitalPos[i * 3 + 2] = Math.sin(angle) * tilt * 2.0;
    }

    const orbitalGeom = new THREE.BufferGeometry();
    orbitalGeom.setAttribute('position', new THREE.BufferAttribute(orbitalPos, 3));
    const orbitalMat = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTexture,
      transparent: true,
      opacity: 0.55,
      color: 0x7df9ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const orbitalParticles = new THREE.Points(orbitalGeom, orbitalMat);
    orbitalParticlesGroup.add(orbitalParticles);

    // ==========================================================
    // LAYER 5: Ambient Deep Dust (400 points)
    // ==========================================================
    const dustCount = isMobile ? 150 : 400;
    const dustPos = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 14.0;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10.0;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002 + 0.0015,
        z: (Math.random() - 0.5) * 0.0015,
      });
    }

    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.11,
      map: glowTexture,
      transparent: true,
      opacity: 0.4,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustParticles = new THREE.Points(dustGeom, dustMat);
    ambientDustGroup.add(dustParticles);

    // ==========================================================
    // LAYER 6: Integrated Subtle Apex Flare (Bottom Tip)
    // ==========================================================
    const apexPt = getHeartPoint(Math.PI, 0.22, 0);
    const apexSpriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const apexSprite = new THREE.Sprite(apexSpriteMat);
    apexSprite.position.copy(apexPt);
    apexSprite.scale.set(0.9, 0.9, 1);
    coreFilamentsGroup.add(apexSprite);

    // ==========================================================
    // INTERACTION & MOUSE SPRINGS
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
      mouse3D.set(x * 5.5, y * 3.8, 0);
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
    // ANIMATION LOOP (Heartbeat Propagation & Multi-Layer Parallax)
    // ==========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // --- 1. Heartbeat Wave Propagation ---
      let pulseScale = 1.0;
      let pulseWaveProgress = 0.0;
      let pulseLuminance = 1.0;

      if (simulatedState === 'reposo') {
        pulseScale = 1.0;
        pulseLuminance = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'latido') {
        pulseScale = 1.022;
        pulseLuminance = 1.25;
        pulseWaveProgress = 0.5;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'cursor-left') {
        pulseScale = 1.0;
        mouse.targetX = -0.8;
        mouse.targetY = 0.15;
        mouse.isHovering = true;
        mouse3D.set(-4.5, 0.6, 0);
      } else if (simulatedState === 'cursor-right') {
        pulseScale = 1.0;
        mouse.targetX = 0.8;
        mouse.targetY = 0.15;
        mouse.isHovering = true;
        mouse3D.set(4.5, 0.6, 0);
      } else if (simulatedState === 'depth') {
        // QA Lab inspection state for 3D depth review
        pulseScale = 1.0;
        mouse.targetX = 0.95;
        mouse.targetY = 0.35;
      } else if (!prefersReducedMotion) {
        const cycle = elapsedTime % 1.2; // 1.2s organic heartbeat cycle

        if (cycle < 0.14) {
          // Primary pulse (Rise)
          const p = cycle / 0.14;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.022;
          pulseLuminance = 1.0 + Math.sin(p * Math.PI) * 0.25;
          pulseWaveProgress = p;
        } else if (cycle < 0.26) {
          // Elastic recoil
          const p = (cycle - 0.14) / 0.12;
          pulseScale = 1.0 + (1 - p) * 0.007;
          pulseWaveProgress = 1.0 + p * 0.5;
        } else if (cycle < 0.38) {
          // Soft secondary diastolic echo
          const p = (cycle - 0.26) / 0.12;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.011;
          pulseLuminance = 1.0 + Math.sin(p * Math.PI) * 0.12;
        } else {
          pulseScale = 1.0;
          pulseLuminance = 1.0;
        }
      }

      rootGroup.scale.set(pulseScale, pulseScale, pulseScale);
      apexSprite.scale.set(0.9 * pulseLuminance, 0.9 * pulseLuminance, 1);

      // --- 2. Parallax Dampening Across Z-Layers ---
      const springFactor = simulatedState !== 'auto' ? 0.12 : 0.045;
      mouse.x += (mouse.targetX - mouse.x) * springFactor;
      mouse.y += (mouse.targetY - mouse.y) * springFactor;

      // Base Master Rotation
      const maxRotY = simulatedState === 'depth' ? 0.32 : 0.1;
      const maxRotX = simulatedState === 'depth' ? 0.18 : 0.06;

      rootGroup.rotation.y = mouse.x * maxRotY;
      rootGroup.rotation.x = -mouse.y * maxRotX;

      // Layer Parallax Differentials
      contourParticlesGroup.position.set(mouse.x * 0.18, mouse.y * 0.14, 0);
      escapingSparksGroup.position.set(mouse.x * 0.22, mouse.y * 0.16, 0);
      coreFilamentsGroup.position.set(mouse.x * 0.12, mouse.y * 0.1, 0);
      backFilamentsGroup.position.set(mouse.x * 0.06, mouse.y * 0.05, 0);
      ambientDustGroup.position.set(mouse.x * 0.04, mouse.y * 0.03, 0);

      // --- 3. Animate Filaments with Procedural Noise & Traveling Electricity ---
      filamentLines.forEach(({ geom, cfg }) => {
        const pos = (geom.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i <= filamentSegments; i++) {
          const t = (i / filamentSegments) * Math.PI * 2;
          // Procedural wave displacement along spline
          const wave = Math.sin(t * cfg.waveFreq + elapsedTime * 1.8) * cfg.waveAmp;
          const pt = getHeartPoint(t, 0.22 * cfg.rMult + wave * 0.05, cfg.zBase + wave);

          // Subtle organic imperfection
          pt.x += Math.cos(t * 7 + elapsedTime) * 0.015;
          pt.y += Math.sin(t * 5 - elapsedTime) * 0.015;

          pos[i * 3] = pt.x;
          pos[i * 3 + 1] = pt.y;
          pos[i * 3 + 2] = pt.z;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 4. Animate Contour Particles (Tangential Circulation + Wave Glow) ---
      const contourPosArr = (contourGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < contourCount; i++) {
        contourT[i] += contourSpeed[i] * delta * 0.35;
        const t = contourT[i];

        // Wave propagation expansion calculation
        const distFromApex = Math.abs(t - Math.PI);
        const waveProximity = Math.max(0, 1.0 - Math.abs(distFromApex - pulseWaveProgress * Math.PI));
        const dynamicSpread = contourRadiusMult[i] + waveProximity * 0.015;

        const pt = getHeartPoint(t, 0.22 * dynamicSpread, contourZOffset[i]);

        let curX = pt.x;
        let curY = pt.y;
        let curZ = pt.z + Math.sin(elapsedTime * 2.2 + i) * 0.04;

        // Subtle Cursor Avoidance & Spring Return
        if (mouse.isHovering && !prefersReducedMotion) {
          const dx = curX - mouse3D.x;
          const dy = curY - mouse3D.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1.6) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / 1.26) * 0.16; // Delicate deflection
            curX += (dx / (dist + 0.001)) * force;
            curY += (dy / (dist + 0.001)) * force;
          }
        }

        contourPosArr[i * 3] = curX;
        contourPosArr[i * 3 + 1] = curY;
        contourPosArr[i * 3 + 2] = curZ;
      }
      contourGeom.attributes.position.needsUpdate = true;

      // --- 5. Animate Escaping Micro-Ember Sparks ---
      const escPosArr = (escapeGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < escapeCount; i++) {
        const d = escapeData[i];
        d.life += delta;

        if (d.life > d.maxLife) {
          // Respawn at contour
          d.life = 0;
          d.tOrigin = Math.random() * Math.PI * 2;
          const pt = getHeartPoint(d.tOrigin, 0.22, (Math.random() - 0.5) * 0.2);
          escPosArr[i * 3] = pt.x;
          escPosArr[i * 3 + 1] = pt.y;
          escPosArr[i * 3 + 2] = pt.z;

          const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.6;
          const spd = 0.003 + Math.random() * 0.007;
          d.vx = Math.cos(angle) * spd;
          d.vy = Math.sin(angle) * spd + 0.0018;
          d.vz = (Math.random() - 0.5) * 0.004;
        } else {
          escPosArr[i * 3] += d.vx;
          escPosArr[i * 3 + 1] += d.vy;
          escPosArr[i * 3 + 2] += d.vz;
        }
      }
      escapeGeom.attributes.position.needsUpdate = true;

      // --- 6. Animate Orbital Loops ---
      const orbPosArr = (orbitalGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < orbitalCount; i++) {
        const orb = orbitalData[i];
        orb.angle += orb.speed * delta * 0.4;
        orbPosArr[i * 3] = Math.cos(orb.angle) * orb.rx;
        orbPosArr[i * 3 + 1] = Math.sin(orb.angle) * orb.ry;
        orbPosArr[i * 3 + 2] = Math.sin(orb.angle) * orb.tilt * 2.0;
      }
      orbitalGeom.attributes.position.needsUpdate = true;

      // --- 7. Animate Ambient Deep Dust ---
      const dustPosArr = (dustGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dustPosArr[i * 3] += dustVelocities[i].x;
        dustPosArr[i * 3 + 1] += dustVelocities[i].y;
        dustPosArr[i * 3 + 2] += dustVelocities[i].z;

        if (dustPosArr[i * 3 + 1] > 5.5) dustPosArr[i * 3 + 1] = -5.5;
        if (dustPosArr[i * 3] > 7.5) dustPosArr[i * 3] = -7.5;
        if (dustPosArr[i * 3] < -7.5) dustPosArr[i * 3] = 7.5;
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
      glowTexture.dispose();
      contourGeom.dispose();
      contourMat.dispose();
      escapeGeom.dispose();
      escapeMat.dispose();
      orbitalGeom.dispose();
      orbitalMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      filamentLines.forEach((f) => {
        f.geom.dispose();
        (f.line.material as THREE.Material).dispose();
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
      className={`relative w-full h-full min-h-[500px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="Experiencia interactiva 3D: Corazón de Luz V2"
    />
  );
};

