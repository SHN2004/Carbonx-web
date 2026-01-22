'use client';

import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

import './Particles.css';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  moveParticlesOnDeviceOrientation?: boolean;
  deviceOrientationFactor?: number;
  hoverMode?: 'container' | 'window';
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

const defaultColors: string[] = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    float core = smoothstep(0.5, 0.32, d);
    float halo = smoothstep(0.9, 0.45, d) * 0.28;
    float alpha = core + halo;

    if (uAlphaParticles < 0.5) {
      alpha = step(d, 0.5);
    }

    if(alpha <= 0.001) {
      discard;
    }

    float shimmer = 0.22 * sin(uTime + vRandom.y * 6.2831 + (uv.x + uv.y) * 1.4);
    gl_FragColor = vec4(max(vColor + vec3(shimmer), 0.0), alpha);
  }
`;

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  moveParticlesOnDeviceOrientation = false,
  deviceOrientationFactor = 2,
  hoverMode = 'container',
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const particleColorsKey = particleColors?.join('|') ?? '';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const setTarget = (x: number, y: number) => {
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      targetRef.current = { x: clampedX, y: clampedY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setTarget(x, y);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left/right tilt
      const beta = e.beta ?? 0; // front/back tilt
      setTarget((gamma / 35) * deviceOrientationFactor, (-(beta / 35)) * deviceOrientationFactor);
    };

    let orientationEnabled = false;
    let detachOrientation: (() => void) | null = null;

    const tryEnableOrientation = async () => {
      if (!moveParticlesOnDeviceOrientation || orientationEnabled) return;
      if (typeof window === 'undefined') return;
      const OrientationEvent = (window as unknown as { DeviceOrientationEvent?: unknown })
        .DeviceOrientationEvent as
        | {
            requestPermission?: () => Promise<'granted' | 'denied'>;
          }
        | undefined;
      if (!OrientationEvent) return;

      try {
        if (typeof OrientationEvent.requestPermission === 'function') {
          const permission = await OrientationEvent.requestPermission();
          if (permission !== 'granted') return;
        }

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener);
        orientationEnabled = true;
        detachOrientation = () => {
          window.removeEventListener('deviceorientation', handleOrientation);
          window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener);
        };
      } catch {
        // Ignore - device orientation not available or denied.
      }
    };

    if (moveParticlesOnHover) {
      if (hoverMode === 'window') {
        window.addEventListener('mousemove', handleMouseMove);
      } else {
        container.addEventListener('mousemove', handleMouseMove);
      }
    }

    const hasTouch =
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (moveParticlesOnDeviceOrientation) {
      const permissionApi = (window as unknown as { DeviceOrientationEvent?: unknown })
        .DeviceOrientationEvent as
        | {
            requestPermission?: () => Promise<'granted' | 'denied'>;
          }
        | undefined;

      const needsGesture = typeof permissionApi?.requestPermission === 'function';
      if (needsGesture && hasTouch) {
        const handleFirstGesture = () => {
          void tryEnableOrientation();
          window.removeEventListener('touchstart', handleFirstGesture);
          window.removeEventListener('pointerdown', handleFirstGesture);
        };
        window.addEventListener('touchstart', handleFirstGesture, { passive: true });
        window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
      } else {
        void tryEnableOrientation();
      }
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColorsKey ? particleColorsKey.split('|') : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.08;
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        if (hoverMode === 'window') {
          window.removeEventListener('mousemove', handleMouseMove);
        } else {
          container.removeEventListener('mousemove', handleMouseMove);
        }
      }
      if (detachOrientation) {
        detachOrientation();
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColorsKey,
    moveParticlesOnHover,
    moveParticlesOnDeviceOrientation,
    deviceOrientationFactor,
    hoverMode,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return (
    <div
      ref={containerRef}
      className={['particles-container', className].filter(Boolean).join(' ')}
    />
  );
};

export default Particles;
