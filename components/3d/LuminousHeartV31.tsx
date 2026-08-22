'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LuminousHeartV31Props {
  className?: string;
  enableMouseInteraction?: boolean;
  scale?: number;
  enableEntranceAnimation?: boolean;
  scrollFade?: boolean;
  simulatedState?:
    | 'auto'
    | 'reposo'
    | 'latido'
    | 'flow'
    | 'cursor-left'
    | 'cursor-right'
    | 'depth'
    | 'entrance-frame1'
    | 'entrance-frame2';
}

export const LuminousHeartV31: React.FC<LuminousHeartV31Props> = ({
  className = '',
  enableMouseInteraction = true,
  scale = 1.0,
  enableEntranceAnimation = false,
  scrollFade = false,
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

    // 1. Scene & Camera Setup
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

    // Master Hierarchy Groups for Multi-Layer Parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const haloGroup = new THREE.Group(); // Parallax 0.25x
    const backGroup = new THREE.Group(); // Parallax 0.70x
    const plasmaMassGroup = new THREE.Group(); // Parallax 0.90x
    const coreGroup = new THREE.Group(); // Parallax 1.00x
    const frontGroup = new THREE.Group(); // Parallax 1.15x
    const escapeGroup = new THREE.Group(); // Parallax 1.28x
    const ambientGroup = new THREE.Group(); // Parallax 0.35x

    rootGroup.add(haloGroup);
    rootGroup.add(ambientGroup);
    rootGroup.add(backGroup);
    rootGroup.add(plasmaMassGroup);
    rootGroup.add(coreGroup);
    rootGroup.add(frontGroup);
    rootGroup.add(escapeGroup);

    // Exact Parametric Cardiod Curve Function
    function getHeartPoint(
      t: number,
      radiusScale: number = 0.22,
      zOffset: number = 0,
      asymmetryFactor: number = 1.0
    ): THREE.Vector3 {
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      // Asymmetry modulation for left flanc
      if (Math.sin(t) < 0) {
        x *= asymmetryFactor;
      }

      return new THREE.Vector3(
        x * radiusScale * scale,
        (y - 1.4) * radiusScale * scale,
        zOffset
      );
    }

    // Normal vector perpendicular to the 2D heart curve at parameter t
    function getHeartNormal(t: number): THREE.Vector2 {
      // Tangent dx/dt, dy/dt
      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy =
        -13 * Math.sin(t) +
        10 * Math.sin(2 * t) +
        6 * Math.sin(3 * t) +
        4 * Math.sin(4 * t);
      // Perpendicular normal: (-dy, dx)
      const nx = -dy;
      const ny = dx;
      const len = Math.sqrt(nx * nx + ny * ny) || 1;
      return new THREE.Vector2(nx / len, ny / len);
    }

    // High-Resolution Soft Glow Texture
    function createGlowMap(): THREE.Texture {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.14, 'rgba(200, 248, 255, 0.92)');
      grad.addColorStop(0.32, 'rgba(0, 240, 255, 0.70)');
      grad.addColorStop(0.60, 'rgba(0, 168, 232, 0.25)');
      grad.addColorStop(0.85, 'rgba(0, 70, 140, 0.06)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const glowTexture = createGlowMap();

    // ==========================================================
    // LAYER 1: Atmospheric Ambient Halo (Faint 8-12% Cyan Aura)
    // ==========================================================
    const haloSegments = 120;
    const haloPositions = new Float32Array((haloSegments + 1) * 3);
    for (let i = 0; i <= haloSegments; i++) {
      const t = (i / haloSegments) * Math.PI * 2;
      const pt = getHeartPoint(t, 0.235, -0.4);
      haloPositions[i * 3] = pt.x;
      haloPositions[i * 3 + 1] = pt.y;
      haloPositions[i * 3 + 2] = pt.z;
    }
    const haloGeom = new THREE.BufferGeometry();
    haloGeom.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3));
    const haloMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const haloLine = new THREE.Line(haloGeom, haloMat);
    haloGroup.add(haloLine);

    // ==========================================================
    // LAYER 2: Volumetric Plasma Light Ribbon (Fills dark gaps between lines)
    // ==========================================================
    const ribbonSegments = isMobile ? 120 : 220;
    const ribbonVertices = new Float32Array((ribbonSegments + 1) * 2 * 3);
    const ribbonColors = new Float32Array((ribbonSegments + 1) * 2 * 3);
    const ribbonIndices: number[] = [];

    for (let i = 0; i < ribbonSegments; i++) {
      const i1 = i * 2;
      const i2 = i * 2 + 1;
      const i3 = (i + 1) * 2;
      const i4 = (i + 1) * 2 + 1;
      ribbonIndices.push(i1, i2, i3);
      ribbonIndices.push(i2, i4, i3);
    }

    const ribbonGeom = new THREE.BufferGeometry();
    ribbonGeom.setAttribute('position', new THREE.BufferAttribute(ribbonVertices, 3));
    ribbonGeom.setAttribute('color', new THREE.BufferAttribute(ribbonColors, 3));
    ribbonGeom.setIndex(ribbonIndices);

    const ribbonMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
    plasmaMassGroup.add(ribbonMesh);

    // ==========================================================
    // LAYER 3: 7 Cross-Weaving & Braiding Dynamic Filaments
    // ==========================================================
    const filamentConfigs = [
      // 1. Hot Core Energy Strand (Pure White-Cyan)
      { color: 0xffffff, opacity: 0.94, phase: 0.0, rBase: 1.00, zBase: 0.0, freq: 3.5, amp: 0.035, speed: 2.0, group: coreGroup },
      // 2. Front Cyan Ribbon Wave (Braids over core)
      { color: 0x00f0ff, opacity: 0.86, phase: 1.2, rBase: 1.015, zBase: 0.14, freq: 4.8, amp: 0.065, speed: 2.4, group: frontGroup },
      // 3. Front Aqua Weave Strand (Crosses back and forth)
      { color: 0x7df9ff, opacity: 0.80, phase: 2.4, rBase: 0.985, zBase: 0.22, freq: 5.4, amp: 0.075, speed: 1.8, group: frontGroup },
      // 4. Spiral Braided Strand (Intertwines continuously)
      { color: 0x00d2e0, opacity: 0.74, phase: 3.6, rBase: 1.025, zBase: 0.05, freq: 6.2, amp: 0.080, speed: 2.8, group: coreGroup },
      // 5. Deep Turquoise Mid-Back Strand
      { color: 0x00a8e8, opacity: 0.58, phase: 4.5, rBase: 0.970, zBase: -0.18, freq: 3.2, amp: 0.090, speed: 1.5, group: backGroup },
      // 6. Ethereal Outer Glow Strand
      { color: 0x0077b6, opacity: 0.40, phase: 5.2, rBase: 1.045, zBase: -0.28, freq: 4.0, amp: 0.110, speed: 1.1, group: backGroup },
      // 7. Inner Whispering Ribbon
      { color: 0x004e89, opacity: 0.32, phase: 6.0, rBase: 0.950, zBase: -0.10, freq: 4.6, amp: 0.055, speed: 1.7, group: backGroup },
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
    // LAYER 4: 5 Natural Escaping Tendrils (Fluid Energy Arcs)
    // ==========================================================
    const tendrilConfigs = [
      // 1. Left Upper Lobe Sweeping Tendril
      { tStart: 0.68 * Math.PI, length: 1.5, dir: new THREE.Vector3(-0.55, 0.65, 0.18), color: 0x00f0ff, opacity: 0.60 },
      // 2. Right Upper Lobe Sweeping Tendril
      { tStart: 1.32 * Math.PI, length: 1.5, dir: new THREE.Vector3(0.55, 0.65, -0.18), color: 0x7df9ff, opacity: 0.60 },
      // 3. Left Flank Downward Wisp
      { tStart: 0.38 * Math.PI, length: 1.3, dir: new THREE.Vector3(-0.75, -0.35, 0.12), color: 0x00d2e0, opacity: 0.48 },
      // 4. Right Flank Downward Wisp
      { tStart: 1.62 * Math.PI, length: 1.3, dir: new THREE.Vector3(0.75, -0.35, -0.12), color: 0x00a8e8, opacity: 0.48 },
      // 5. Crown Ethereal Arch (Top Notch Loop)
      { tStart: 0.02 * Math.PI, length: 1.0, dir: new THREE.Vector3(0.0, 0.55, 0.08), color: 0xffffff, opacity: 0.55 },
    ];

    const tendrilSegments = 36;
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
    // LAYER 5: Directional Flow Particles (2,600 Points)
    // ==========================================================
    const flowCount = isMobile ? 1100 : 2600;
    const flowPos = new Float32Array(flowCount * 3);
    const flowColors = new Float32Array(flowCount * 3);
    const flowT = new Float32Array(flowCount);
    const flowSpeed = new Float32Array(flowCount);
    const flowFilamentIdx = new Float32Array(flowCount);
    const flowScatter = new Float32Array(flowCount * 3);

    const cyanPalette = [
      new THREE.Color('#FFFFFF'), // Pure Core Hot Spark
      new THREE.Color('#C8F8FF'), // White-Cyan Luminous
      new THREE.Color('#7DF9FF'), // Electric Aqua
      new THREE.Color('#00F0FF'), // Vivid Cyan
      new THREE.Color('#00D2E0'), // Bright Turquoise
      new THREE.Color('#00A8E8'), // Deep Cyan
    ];

    for (let i = 0; i < flowCount; i++) {
      const t = Math.random() * Math.PI * 2;
      flowT[i] = t;
      flowSpeed[i] = (0.18 + Math.random() * 0.34) * (Math.random() > 0.2 ? 1 : -1);
      const fIdx = Math.floor(Math.random() * filamentConfigs.length);
      flowFilamentIdx[i] = fIdx;

      flowScatter[i * 3] = (Math.random() - 0.5) * 0.06;
      flowScatter[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      flowScatter[i * 3 + 2] = (Math.random() - 0.5) * 0.22;

      const cfg = filamentConfigs[fIdx];
      const pt = getHeartPoint(t, 0.22 * cfg.rBase, cfg.zBase + flowScatter[i * 3 + 2]);
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
      size: isMobile ? 0.22 : 0.28,
      map: glowTexture,
      transparent: true,
      opacity: 0.88,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const flowPoints = new THREE.Points(flowGeom, flowMat);
    coreGroup.add(flowPoints);

    // ==========================================================
    // LAYER 6: Plasma Mass Micro-Dust (1,200 Fine Points between Strands)
    // ==========================================================
    const plasmaCount = isMobile ? 400 : 1200;
    const plasmaPos = new Float32Array(plasmaCount * 3);
    const plasmaColors = new Float32Array(plasmaCount * 3);
    const plasmaT = new Float32Array(plasmaCount);
    const plasmaSpeed = new Float32Array(plasmaCount);
    const plasmaOffset = new Float32Array(plasmaCount * 3);

    for (let i = 0; i < plasmaCount; i++) {
      const t = Math.random() * Math.PI * 2;
      plasmaT[i] = t;
      plasmaSpeed[i] = (0.08 + Math.random() * 0.20) * (Math.random() > 0.5 ? 1 : -1);

      plasmaOffset[i * 3] = (Math.random() - 0.5) * 0.12;
      plasmaOffset[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      plasmaOffset[i * 3 + 2] = (Math.random() - 0.5) * 0.28;

      const pt = getHeartPoint(t, 0.22, plasmaOffset[i * 3 + 2]);
      plasmaPos[i * 3] = pt.x + plasmaOffset[i * 3];
      plasmaPos[i * 3 + 1] = pt.y + plasmaOffset[i * 3 + 1];
      plasmaPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * 3 + 2)]; // Cyan to Turquoise
      plasmaColors[i * 3] = col.r;
      plasmaColors[i * 3 + 1] = col.g;
      plasmaColors[i * 3 + 2] = col.b;
    }

    const plasmaGeom = new THREE.BufferGeometry();
    plasmaGeom.setAttribute('position', new THREE.BufferAttribute(plasmaPos, 3));
    plasmaGeom.setAttribute('color', new THREE.BufferAttribute(plasmaColors, 3));

    const plasmaDustMat = new THREE.PointsMaterial({
      size: 0.14,
      map: glowTexture,
      transparent: true,
      opacity: 0.40,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const plasmaDustPoints = new THREE.Points(plasmaGeom, plasmaDustMat);
    plasmaMassGroup.add(plasmaDustPoints);

    // ==========================================================
    // LAYER 7: Escaping Micro-Sparks (500 Points)
    // ==========================================================
    const escapeCount = isMobile ? 180 : 500;
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
      const pt = getHeartPoint(t, 0.22, (Math.random() - 0.5) * 0.25);
      escPos[i * 3] = pt.x;
      escPos[i * 3 + 1] = pt.y;
      escPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * 3)];
      escColors[i * 3] = col.r;
      escColors[i * 3 + 1] = col.g;
      escColors[i * 3 + 2] = col.b;

      const maxLife = 1.3 + Math.random() * 2.0;
      const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.45;
      const speed = 0.003 + Math.random() * 0.007;

      escData.push({
        tOrigin: t,
        life: Math.random() * maxLife,
        maxLife,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.0016,
        vz: (Math.random() - 0.5) * 0.003,
      });
    }

    const escGeom = new THREE.BufferGeometry();
    escGeom.setAttribute('position', new THREE.BufferAttribute(escPos, 3));
    escGeom.setAttribute('color', new THREE.BufferAttribute(escColors, 3));

    const escMat = new THREE.PointsMaterial({
      size: 0.18,
      map: glowTexture,
      transparent: true,
      opacity: 0.70,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const escPoints = new THREE.Points(escGeom, escMat);
    escapeGroup.add(escPoints);

    // ==========================================================
    // LAYER 8: Deep Space & Hollow Interior Ambient Dust (350 Points)
    // ==========================================================
    const dustCount = isMobile ? 150 : 350;
    const dustPos = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      const isInterior = Math.random() < 0.12;
      if (isInterior) {
        dustPos[i * 3] = (Math.random() - 0.5) * 2.0;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      } else {
        dustPos[i * 3] = (Math.random() - 0.5) * 15.0;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 7.0;
      }

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.0016,
        y: (Math.random() - 0.5) * 0.0016 + 0.0010,
        z: (Math.random() - 0.5) * 0.0012,
      });
    }

    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.10,
      map: glowTexture,
      transparent: true,
      opacity: 0.32,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustPoints = new THREE.Points(dustGeom, dustMat);
    ambientGroup.add(dustPoints);

    // ==========================================================
    // LAYER 9: Subtle Integrated Apex Convergence Sprite
    // ==========================================================
    const apexPt = getHeartPoint(Math.PI, 0.22, 0);
    const apexSpriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
    });
    const apexSprite = new THREE.Sprite(apexSpriteMat);
    apexSprite.position.copy(apexPt);
    apexSprite.scale.set(0.55, 0.55, 1);
    coreGroup.add(apexSprite);

    // ==========================================================
    // INTERACTION & CAPPED MICRO-CURSOR SPRINGS
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
      mouse3D.set(x * 5.0, y * 3.4, 0);
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
    // ANIMATION LOOP (Braiding Dynamics & Traveling Energy Nodes)
    // ==========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    // Traveling Energy Packet Locations
    const energyPackets = [
      { t: 0.0, speed: 1.6, width: 0.35 },
      { t: Math.PI * 0.7, speed: 1.9, width: 0.40 },
      { t: Math.PI * 1.4, speed: 1.4, width: 0.30 },
    ];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // Update Traveling Energy Packets
      energyPackets.forEach((ep) => {
        ep.t = (ep.t + delta * ep.speed) % (Math.PI * 2);
      });

      // --- 1. Contemplative Pulse & Entrance Sequencing ---
      let pulseScale = 1.0;
      let pulseLuminance = 1.0;
      let waveProgress = 0.0;
      let globalOpacity = 1.0;

      // Scroll Fade Logic
      if (scrollFade && typeof window !== 'undefined') {
        const scrollY = window.scrollY || 0;
        const fadeProgress = Math.min(scrollY / 420, 1.0);
        globalOpacity = 1.0 - fadeProgress * 0.95;
        rootGroup.position.y = -fadeProgress * 0.6;
      }

      // Entrance Timeline (0.0s to 1.8s)
      let entranceFactor = 1.0;
      if (simulatedState === 'entrance-frame1') {
        entranceFactor = 0.25;
        pulseScale = 0.98;
        pulseLuminance = 0.6;
      } else if (simulatedState === 'entrance-frame2') {
        entranceFactor = 0.65;
        pulseScale = 1.0;
        pulseLuminance = 0.85;
      } else if (enableEntranceAnimation && !prefersReducedMotion) {
        entranceFactor = Math.min(elapsedTime / 1.8, 1.0);
      }

      if (simulatedState === 'reposo') {
        pulseScale = 1.0;
        pulseLuminance = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'latido') {
        pulseScale = 1.018;
        pulseLuminance = 1.20;
        waveProgress = 0.5;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'flow') {
        pulseScale = 1.0;
        pulseLuminance = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'cursor-left') {
        pulseScale = 1.0;
        mouse.targetX = -0.70;
        mouse.targetY = 0.10;
        mouse.isHovering = true;
        mouse3D.set(-3.5, 0.35, 0);
      } else if (simulatedState === 'cursor-right') {
        pulseScale = 1.0;
        mouse.targetX = 0.70;
        mouse.targetY = 0.10;
        mouse.isHovering = true;
        mouse3D.set(3.5, 0.35, 0);
      } else if (simulatedState === 'depth') {
        pulseScale = 1.0;
        mouse.targetX = 0.85;
        mouse.targetY = 0.25;
      } else if (!prefersReducedMotion) {
        const cycle = elapsedTime % 1.2; // 1.20s cycle (~50 BPM)

        if (cycle < 0.14) {
          const p = cycle / 0.14;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.018;
          pulseLuminance = 1.0 + Math.sin(p * Math.PI) * 0.20;
          waveProgress = p;
        } else if (cycle < 0.34) {
          const p = (cycle - 0.14) / 0.20;
          pulseScale = 1.0 + (1 - p) * 0.005;
          waveProgress = 1.0 + p;
        } else if (cycle < 0.48) {
          const p = (cycle - 0.34) / 0.14;
          pulseScale = 1.0;
          pulseLuminance = 1.0 + (1 - p) * 0.06;
        } else {
          pulseScale = 1.0;
          pulseLuminance = 1.0;
        }
      }

      rootGroup.scale.set(pulseScale * Math.min(1.0, 0.85 + entranceFactor * 0.15), pulseScale * Math.min(1.0, 0.85 + entranceFactor * 0.15), pulseScale);
      apexSprite.scale.set(0.55 * pulseLuminance * entranceFactor, 0.55 * pulseLuminance * entranceFactor, 1);
      haloLine.scale.set(1.0 + (pulseScale - 1.0) * 0.8, 1.0 + (pulseScale - 1.0) * 0.8, 1);
      (haloLine.material as THREE.LineBasicMaterial).opacity = 0.12 * globalOpacity * Math.max(0, (entranceFactor - 0.5) * 2);
      (ribbonMat as THREE.MeshBasicMaterial).opacity = 0.38 * globalOpacity * Math.max(0, (entranceFactor - 0.3) * 1.4);

      // --- 2. Parallax Dampening: Max 2.6° in Y, 1.7° in X ---
      const springFactor = simulatedState !== 'auto' ? 0.12 : 0.038;
      mouse.x += (mouse.targetX - mouse.x) * springFactor;
      mouse.y += (mouse.targetY - mouse.y) * springFactor;

      const maxRotY = simulatedState === 'depth' ? 0.26 : 0.045; // ~2.6°
      const maxRotX = simulatedState === 'depth' ? 0.15 : 0.030; // ~1.7°

      rootGroup.rotation.y = mouse.x * maxRotY;
      rootGroup.rotation.x = -mouse.y * maxRotX;

      // Layer Parallax Differentials
      escapeGroup.position.set(mouse.x * 0.15, mouse.y * 0.11, 0); // 1.28x
      frontGroup.position.set(mouse.x * 0.13, mouse.y * 0.09, 0); // 1.15x
      coreGroup.position.set(mouse.x * 0.10, mouse.y * 0.07, 0); // 1.00x
      plasmaMassGroup.position.set(mouse.x * 0.09, mouse.y * 0.06, 0); // 0.90x
      backGroup.position.set(mouse.x * 0.06, mouse.y * 0.04, 0); // 0.70x
      ambientGroup.position.set(mouse.x * 0.03, mouse.y * 0.02, 0); // 0.35x
      haloGroup.position.set(mouse.x * 0.02, mouse.y * 0.015, 0); // 0.25x

      // Slow dynamic asymmetry cycle (6s period)
      const asymmetry = 1.0 + Math.sin(elapsedTime * 1.04) * 0.028;

      // --- 3. Animate Volumetric Light Ribbon (Plasma Mass) ---
      const ribbonPosArr = (ribbonGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const ribbonColArr = (ribbonGeom.attributes.color as THREE.BufferAttribute).array as Float32Array;

      const halfWidth = 0.08 * (isMobile ? 0.8 : 1.0);

      for (let i = 0; i <= ribbonSegments; i++) {
        const t = (i / ribbonSegments) * Math.PI * 2;
        const norm = getHeartNormal(t);
        const centerPt = getHeartPoint(t, 0.22, 0.0, asymmetry);

        // Calculate traveling energy hotspot intensity
        let hotIntensity = 0.0;
        energyPackets.forEach((ep) => {
          const diff = Math.abs(t - ep.t);
          const circDiff = Math.min(diff, Math.PI * 2 - diff);
          if (circDiff < ep.width) {
            hotIntensity = Math.max(hotIntensity, 1.0 - circDiff / ep.width);
          }
        });

        // Inner & Outer ribbon edges
        const pInnerX = centerPt.x - norm.x * halfWidth;
        const pInnerY = centerPt.y - norm.y * halfWidth;
        const pOuterX = centerPt.x + norm.x * halfWidth;
        const pOuterY = centerPt.y + norm.y * halfWidth;

        const idx1 = i * 2;
        const idx2 = i * 2 + 1;

        ribbonPosArr[idx1 * 3] = pInnerX;
        ribbonPosArr[idx1 * 3 + 1] = pInnerY;
        ribbonPosArr[idx1 * 3 + 2] = centerPt.z - 0.05;

        ribbonPosArr[idx2 * 3] = pOuterX;
        ribbonPosArr[idx2 * 3 + 1] = pOuterY;
        ribbonPosArr[idx2 * 3 + 2] = centerPt.z + 0.05;

        // Color interpolation based on hotspots
        const rVal = 0.0 + hotIntensity * 0.85;
        const gVal = 0.75 + hotIntensity * 0.25;
        const bVal = 0.95;

        ribbonColArr[idx1 * 3] = rVal;
        ribbonColArr[idx1 * 3 + 1] = gVal;
        ribbonColArr[idx1 * 3 + 2] = bVal;

        ribbonColArr[idx2 * 3] = rVal * 0.7;
        ribbonColArr[idx2 * 3 + 1] = gVal * 0.85;
        ribbonColArr[idx2 * 3 + 2] = bVal;
      }
      ribbonGeom.attributes.position.needsUpdate = true;
      ribbonGeom.attributes.color.needsUpdate = true;

      // --- 4. Animate 7 Weaving & Braiding Filaments ---
      filamentLines.forEach(({ geom, cfg }) => {
        const pos = (geom.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i <= filamentSegments; i++) {
          const t = (i / filamentSegments) * Math.PI * 2;

          // Cross-weaving radial & Z-modulation: strands weave over & under each other
          const weaveR = Math.sin(t * cfg.freq + cfg.phase + elapsedTime * cfg.speed) * cfg.amp;
          const weaveZ = Math.cos(t * (cfg.freq * 0.8) + cfg.phase + elapsedTime * (cfg.speed * 0.7)) * 0.14;

          const pt = getHeartPoint(t, 0.22 * cfg.rBase + weaveR * 0.04, cfg.zBase + weaveZ, asymmetry);

          // Micro-organic noise
          pt.x += Math.cos(t * 5 + elapsedTime * 1.4) * 0.010;
          pt.y += Math.sin(t * 3.5 - elapsedTime * 1.1) * 0.010;

          pos[i * 3] = pt.x;
          pos[i * 3 + 1] = pt.y;
          pos[i * 3 + 2] = pt.z;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 5. Animate 5 Escaping Tendrils ---
      tendrilLines.forEach(({ geom, cfg }) => {
        const pos = (geom.attributes.position as THREE.BufferAttribute).array as Float32Array;
        const originPt = getHeartPoint(cfg.tStart, 0.22, 0, asymmetry);

        for (let i = 0; i <= tendrilSegments; i++) {
          const progress = i / tendrilSegments;
          const reach = progress * cfg.length;
          const wiggle = Math.sin(progress * 3.5 - elapsedTime * 2.2) * 0.07 * progress;

          const px = originPt.x + cfg.dir.x * reach + wiggle;
          const py = originPt.y + cfg.dir.y * reach + wiggle * 0.5;
          const pz = originPt.z + cfg.dir.z * reach + wiggle * 0.7;

          pos[i * 3] = px;
          pos[i * 3 + 1] = py;
          pos[i * 3 + 2] = pz;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 6. Animate Flow Particles (Canalized with Traveling Hotspots) ---
      const flowPosArr = (flowGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < flowCount; i++) {
        flowT[i] += flowSpeed[i] * delta * 0.38;
        const t = flowT[i];
        const fIdx = flowFilamentIdx[i];
        const cfg = filamentConfigs[fIdx];

        const distFromApex = Math.abs(t - Math.PI);
        const waveReach = Math.max(0, 1.0 - Math.abs(distFromApex - waveProgress * Math.PI));
        const dynamicSpread = cfg.rBase + waveReach * 0.010;

        const weaveZ = Math.cos(t * 3.5 + cfg.phase + elapsedTime * 1.5) * 0.12;
        const pt = getHeartPoint(t, 0.22 * dynamicSpread, cfg.zBase + weaveZ + flowScatter[i * 3 + 2], asymmetry);

        let curX = pt.x + flowScatter[i * 3];
        let curY = pt.y + flowScatter[i * 3 + 1];
        let curZ = pt.z;

        // Micro-Cursor Deflection
        if (mouse.isHovering && !prefersReducedMotion) {
          const dx = curX - mouse3D.x;
          const dy = curY - mouse3D.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1.3) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / 1.14) * 0.10;
            curX += (dx / (dist + 0.001)) * force;
            curY += (dy / (dist + 0.001)) * force;
          }
        }

        flowPosArr[i * 3] = curX;
        flowPosArr[i * 3 + 1] = curY;
        flowPosArr[i * 3 + 2] = curZ;
      }
      flowGeom.attributes.position.needsUpdate = true;

      // --- 7. Animate Plasma Mass Micro-Dust ---
      const plasmaPosArr = (plasmaGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < plasmaCount; i++) {
        plasmaT[i] += plasmaSpeed[i] * delta * 0.30;
        const t = plasmaT[i];
        const pt = getHeartPoint(t, 0.22, plasmaOffset[i * 3 + 2], asymmetry);

        plasmaPosArr[i * 3] = pt.x + plasmaOffset[i * 3];
        plasmaPosArr[i * 3 + 1] = pt.y + plasmaOffset[i * 3 + 1];
        plasmaPosArr[i * 3 + 2] = pt.z + Math.sin(elapsedTime * 2.0 + i) * 0.02;
      }
      plasmaGeom.attributes.position.needsUpdate = true;

      // --- 8. Animate Escaping Micro-Sparks ---
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

          const angle = Math.atan2(pt.y, pt.x) + (Math.random() - 0.5) * 0.45;
          const spd = 0.003 + Math.random() * 0.006;
          d.vx = Math.cos(angle) * spd;
          d.vy = Math.sin(angle) * spd + 0.0014;
          d.vz = (Math.random() - 0.5) * 0.0025;
        } else {
          escPosArr[i * 3] += d.vx;
          escPosArr[i * 3 + 1] += d.vy;
          escPosArr[i * 3 + 2] += d.vz;
        }
      }
      escGeom.attributes.position.needsUpdate = true;

      // --- 9. Animate Ambient Deep Dust ---
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
      glowTexture.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      ribbonGeom.dispose();
      ribbonMat.dispose();
      flowGeom.dispose();
      flowMat.dispose();
      plasmaGeom.dispose();
      plasmaDustMat.dispose();
      escGeom.dispose();
      escMat.dispose();
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
      aria-label="Experiencia interactiva 3D: Corazón de Luz V3.1 Organic"
    />
  );
};

