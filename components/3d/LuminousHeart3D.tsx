'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LuminousHeart3DProps {
  className?: string;
  enableMouseInteraction?: boolean;
  showCenterLogo?: boolean;
  scale?: number;
  simulatedState?: 'auto' | 'reposo' | 'latido' | 'cursor-left' | 'cursor-right';
}

export const LuminousHeart3D: React.FC<LuminousHeart3DProps> = ({
  className = '',
  enableMouseInteraction = true,
  showCenterLogo = true,
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

    // Determine device tier & motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14);

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

    // Group for the entire heart system (for rotation & scaling)
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // Parametric Heart formula: Exact cardiod proportions from reference
    function getHeartPoint(t: number, scaleMultiplier: number = 0.22): THREE.Vector3 {
      // t from 0 to 2*PI
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      // Center vertically (average y is ~ +2.0)
      return new THREE.Vector3(
        x * scaleMultiplier * scale,
        (y - 1.5) * scaleMultiplier * scale,
        0
      );
    }

    // ==========================================================
    // LAYER 1: Core Glowing Light Filaments (Intertwined Splines)
    // ==========================================================
    const numFilaments = isMobile ? 2 : 4;
    const filamentCurves: THREE.Line[] = [];
    const filamentOffsets = [
      { z: 0.0, rOffset: 1.0, color: 0x00f0ff, opacity: 0.95 },
      { z: 0.15, rOffset: 1.02, color: 0x7df9ff, opacity: 0.85 },
      { z: -0.15, rOffset: 0.98, color: 0x00a8e8, opacity: 0.8 },
      { z: 0.25, rOffset: 1.035, color: 0xffffff, opacity: 0.6 },
    ];

    const splinePointsCount = isMobile ? 200 : 350;
    for (let f = 0; f < numFilaments; f++) {
      const cfg = filamentOffsets[f];
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= splinePointsCount; i++) {
        const t = (i / splinePointsCount) * Math.PI * 2;
        const pt = getHeartPoint(t, 0.22 * cfg.rOffset);
        // Add subtle 3D depth wave
        pt.z = cfg.z + Math.sin(t * 3) * 0.08;
        points.push(pt);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      heartGroup.add(line);
      filamentCurves.push(line);
    }

    // ==========================================================
    // LAYER 2: Contour Light Particles (Sparks traveling on contour)
    // ==========================================================
    const particleCount = isMobile ? 1200 : 3200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBasePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleTValues = new Float32Array(particleCount);
    const particleSpeed = new Float32Array(particleCount);
    const particleOffsetRadius = new Float32Array(particleCount);
    const particlePhase = new Float32Array(particleCount);

    const cyanPalette = [
      new THREE.Color('#00F0FF'), // Vivid cyan
      new THREE.Color('#7DF9FF'), // Electric light cyan
      new THREE.Color('#00B4D8'), // Medium cyan
      new THREE.Color('#FFFFFF'), // Pure white core spark
      new THREE.Color('#0077B6'), // Deep turquoise
    ];

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * Math.PI * 2;
      particleTValues[i] = t;
      particleSpeed[i] = (0.15 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1);
      particlePhase[i] = Math.random() * Math.PI * 2;

      // Small Gaussian jitter around the curve
      const spread = (Math.random() - 0.5) * 0.25;
      const zSpread = (Math.random() - 0.5) * 0.6;
      particleOffsetRadius[i] = 1.0 + spread * 0.15;

      const basePt = getHeartPoint(t, 0.22 * particleOffsetRadius[i]);
      basePt.z = zSpread;

      particlePositions[i * 3] = basePt.x;
      particlePositions[i * 3 + 1] = basePt.y;
      particlePositions[i * 3 + 2] = basePt.z;

      particleBasePositions[i * 3] = basePt.x;
      particleBasePositions[i * 3 + 1] = basePt.y;
      particleBasePositions[i * 3 + 2] = basePt.z;

      // Random color selection favoring bright cyan
      const col = cyanPalette[Math.floor(Math.random() * cyanPalette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;

      particleSizes[i] = (Math.random() * 0.08 + 0.03) * (isMobile ? 0.8 : 1.0);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Custom Particle Texture: Soft glowing radial circle
    function createGlowTexture(): THREE.Texture {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(0, 168, 232, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const glowTexture = createGlowTexture();

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      map: glowTexture,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    heartGroup.add(particles);

    // ==========================================================
    // LAYER 3: Ambient Drifting Dust Sparks (Outer subtle aura)
    // ==========================================================
    const dustCount = isMobile ? 150 : 400;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 3.5;
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = Math.sin(angle) * radius;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003 + 0.002, // Subtle upward float
        z: (Math.random() - 0.5) * 0.002,
      });
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTexture,
      transparent: true,
      opacity: 0.45,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    heartGroup.add(dustParticles);

    // ==========================================================
    // LAYER 4: Bottom Apex Light Burst (matching reference beam)
    // ==========================================================
    const apexPoint = getHeartPoint(Math.PI, 0.22); // Bottom tip of the heart
    const flareSpriteMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x7df9ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const apexFlare = new THREE.Sprite(flareSpriteMaterial);
    apexFlare.position.copy(apexPoint);
    apexFlare.scale.set(1.4, 1.4, 1);
    heartGroup.add(apexFlare);

    // Vertical lens streak flare at bottom apex
    const streakMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const apexStreak = new THREE.Sprite(streakMaterial);
    apexStreak.position.set(apexPoint.x, apexPoint.y - 0.15, apexPoint.z);
    apexStreak.scale.set(0.25, 2.2, 1);
    heartGroup.add(apexStreak);

    // ==========================================================
    // INTERACTION & ANIMATION STATE
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

      // Project mouse into 3D plane for particle proximity interaction
      mouse3D.set(x * 6, y * 4, 0);
    };

    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isHovering = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ==========================================================
    // ANIMATION LOOP (Clock & Organic Heartbeat Logic)
    // ==========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // --- 1. Organic Heartbeat Pulse Curve (70 BPM ~ 1.15s period) ---
      let pulseScale = 1.0;
      let pulseBrightness = 1.0;

      if (simulatedState === 'reposo') {
        pulseScale = 1.0;
        pulseBrightness = 1.0;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'latido') {
        pulseScale = 1.028;
        pulseBrightness = 1.35;
        mouse.targetX = 0;
        mouse.targetY = 0;
      } else if (simulatedState === 'cursor-left') {
        pulseScale = 1.0;
        pulseBrightness = 1.0;
        mouse.targetX = -0.85;
        mouse.targetY = 0.15;
        mouse.isHovering = true;
        mouse3D.set(-5.1, 0.6, 0);
      } else if (simulatedState === 'cursor-right') {
        pulseScale = 1.0;
        pulseBrightness = 1.0;
        mouse.targetX = 0.85;
        mouse.targetY = 0.15;
        mouse.isHovering = true;
        mouse3D.set(5.1, 0.6, 0);
      } else if (!prefersReducedMotion) {
        const cycleTime = elapsedTime % 1.15; // 1.15s per heartbeat cycle

        if (cycleTime < 0.12) {
          // Primary systole beat (rise)
          const p = cycleTime / 0.12;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.028;
          pulseBrightness = 1.0 + Math.sin(p * Math.PI) * 0.35;
        } else if (cycleTime < 0.24) {
          // Primary recoil
          const p = (cycleTime - 0.12) / 0.12;
          pulseScale = 1.0 + (1 - p) * 0.008;
        } else if (cycleTime < 0.36) {
          // Secondary soft echo beat
          const p = (cycleTime - 0.24) / 0.12;
          pulseScale = 1.0 + Math.sin(p * Math.PI) * 0.014;
          pulseBrightness = 1.0 + Math.sin(p * Math.PI) * 0.18;
        } else {
          // Diastole calm rest period
          pulseScale = 1.0;
          pulseBrightness = 1.0;
        }
      }

      // Apply base pulse scale
      heartGroup.scale.set(pulseScale, pulseScale, pulseScale);
      apexFlare.scale.set(1.4 * pulseBrightness, 1.4 * pulseBrightness, 1);
      apexStreak.scale.set(0.25 * pulseBrightness, 2.2 * pulseBrightness, 1);

      // --- 2. Smooth Cursor Lerp / Parallax Tilt ---
      if ((enableMouseInteraction || simulatedState !== 'auto') && !prefersReducedMotion) {
        const lerpFactor = simulatedState !== 'auto' ? 0.15 : 0.05;
        mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
        mouse.y += (mouse.targetY - mouse.y) * lerpFactor;

        // Subtle organic tilt
        heartGroup.rotation.y = mouse.x * 0.14;
        heartGroup.rotation.x = -mouse.y * 0.09;
        heartGroup.position.x = mouse.x * 0.22;
        heartGroup.position.y = mouse.y * 0.18;
      }

      // --- 3. Animate Contour Particles (Flow & Repulsion) ---
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Move particle along the curve
        particleTValues[i] += particleSpeed[i] * delta * 0.3;
        const t = particleTValues[i];

        const basePt = getHeartPoint(t, 0.22 * particleOffsetRadius[i]);
        const zBase = particleBasePositions[i * 3 + 2] + Math.sin(elapsedTime * 2 + particlePhase[i]) * 0.05;

        let curX = basePt.x;
        let curY = basePt.y;
        let curZ = zBase;

        // Cursor proximity gentle dispersion
        if (mouse.isHovering && !prefersReducedMotion) {
          const dx = curX - mouse3D.x;
          const dy = curY - mouse3D.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 2.2) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / 1.5) * 0.25;
            curX += (dx / (dist + 0.001)) * force;
            curY += (dy / (dist + 0.001)) * force;
          }
        }

        positions[i * 3] = curX;
        positions[i * 3 + 1] = curY;
        positions[i * 3 + 2] = curZ;
      }
      posAttr.needsUpdate = true;

      // --- 4. Animate Ambient Dust ---
      const dustPosAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
      const dustPos = dustPosAttr.array as Float32Array;

      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3] += dustVelocities[i].x;
        dustPos[i * 3 + 1] += dustVelocities[i].y;
        dustPos[i * 3 + 2] += dustVelocities[i].z;

        // Wrap around boundaries
        if (dustPos[i * 3 + 1] > 4.5) dustPos[i * 3 + 1] = -4.5;
        if (dustPos[i * 3] > 6) dustPos[i * 3] = -6;
        if (dustPos[i * 3] < -6) dustPos[i * 3] = 6;
      }
      dustPosAttr.needsUpdate = true;

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
      particleGeometry.dispose();
      particleMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      glowTexture.dispose();
    };
  }, [enableMouseInteraction, scale]);

  if (!isSupported) {
    // Fallback: Static glowing heart image if WebGL fails
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
      aria-label="Experiencia interactiva 3D: Corazón de Luz"
    >
      {/* Optional Central Logo Overlay matching reference image */}
      {showCenterLogo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
          <div className="flex flex-col items-center justify-center p-6 text-center transform -translate-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 relative flex items-center justify-center">
              <img
                src="/brand/logo-oficial.jpg"
                alt="Logo Amistad Nueva Creación"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain shadow-cyanGlow"
              />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,240,255,0.7)]">
              Amistad
            </span>
            <span className="text-xs sm:text-sm font-bold text-cyan-electric tracking-widest uppercase">
              Nueva Creación
            </span>
            <span className="text-[9px] font-semibold text-slate-300 tracking-widest uppercase opacity-80">
              Internacional
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

