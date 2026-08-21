'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type DeviceTier = 'HIGH' | 'MID' | 'LOW' | 'NO_WEBGL_OR_REDUCED_MOTION';

interface LightwayCanvasProps {
  forceTier?: DeviceTier;
  onFpsUpdate?: (fps: number) => void;
  onTierDetected?: (tier: DeviceTier) => void;
}

export const LightwayCanvas: React.FC<LightwayCanvasProps> = ({
  forceTier,
  onFpsUpdate,
  onTierDetected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTier, setActiveTier] = useState<DeviceTier>('HIGH');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Accessibility Check: prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setIsReducedMotion(mediaQuery.matches);
    };
    handleMotionChange();
    mediaQuery.addEventListener('change', handleMotionChange);

    // 2. Hardware Tier Determination
    let detectedTier: DeviceTier = 'HIGH';
    const isMobile = window.innerWidth < 768;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        detectedTier = 'NO_WEBGL_OR_REDUCED_MOTION';
      } else if (mediaQuery.matches) {
        detectedTier = 'NO_WEBGL_OR_REDUCED_MOTION';
      } else if (isMobile) {
        detectedTier = 'LOW';
      } else if (window.innerWidth < 1200) {
        detectedTier = 'MID';
      } else {
        detectedTier = 'HIGH';
      }
    } catch {
      detectedTier = 'NO_WEBGL_OR_REDUCED_MOTION';
    }

    const finalTier = forceTier || detectedTier;
    setActiveTier(finalTier);
    if (onTierDetected) onTierDetected(finalTier);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [forceTier, onTierDetected]);

  useEffect(() => {
    if (activeTier === 'NO_WEBGL_OR_REDUCED_MOTION' || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 9);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: activeTier === 'HIGH',
      alpha: true,
      powerPreference: 'high-performance',
    });

    const dpr =
      activeTier === 'HIGH'
        ? Math.min(window.devicePixelRatio, 1.5)
        : activeTier === 'MID'
        ? 1.0
        : 1.0;

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x06090e, 0);
    container.appendChild(renderer.domElement);

    // --- 3D CatmullRom Path (The Lightway Journey) ---
    // A flowing path starting in the Hero and curving down into Step 01
    const curvePoints = [
      new THREE.Vector3(-2.2, 3.5, -1.0),
      new THREE.Vector3(1.8, 1.8, 0.5),
      new THREE.Vector3(-1.2, 0.2, 1.5),
      new THREE.Vector3(0.0, -1.8, 2.2), // Hero to Transition
      new THREE.Vector3(1.2, -4.0, 1.0), // Approaching Step 01
      new THREE.Vector3(0.0, -6.5, 0.0), // Centered at Step 01
      new THREE.Vector3(-1.5, -9.0, -1.5), // Continuing path
    ];

    const spline = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.5);

    // 1. Ribbon / Tube Geometry
    const tubeSegments = activeTier === 'HIGH' ? 160 : activeTier === 'MID' ? 100 : 60;
    const tubeRadius = activeTier === 'LOW' ? 0.06 : 0.08;
    const tubeGeometry = new THREE.TubeGeometry(spline, tubeSegments, tubeRadius, 12, false);

    // Custom Shader Material for the Ribbon (Vibrant Cyan to Deep Teal with pulsating light)
    const ribbonUniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uColorStart: { value: new THREE.Color(0x00e5ff) },
      uColorCore: { value: new THREE.Color(0x00c2d1) },
      uColorDeep: { value: new THREE.Color(0x006b7b) },
    };

    const ribbonMaterial = new THREE.ShaderMaterial({
      uniforms: ribbonUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          // Gentle organic breathing motion
          vec3 pos = position;
          float wave = sin(uv.x * 12.0 + uTime * 1.5) * 0.04;
          pos += normal * wave;

          vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec3 uColorStart;
        uniform vec3 uColorCore;
        uniform vec3 uColorDeep;

        void main() {
          // View direction & Fresnel edge glow
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

          // Flowing light pulse along the curve
          float pulse = sin(vUv.x * 20.0 - uTime * 2.5) * 0.5 + 0.5;
          
          // Progressive illumination with scroll
          float scrollIllumination = smoothstep(0.0, 0.8, uScrollProgress * 1.5 - vUv.x * 0.5);

          // Blend color gradient
          vec3 baseColor = mix(uColorDeep, uColorCore, vUv.x);
          baseColor = mix(baseColor, uColorStart, pulse * 0.6 + scrollIllumination * 0.4);

          // Add fresnel glow
          vec3 finalColor = baseColor + uColorStart * fresnel * 0.9;

          // Soft alpha falloff at boundaries
          float alpha = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) * 0.92;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ribbonMesh = new THREE.Mesh(tubeGeometry, ribbonMaterial);
    scene.add(ribbonMesh);

    // 2. Floating Luminous Particles (1000 on High, 500 on Mid, 200 on Low)
    const particleCount = activeTier === 'HIGH' ? 1000 : activeTier === 'MID' ? 500 : 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Scatter particles along the spline curve with radial variance
      const t = Math.random();
      const point = spline.getPoint(t);
      const spread = (Math.random() - 0.5) * 3.5;
      const spreadY = (Math.random() - 0.5) * 2.5;
      const spreadZ = (Math.random() - 0.5) * 3.5;

      particlePositions[i * 3] = point.x + spread;
      particlePositions[i * 3 + 1] = point.y + spreadY;
      particlePositions[i * 3 + 2] = point.z + spreadZ;

      particleScales[i] = Math.random() * 0.8 + 0.3;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00e5ff) },
      },
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          // Organic drift
          pos.y += sin(uTime * 0.8 + pos.x * 2.0) * 0.15;
          pos.x += cos(uTime * 0.6 + pos.z * 2.0) * 0.15;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = (aScale * 35.0) / -mvPosition.z;
          vAlpha = smoothstep(12.0, 3.0, -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          // Circular particle with soft exponential glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - (dist * 2.0), 2.0);
          gl_FragColor = vec4(uColor, intensity * vAlpha * 0.75);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 3. Node 01 Light Beacon (Step 01 location)
    const nodePoint = spline.getPoint(0.72);
    const nodeGeometry = new THREE.SphereGeometry(0.24, 24, 24);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.85,
    });
    const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    nodeMesh.position.copy(nodePoint);
    scene.add(nodeMesh);

    // Node 01 Pulse Halo
    const haloGeometry = new THREE.RingGeometry(0.28, 0.7, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.position.copy(nodePoint);
    scene.add(haloMesh);

    // --- Interactive Mouse & Scroll Tracking ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };

    if (activeTier !== 'LOW') {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Native Smooth Scroll Tracking (ZERO SCROLL-JACKING)
    let scrollProgress = 0;
    const updateScrollProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // --- Animation & Render Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();
      frameCount++;

      // Compute live FPS
      if (now - fpsTimer >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / (now - fpsTimer));
        if (onFpsUpdate) onFpsUpdate(measuredFps);
        frameCount = 0;
        fpsTimer = now;
      }

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Update shader uniforms
      ribbonUniforms.uTime.value = elapsedTime;
      ribbonUniforms.uScrollProgress.value = scrollProgress;
      particleMaterial.uniforms.uTime.value = elapsedTime;

      // Camera smoothly travels along the spline curve with scroll
      // t ranges from 0.0 (Hero) to ~0.75 (Step 01)
      const targetT = Math.min(scrollProgress * 0.9, 0.85);
      const camPos = spline.getPoint(Math.max(targetT - 0.08, 0));
      const lookPos = spline.getPoint(Math.min(targetT + 0.15, 1));

      camera.position.x = camPos.x + currentMouseX * 0.8;
      camera.position.y = camPos.y + 1.2 - currentMouseY * 0.5;
      camera.position.z = Math.max(camPos.z + 5.5 - scrollProgress * 1.5, 3.5);

      camera.lookAt(lookPos.x, lookPos.y, lookPos.z);

      // Pulse Node 01 halo
      const scale = 1.0 + Math.sin(elapsedTime * 3.0) * 0.15;
      haloMesh.scale.set(scale, scale, 1);
      haloMesh.lookAt(camera.position);

      renderer.render(scene, camera);
    };

    animate();

    // --- Strict Memory Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', handleResize);

      tubeGeometry.dispose();
      ribbonMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeTier, forceTier, onFpsUpdate]);

  if (activeTier === 'NO_WEBGL_OR_REDUCED_MOTION') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
