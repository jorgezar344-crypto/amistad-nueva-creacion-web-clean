'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FullHeroHeartSceneProps {
  className?: string;
  enableMouseInteraction?: boolean;
  simulatedState?:
    | 'auto'
    | 'reposo'
    | 'latido'
    | 'particle-field'
    | 'cursor-left'
    | 'cursor-center'
    | 'cursor-right'
    | 'scroll-state';
}

export const FullHeroHeartScene: React.FC<FullHeroHeartSceneProps> = ({
  className = '',
  enableMouseInteraction = true,
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
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    const isMobileInitial = initialWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileInitial ? 1.5 : 2.0);

    // Dynamic responsive parameters calculator based on viewport dimensions
    function getResponsiveLayout(w: number, h: number) {
      const aspect = w / h;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      const isShortScreen = h < 700;

      let targetScale = 1.02;
      let targetOffsetX = 3.0;
      let targetOffsetY = 0.15;

      if (isMobile) {
        // ENVELOPING MOBILE HEART: ~115% - 130% of viewport width
        // Base cardioide geometry is 7.04 world units wide.
        // Visible world width at Z=14.5 is ~10.555 * aspect.
        const visibleWorldWidth = 10.555 * aspect;

        if (h <= 600) {
          // 320x568 / ultra compact: 110% of visible width
          targetScale = THREE.MathUtils.clamp((visibleWorldWidth * 1.10) / 7.04, 0.72, 0.80);
          targetOffsetY = 0.85; // Raised behind headline
        } else if (h <= 700) {
          // 375x667 / iPhone SE: 115% of visible width
          targetScale = THREE.MathUtils.clamp((visibleWorldWidth * 1.15) / 7.04, 0.78, 0.86);
          targetOffsetY = 0.95; // Raised behind headline
        } else if (h <= 820) {
          // 360x800, 375x812: 122% of visible width
          targetScale = THREE.MathUtils.clamp((visibleWorldWidth * 1.22) / 7.04, 0.82, 0.90);
          targetOffsetY = 1.10; // Embracing headline
        } else {
          // 390x844, 430x932 (Tall flagships): 126% of visible width
          targetScale = THREE.MathUtils.clamp((visibleWorldWidth * 1.26) / 7.04, 0.85, 0.94);
          targetOffsetY = 1.20; // Embracing headline
        }
        targetOffsetX = 0.0; // Centered on mobile
      } else if (isTablet) {
        targetScale = 0.82;
        targetOffsetX = 1.8;
        targetOffsetY = 0.0;
      } else {
        // Desktop (100% UNCHANGED)
        targetScale = 1.02;
        targetOffsetX = 3.0;
        targetOffsetY = 0.15;
      }

      return { targetScale, targetOffsetX, targetOffsetY, isMobile, isTablet, isShortScreen, aspect };
    }

    const initialLayout = getResponsiveLayout(initialWidth, initialHeight);
    const layoutRef = { current: initialLayout };
    const isMobile = initialLayout.isMobile;
    const isTablet = initialLayout.isTablet;

    // 1. Scene & Perspective Camera covering entire screen
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      initialLayout.aspect,
      0.1,
      100
    );
    camera.position.set(0, 0, 14.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !initialLayout.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Master Hierarchy Groups
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Heart Anchor: Positioned at Center-Right on Desktop, Centered-Lower on Mobile
    const heartGroup = new THREE.Group();
    heartGroup.position.set(initialLayout.targetOffsetX, initialLayout.targetOffsetY, 0);
    heartGroup.scale.set(initialLayout.targetScale, initialLayout.targetScale, initialLayout.targetScale);
    rootGroup.add(heartGroup);

    // Multi-Layer Subgroups
    const haloGroup = new THREE.Group();
    const backGroup = new THREE.Group();
    const plasmaMassGroup = new THREE.Group();
    const coreGroup = new THREE.Group();
    const frontGroup = new THREE.Group();
    const tendrilGroup = new THREE.Group();

    heartGroup.add(haloGroup);
    heartGroup.add(backGroup);
    heartGroup.add(plasmaMassGroup);
    heartGroup.add(coreGroup);
    heartGroup.add(frontGroup);
    heartGroup.add(tendrilGroup);

    // Full-Screen Scene Particle Groups (Relative to rootGroup, not offset heartGroup)
    const sceneFieldGroup = new THREE.Group();
    const sceneAmbientGroup = new THREE.Group();
    const sceneBokehGroup = new THREE.Group();

    rootGroup.add(sceneAmbientGroup);
    rootGroup.add(sceneFieldGroup);
    rootGroup.add(sceneBokehGroup);

    // Exact Parametric Cardioide Function
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

      if (Math.sin(t) < 0) {
        x *= asymmetryFactor;
      }

      return new THREE.Vector3(
        x * radiusScale,
        (y - 1.4) * radiusScale,
        zOffset
      );
    }

    // Normal vector perpendicular to the 2D heart curve at parameter t
    function getHeartNormal(t: number): THREE.Vector2 {
      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy =
        -13 * Math.sin(t) +
        10 * Math.sin(2 * t) +
        6 * Math.sin(3 * t) +
        4 * Math.sin(4 * t);
      const nx = -dy;
      const ny = dx;
      const len = Math.sqrt(nx * nx + ny * ny) || 1;
      return new THREE.Vector2(nx / len, ny / len);
    }

    // High-Resolution Radial Glow Texture
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
    // LAYER 1: Atmospheric Ambient Halo
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
    // LAYER 2: Volumetric Plasma Light Ribbon
    // ==========================================================
    const ribbonSegments = isMobile ? 100 : 200;
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
    // LAYER 3: 7 Cross-Weaving & Braiding Filaments
    // ==========================================================
    const filamentConfigs = [
      { color: 0xffffff, opacity: 0.94, phase: 0.0, rBase: 1.00, zBase: 0.0, freq: 3.5, amp: 0.035, speed: 2.0, group: coreGroup },
      { color: 0x00f0ff, opacity: 0.86, phase: 1.2, rBase: 1.015, zBase: 0.14, freq: 4.8, amp: 0.065, speed: 2.4, group: frontGroup },
      { color: 0x7df9ff, opacity: 0.80, phase: 2.4, rBase: 0.985, zBase: 0.22, freq: 5.4, amp: 0.075, speed: 1.8, group: frontGroup },
      { color: 0x00d2e0, opacity: 0.74, phase: 3.6, rBase: 1.025, zBase: 0.05, freq: 6.2, amp: 0.080, speed: 2.8, group: coreGroup },
      { color: 0x00a8e8, opacity: 0.58, phase: 4.5, rBase: 0.970, zBase: -0.18, freq: 3.2, amp: 0.090, speed: 1.5, group: backGroup },
      { color: 0x0077b6, opacity: 0.40, phase: 5.2, rBase: 1.045, zBase: -0.28, freq: 4.0, amp: 0.110, speed: 1.1, group: backGroup },
      { color: 0x004e89, opacity: 0.32, phase: 6.0, rBase: 0.950, zBase: -0.10, freq: 4.6, amp: 0.055, speed: 1.7, group: backGroup },
    ];

    const filamentSegments = isMobile ? 140 : 260;
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
    // LAYER 4: 5 Escaping Tendrils
    // ==========================================================
    const tendrilConfigs = [
      { tStart: 0.68 * Math.PI, length: 1.5, dir: new THREE.Vector3(-0.55, 0.65, 0.18), color: 0x00f0ff, opacity: 0.60 },
      { tStart: 1.32 * Math.PI, length: 1.5, dir: new THREE.Vector3(0.55, 0.65, -0.18), color: 0x7df9ff, opacity: 0.60 },
      { tStart: 0.38 * Math.PI, length: 1.3, dir: new THREE.Vector3(-0.75, -0.35, 0.12), color: 0x00d2e0, opacity: 0.48 },
      { tStart: 1.62 * Math.PI, length: 1.3, dir: new THREE.Vector3(0.75, -0.35, -0.12), color: 0x00a8e8, opacity: 0.48 },
      { tStart: 0.02 * Math.PI, length: 1.0, dir: new THREE.Vector3(0.0, 0.55, 0.08), color: 0xffffff, opacity: 0.55 },
    ];

    const tendrilSegments = 30;
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
        tendrilGroup.add(line);
        tendrilLines.push({ line, geom, cfg });
      });
    }

    // ==========================================================
    // LAYER 5: Heart-Bound Flow Particles (1,800 Points)
    // ==========================================================
    const heartFlowCount = isMobile ? 800 : 1800;
    const heartFlowPos = new Float32Array(heartFlowCount * 3);
    const heartFlowColors = new Float32Array(heartFlowCount * 3);
    const heartFlowT = new Float32Array(heartFlowCount);
    const heartFlowSpeed = new Float32Array(heartFlowCount);
    const heartFlowFilamentIdx = new Float32Array(heartFlowCount);
    const heartFlowScatter = new Float32Array(heartFlowCount * 3);

    const cyanPalette = [
      new THREE.Color('#FFFFFF'), // Hot Spark
      new THREE.Color('#C8F8FF'), // White-Cyan Luminous
      new THREE.Color('#7DF9FF'), // Electric Aqua
      new THREE.Color('#00F0FF'), // Vivid Cyan
      new THREE.Color('#00D2E0'), // Bright Turquoise
      new THREE.Color('#00A8E8'), // Deep Cyan
    ];

    for (let i = 0; i < heartFlowCount; i++) {
      const t = Math.random() * Math.PI * 2;
      heartFlowT[i] = t;
      heartFlowSpeed[i] = (0.18 + Math.random() * 0.34) * (Math.random() > 0.2 ? 1 : -1);
      const fIdx = Math.floor(Math.random() * filamentConfigs.length);
      heartFlowFilamentIdx[i] = fIdx;

      heartFlowScatter[i * 3] = (Math.random() - 0.5) * 0.06;
      heartFlowScatter[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      heartFlowScatter[i * 3 + 2] = (Math.random() - 0.5) * 0.22;

      const cfg = filamentConfigs[fIdx];
      const pt = getHeartPoint(t, 0.22 * cfg.rBase, cfg.zBase + heartFlowScatter[i * 3 + 2]);
      heartFlowPos[i * 3] = pt.x + heartFlowScatter[i * 3];
      heartFlowPos[i * 3 + 1] = pt.y + heartFlowScatter[i * 3 + 1];
      heartFlowPos[i * 3 + 2] = pt.z;

      const col = cyanPalette[Math.floor(Math.random() * cyanPalette.length)];
      heartFlowColors[i * 3] = col.r;
      heartFlowColors[i * 3 + 1] = col.g;
      heartFlowColors[i * 3 + 2] = col.b;
    }

    const heartFlowGeom = new THREE.BufferGeometry();
    heartFlowGeom.setAttribute('position', new THREE.BufferAttribute(heartFlowPos, 3));
    heartFlowGeom.setAttribute('color', new THREE.BufferAttribute(heartFlowColors, 3));

    const heartFlowMat = new THREE.PointsMaterial({
      size: isMobile ? 0.20 : 0.26,
      map: glowTexture,
      transparent: true,
      opacity: 0.88,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const heartFlowPoints = new THREE.Points(heartFlowGeom, heartFlowMat);
    coreGroup.add(heartFlowPoints);

    // ==========================================================
    // LAYER 6: Full-Hero Emanating Particle Field (1,500 Points Across Screen)
    // ==========================================================
    const heroFieldCount = isMobile ? 450 : 1500;
    const heroFieldPos = new Float32Array(heroFieldCount * 3);
    const heroFieldColors = new Float32Array(heroFieldCount * 3);
    const heroFieldData: {
      tBirth: number;
      life: number;
      maxLife: number;
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      baseAlpha: number;
      targetOffset: THREE.Vector3;
    }[] = [];

    for (let i = 0; i < heroFieldCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const birthPt = getHeartPoint(t, 0.22, (Math.random() - 0.5) * 0.3);
      // World birth position (taking heart offset into account)
      const worldX = birthPt.x + initialLayout.targetOffsetX;
      const worldY = birthPt.y + initialLayout.targetOffsetY;
      const worldZ = birthPt.z;

      const angle = Math.atan2(birthPt.y, birthPt.x) + (Math.random() - 0.5) * 1.2;
      const speed = 0.003 + Math.random() * 0.008;
      const maxLife = 3.0 + Math.random() * 5.0;

      // Seed particles at random lifecycle stages so field is immediately populated
      const initLife = Math.random() * maxLife;
      const progress = initLife / maxLife;

      const curX = worldX + Math.cos(angle) * (speed * 60 * initLife);
      const curY = worldY + (Math.sin(angle) * speed + 0.0012) * 60 * initLife;
      const curZ = worldZ + (Math.random() - 0.5) * 0.8;

      heroFieldPos[i * 3] = curX;
      heroFieldPos[i * 3 + 1] = curY;
      heroFieldPos[i * 3 + 2] = curZ;

      const col = cyanPalette[Math.floor(Math.random() * 4 + 1)];
      heroFieldColors[i * 3] = col.r;
      heroFieldColors[i * 3 + 1] = col.g;
      heroFieldColors[i * 3 + 2] = col.b;

      heroFieldData.push({
        tBirth: t,
        life: initLife,
        maxLife,
        x: curX,
        y: curY,
        z: curZ,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.0010,
        vz: (Math.random() - 0.5) * 0.002,
        baseAlpha: 0.45 + Math.random() * 0.40,
        targetOffset: new THREE.Vector3(0, 0, 0),
      });
    }

    const heroFieldGeom = new THREE.BufferGeometry();
    heroFieldGeom.setAttribute('position', new THREE.BufferAttribute(heroFieldPos, 3));
    heroFieldGeom.setAttribute('color', new THREE.BufferAttribute(heroFieldColors, 3));

    const heroFieldMat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      map: glowTexture,
      transparent: true,
      opacity: 0.80,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const heroFieldPoints = new THREE.Points(heroFieldGeom, heroFieldMat);
    sceneFieldGroup.add(heroFieldPoints);

    // ==========================================================
    // LAYER 7: Full-Hero Deep Ambient Background Backplane (600 Points)
    // ==========================================================
    const ambientCount = isMobile ? 200 : 600;
    const ambientPos = new Float32Array(ambientCount * 3);
    const ambientVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < ambientCount; i++) {
      ambientPos[i * 3] = (Math.random() - 0.5) * 20.0;
      ambientPos[i * 3 + 1] = (Math.random() - 0.5) * 12.0;
      ambientPos[i * 3 + 2] = -1.5 + (Math.random() - 0.5) * 4.0;

      ambientVelocities.push({
        x: (Math.random() - 0.5) * 0.0014,
        y: 0.0008 + Math.random() * 0.0012,
        z: (Math.random() - 0.5) * 0.001,
      });
    }

    const ambientGeom = new THREE.BufferGeometry();
    ambientGeom.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));

    const ambientMat = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTexture,
      transparent: true,
      opacity: 0.28,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const ambientPoints = new THREE.Points(ambientGeom, ambientMat);
    sceneAmbientGroup.add(ambientPoints);

    // ==========================================================
    // LAYER 8: Foreground Soft Bokeh Floaters (100 Points)
    // ==========================================================
    const bokehCount = isMobile ? 30 : 100;
    const bokehPos = new Float32Array(bokehCount * 3);
    const bokehVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < bokehCount; i++) {
      bokehPos[i * 3] = (Math.random() - 0.5) * 18.0;
      bokehPos[i * 3 + 1] = (Math.random() - 0.5) * 10.0;
      bokehPos[i * 3 + 2] = 2.0 + Math.random() * 2.5;

      bokehVelocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: 0.0012 + Math.random() * 0.0018,
        z: (Math.random() - 0.5) * 0.0015,
      });
    }

    const bokehGeom = new THREE.BufferGeometry();
    bokehGeom.setAttribute('position', new THREE.BufferAttribute(bokehPos, 3));

    const bokehMat = new THREE.PointsMaterial({
      size: 0.65,
      map: glowTexture,
      transparent: true,
      opacity: 0.22,
      color: 0x7df9ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const bokehPoints = new THREE.Points(bokehGeom, bokehMat);
    sceneBokehGroup.add(bokehPoints);

    // Subtle Integrated Apex Convergence Sprite
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
    // SCREEN-WIDE MOUSE TRACKING WITH VELOCITY FORCE FIELD
    // ==========================================================
    const mouse = {
      worldX: 0,
      worldY: 0,
      prevWorldX: 0,
      prevWorldY: 0,
      vx: 0,
      vy: 0,
      speed: 0,
      isInside: false,
      rotTargetX: 0,
      rotTargetY: 0,
      rotX: 0,
      rotY: 0,
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction || layoutRef.current.isMobile) return;
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Convert NDC to 3D World plane at Z=0 (FOV 40, dist 14.5)
      const halfH = Math.tan((40 * Math.PI) / 360) * 14.5;
      const halfW = halfH * camera.aspect;

      mouse.worldX = ndcX * halfW;
      mouse.worldY = ndcY * halfH;
      mouse.isInside = true;

      mouse.rotTargetX = ndcX;
      mouse.rotTargetY = ndcY;
    };

    const onMouseLeave = () => {
      mouse.isInside = false;
      mouse.rotTargetX = 0;
      mouse.rotTargetY = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const newLayout = getResponsiveLayout(w, h);
      layoutRef.current = newLayout;

      camera.aspect = newLayout.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      heartGroup.position.set(newLayout.targetOffsetX, newLayout.targetOffsetY, 0);
      heartGroup.scale.set(newLayout.targetScale, newLayout.targetScale, newLayout.targetScale);
    };
    window.addEventListener('resize', onResize);

    // ==========================================================
    // ANIMATION LOOP (Full Field Dynamics, Emission & Mouse Repulsion)
    // ==========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const energyPackets = [
      { t: 0.0, speed: 1.6, width: 0.35 },
      { t: Math.PI * 0.7, speed: 1.9, width: 0.40 },
      { t: Math.PI * 1.4, speed: 1.4, width: 0.30 },
    ];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // Mouse Velocity Computation
      mouse.vx = (mouse.worldX - mouse.prevWorldX) / Math.max(delta, 0.016);
      mouse.vy = (mouse.worldY - mouse.prevWorldY) / Math.max(delta, 0.016);
      mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      mouse.prevWorldX = mouse.worldX;
      mouse.prevWorldY = mouse.worldY;

      // Update Traveling Energy Packets
      energyPackets.forEach((ep) => {
        ep.t = (ep.t + delta * ep.speed) % (Math.PI * 2);
      });

      // --- 1. Contemplative Pulse (50 BPM ~ 1.20s cycle) ---
      let pulseScale = 1.0;
      let pulseLuminance = 1.0;
      let waveProgress = 0.0;
      let globalAlpha = 1.0;
      let burstEmission = false;

      if (simulatedState === 'reposo') {
        pulseScale = 1.0;
        pulseLuminance = 1.0;
      } else if (simulatedState === 'latido') {
        pulseScale = 1.020;
        pulseLuminance = 1.25;
        waveProgress = 0.5;
        burstEmission = true;
      } else if (simulatedState === 'particle-field') {
        pulseScale = 1.010;
        pulseLuminance = 1.15;
      } else if (simulatedState === 'cursor-left') {
        mouse.rotTargetX = -0.75;
        mouse.rotTargetY = 0.10;
        mouse.worldX = -4.5;
        mouse.worldY = 0.5;
        mouse.isInside = true;
      } else if (simulatedState === 'cursor-center') {
        mouse.rotTargetX = 0.0;
        mouse.rotTargetY = 0.0;
        mouse.worldX = 0.0;
        mouse.worldY = 0.0;
        mouse.isInside = true;
      } else if (simulatedState === 'cursor-right') {
        mouse.rotTargetX = 0.75;
        mouse.rotTargetY = 0.10;
        mouse.worldX = 3.5;
        mouse.worldY = 0.5;
        mouse.isInside = true;
      } else if (simulatedState === 'scroll-state') {
        globalAlpha = 0.4;
        rootGroup.position.y = -0.8;
      } else if (!prefersReducedMotion) {
        const cycle = elapsedTime % 1.2; // 1.20s cycle

        if (cycle < 0.14) {
          const p = cycle / 0.14;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.018;
          pulseLuminance = 1.0 + Math.sin(p * Math.PI) * 0.22;
          waveProgress = p;
          if (p < 0.3) burstEmission = true;
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

      const currentScale = layoutRef.current.targetScale;
      heartGroup.scale.set(currentScale * pulseScale, currentScale * pulseScale, currentScale);
      apexSprite.scale.set(0.55 * pulseLuminance, 0.55 * pulseLuminance, 1);
      haloLine.scale.set(1.0 + (pulseScale - 1.0) * 0.8, 1.0 + (pulseScale - 1.0) * 0.8, 1);

      // --- 2. Parallax: Heart stays stable (max 2.6° Y, 1.7° X) ---
      const springFactor = 0.04;
      mouse.rotX += (mouse.rotTargetX - mouse.rotX) * springFactor;
      mouse.rotY += (mouse.rotTargetY - mouse.rotY) * springFactor;

      heartGroup.rotation.y = mouse.rotX * 0.045; // ~2.6°
      heartGroup.rotation.x = -mouse.rotY * 0.030; // ~1.7°

      // Slow dynamic asymmetry cycle (6s period)
      const asymmetry = 1.0 + Math.sin(elapsedTime * 1.04) * 0.028;

      // --- 3. Animate Volumetric Light Ribbon ---
      const ribbonPosArr = (ribbonGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const ribbonColArr = (ribbonGeom.attributes.color as THREE.BufferAttribute).array as Float32Array;
      const halfWidth = 0.08 * (layoutRef.current.isMobile ? 0.75 : 1.0);

      for (let i = 0; i <= ribbonSegments; i++) {
        const t = (i / ribbonSegments) * Math.PI * 2;
        const norm = getHeartNormal(t);
        const centerPt = getHeartPoint(t, 0.22, 0.0, asymmetry);

        let hotIntensity = 0.0;
        energyPackets.forEach((ep) => {
          const diff = Math.abs(t - ep.t);
          const circDist = Math.min(diff, Math.PI * 2 - diff);
          if (circDist < ep.width) {
            hotIntensity = Math.max(hotIntensity, (1 - circDist / ep.width) * 1.3);
          }
        });

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
          const weaveR = Math.sin(t * cfg.freq + cfg.phase + elapsedTime * cfg.speed) * cfg.amp;
          const weaveZ = Math.cos(t * (cfg.freq * 0.8) + cfg.phase + elapsedTime * (cfg.speed * 0.7)) * 0.14;

          const pt = getHeartPoint(t, 0.22 * cfg.rBase + weaveR * 0.04, cfg.zBase + weaveZ, asymmetry);
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
          const pz = originPt.z + cfg.dir.z * reach;

          pos[i * 3] = px;
          pos[i * 3 + 1] = py;
          pos[i * 3 + 2] = pz;
        }
        geom.attributes.position.needsUpdate = true;
      });

      // --- 6. Animate Heart-Bound Flow Particles ---
      const heartFlowPosArr = (heartFlowGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const speedMultiplier = burstEmission ? 2.4 : 1.0;

      for (let i = 0; i < heartFlowCount; i++) {
        heartFlowT[i] += delta * heartFlowSpeed[i] * speedMultiplier;
        if (heartFlowT[i] > Math.PI * 2) heartFlowT[i] -= Math.PI * 2;
        if (heartFlowT[i] < 0) heartFlowT[i] += Math.PI * 2;

        const t = heartFlowT[i];
        const fIdx = Math.floor(heartFlowFilamentIdx[i]);
        const cfg = filamentConfigs[fIdx] || filamentConfigs[0];
        const pt = getHeartPoint(t, 0.22 * cfg.rBase, cfg.zBase + heartFlowScatter[i * 3 + 2], asymmetry);

        heartFlowPosArr[i * 3] = pt.x + heartFlowScatter[i * 3];
        heartFlowPosArr[i * 3 + 1] = pt.y + heartFlowScatter[i * 3 + 1];
        heartFlowPosArr[i * 3 + 2] = pt.z;
      }
      heartFlowGeom.attributes.position.needsUpdate = true;

      // --- 7. Animate Full-Hero Emanating Particles (Nuclear Heart Field) ---
      const heroFieldPosArr = (heroFieldGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const heroFieldColArr = (heroFieldGeom.attributes.color as THREE.BufferAttribute).array as Float32Array;

      const forceRadius = 2.2; // ~180px in world space
      const forceRadiusSq = forceRadius * forceRadius;

      for (let i = 0; i < heroFieldCount; i++) {
        const d = heroFieldData[i];
        d.life += delta * speedMultiplier;

        // Re-spawn particle from heart nucleus when life expires
        if (d.life > d.maxLife) {
          d.life = 0;
          d.tBirth = Math.random() * Math.PI * 2;
          const birthPt = getHeartPoint(d.tBirth, 0.22, (Math.random() - 0.5) * 0.3, asymmetry);
          d.x = birthPt.x + layoutRef.current.targetOffsetX;
          d.y = birthPt.y + layoutRef.current.targetOffsetY;
          d.z = birthPt.z;

          const angle = Math.atan2(birthPt.y, birthPt.x) + (Math.random() - 0.5) * 1.3;
          const speed = (0.003 + Math.random() * 0.008) * (burstEmission ? 1.8 : 1.0);
          d.vx = Math.cos(angle) * speed;
          d.vy = Math.sin(angle) * speed + 0.0010;
          d.vz = (Math.random() - 0.5) * 0.0025;
        } else {
          // Standard outward drift
          d.x += d.vx * 60 * delta;
          d.y += d.vy * 60 * delta;
          d.z += d.vz * 60 * delta;
        }

        // Text Safe-Area Density & Exclusion
        let localAlpha = d.baseAlpha * globalAlpha;
        if (layoutRef.current.isMobile) {
          // Mobile: Central headline envelope pocket (x in [-1.5, 1.5] && y in [0.4, 2.8])
          if (Math.abs(d.x) < 1.5 && d.y > 0.4 && d.y < 2.8) {
            localAlpha *= 0.10;
            // Softly drift particles outward towards the lobes and perimeter
            d.x += (d.x > 0 ? 0.0025 : -0.0025) * 60 * delta;
          }
        } else {
          // Desktop: Left zone containing copy (x < -1.2 && y > -2.0 && y < 3.0)
          if (d.x < -1.2 && d.y > -2.0 && d.y < 3.0) {
            localAlpha *= 0.22;
            d.y += (d.y > 0.5 ? 0.003 : -0.003) * 60 * delta;
          }
        }

        // Full-Screen Mouse Force Field Repulsion & Velocity Wake
        let renderX = d.x;
        let renderY = d.y;
        let renderZ = d.z;

        if (mouse.isInside && !prefersReducedMotion) {
          const dx = d.x - mouse.worldX;
          const dy = d.y - mouse.worldY;
          const distSq = dx * dx + dy * dy;

          if (distSq < forceRadiusSq && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / forceRadius) * (0.16 + Math.min(mouse.speed * 0.02, 0.25));

            // Radial push
            const pushX = (dx / dist) * force;
            const pushY = (dy / dist) * force;

            // Swirl wake from mouse velocity vector
            const swirlX = -mouse.vy * 0.03 * (1.0 - dist / forceRadius);
            const swirlY = mouse.vx * 0.03 * (1.0 - dist / forceRadius);

            d.targetOffset.x = THREE.MathUtils.lerp(d.targetOffset.x, pushX + swirlX, 0.2);
            d.targetOffset.y = THREE.MathUtils.lerp(d.targetOffset.y, pushY + swirlY, 0.2);
          } else {
            d.targetOffset.x = THREE.MathUtils.lerp(d.targetOffset.x, 0, 0.08);
            d.targetOffset.y = THREE.MathUtils.lerp(d.targetOffset.y, 0, 0.08);
          }
        } else {
          d.targetOffset.x = THREE.MathUtils.lerp(d.targetOffset.x, 0, 0.08);
          d.targetOffset.y = THREE.MathUtils.lerp(d.targetOffset.y, 0, 0.08);
        }

        renderX += d.targetOffset.x;
        renderY += d.targetOffset.y;

        heroFieldPosArr[i * 3] = renderX;
        heroFieldPosArr[i * 3 + 1] = renderY;
        heroFieldPosArr[i * 3 + 2] = renderZ;

        // Modulate color brightness based on localAlpha
        heroFieldColArr[i * 3] = localAlpha;
        heroFieldColArr[i * 3 + 1] = localAlpha;
        heroFieldColArr[i * 3 + 2] = localAlpha;
      }
      heroFieldGeom.attributes.position.needsUpdate = true;
      heroFieldGeom.attributes.color.needsUpdate = true;

      // --- 8. Animate Deep Ambient Background Points ---
      const ambPosArr = (ambientGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < ambientCount; i++) {
        ambPosArr[i * 3] += ambientVelocities[i].x;
        ambPosArr[i * 3 + 1] += ambientVelocities[i].y;
        ambPosArr[i * 3 + 2] += ambientVelocities[i].z;

        if (ambPosArr[i * 3 + 1] > 7.0) ambPosArr[i * 3 + 1] = -7.0;
        if (ambPosArr[i * 3] > 10.5) ambPosArr[i * 3] = -10.5;
        if (ambPosArr[i * 3] < -10.5) ambPosArr[i * 3] = 10.5;
      }
      ambientGeom.attributes.position.needsUpdate = true;

      // --- 9. Animate Foreground Bokeh Floaters ---
      const bokehPosArr = (bokehGeom.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < bokehCount; i++) {
        bokehPosArr[i * 3] += bokehVelocities[i].x;
        bokehPosArr[i * 3 + 1] += bokehVelocities[i].y;
        bokehPosArr[i * 3 + 2] += bokehVelocities[i].z;

        if (bokehPosArr[i * 3 + 1] > 6.0) bokehPosArr[i * 3 + 1] = -6.0;
        if (bokehPosArr[i * 3] > 9.5) bokehPosArr[i * 3] = -9.5;
        if (bokehPosArr[i * 3] < -9.5) bokehPosArr[i * 3] = 9.5;
      }
      bokehGeom.attributes.position.needsUpdate = true;

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
      heartFlowGeom.dispose();
      heartFlowMat.dispose();
      heroFieldGeom.dispose();
      heroFieldMat.dispose();
      ambientGeom.dispose();
      ambientMat.dispose();
      bokehGeom.dispose();
      bokehMat.dispose();
      filamentLines.forEach((f) => {
        f.geom.dispose();
        (f.line.material as THREE.Material).dispose();
      });
      tendrilLines.forEach((t) => {
        t.geom.dispose();
        (t.line.material as THREE.Material).dispose();
      });
    };
  }, [enableMouseInteraction, simulatedState]);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

