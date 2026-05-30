/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, {
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const AntigravityInner = ({
  count,
  magnetRadius,
  ringRadius,
  waveSpeed,
  waveAmplitude,
  particleSize,
  lerpSpeed,
  autoAnimate,
  particleVariance,
  rotationSpeed,
  depthFactor,
  pulseSpeed,
  particleShape,
  fieldStrength,
}) => {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const mouseCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoords.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 20;
    const height = viewport.height || 15;

    const aspect = width / height;
    const cols = Math.max(10, Math.round(Math.sqrt(count * aspect)));
    const rows = Math.max(10, Math.round(count / cols));
    const totalGridCount = cols * rows;

    for (let i = 0; i < totalGridCount; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const pctX = cols > 1 ? col / (cols - 1) : 0.5;
      const pctY = rows > 1 ? row / (rows - 1) : 0.5;

      const x = (pctX - 0.5) * width * 1.15;
      const y = (pctY - 0.5) * height * 1.15;
      const z = 0;

      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.01;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const initialColor = new THREE.Color('#ffffff');
      const actualCount = particles.length;
      for (let i = 0; i < actualCount; i += 1) {
        mesh.setColorAt(i, initialColor);
      }
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
      if (mesh.material) {
        mesh.material.vertexColors = false;
        mesh.material.color.set('#ffffff');
        mesh.material.needsUpdate = true;
      }
    }
  }, [particles]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v } = state;
    const m = mouseCoords.current;

    const dxMouse = m.x - lastMousePos.current.x;
    const dyMouse = m.y - lastMousePos.current.y;
    const mouseDist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.15) * (v.width / 4);
      destY = Math.cos(time * 0.15 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;
    const elapsedTime = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const particle = p;
      particle.t += particle.speed;
      const {
        t,
        mx,
        my,
        mz,
        cz,
      } = particle;

      const projectionFactor = 1 - cz / 50;
      const projTargetX = targetX * projectionFactor;
      const projTargetY = targetY * projectionFactor;

      const dx = mx - projTargetX;
      const dy = my - projTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Ambient tiny grid float oscillation utilizing globalRotation
      const ambientWaveX = Math.sin(t * 0.5 + mx + globalRotation) * 0.15;
      const ambientWaveY = Math.cos(t * 0.5 + my + globalRotation) * 0.15;

      // Mouse push distortion (Gaussian radial repel) using magnetRadius and fieldStrength
      const pushSigma = magnetRadius * 0.8;
      const pushForce = fieldStrength * 0.4;
      const pushAmount = Math.exp(-((dist * dist) / (pushSigma * pushSigma))) * pushForce;
      const pushAngle = Math.atan2(dy, dx);

      // Ripple wave propagation along Z-axis using waveAmplitude and magnetRadius
      const waveTime = elapsedTime * waveSpeed * 30;
      const waveDecay = magnetRadius * magnetRadius * 1.5;
      const rippleWave = Math.sin((dist * 0.8) - waveTime)
        * Math.exp(-((dist * dist) / waveDecay)) * (waveAmplitude * 1.5);

      const targetPos = {
        x: mx + Math.cos(pushAngle) * pushAmount * (1 + rippleWave * 0.2) + ambientWaveX,
        y: my + Math.sin(pushAngle) * pushAmount * (1 + rippleWave * 0.2) + ambientWaveY,
        z: mz + rippleWave * depthFactor,
      };

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);

      // Orient the pill lines along the wave/push direction
      dummy.lookAt(projTargetX, projTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const dxToMouse = particle.cx - projTargetX;
      const dyToMouse = particle.cy - projTargetY;
      const currentDistToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);

      // Gaussian envelope centered at ringRadius to reveal pills further out
      const waveCrest = ringRadius;
      const waveWidth = ringRadius * 0.7;
      const waveFactor = Math.exp(-(((currentDistToMouse - waveCrest) ** 2) / waveWidth));

      // Under mouse: dots. At ripple edge: big pill lines. Far away: small dots.
      const yMultiplier = THREE.MathUtils.lerp(1.0, 2.8, waveFactor);
      const sizeFactor = THREE.MathUtils.lerp(0.8, 1.8, waveFactor);

      const sinPulse = Math.sin(t * pulseSpeed) * 0.08 * particleVariance;
      const finalScale = particleSize * sizeFactor * (1.0 + sinPulse);

      dummy.scale.set(finalScale * 0.45, finalScale * yMultiplier * 0.45, finalScale * 0.45);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      // Beautiful diagonal spatial rainbow gradient flowing gracefully over time
      const spatialFactor = (particle.cx + particle.cy) * 0.05;
      const hue = (((spatialFactor + elapsedTime * 0.06) % 1.0) + 1.0) % 1.0;
      tempColor.setHSL(hue, 0.95, 0.55);
      mesh.setColorAt(i, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.06, 0.08, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.08, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.15, 0.15, 0.15]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.15]} />}
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
};

AntigravityInner.propTypes = {
  count: PropTypes.number.isRequired,
  magnetRadius: PropTypes.number.isRequired,
  ringRadius: PropTypes.number.isRequired,
  waveSpeed: PropTypes.number.isRequired,
  waveAmplitude: PropTypes.number.isRequired,
  particleSize: PropTypes.number.isRequired,
  lerpSpeed: PropTypes.number.isRequired,
  autoAnimate: PropTypes.bool.isRequired,
  particleVariance: PropTypes.number.isRequired,
  rotationSpeed: PropTypes.number.isRequired,
  depthFactor: PropTypes.number.isRequired,
  pulseSpeed: PropTypes.number.isRequired,
  particleShape: PropTypes.string.isRequired,
  fieldStrength: PropTypes.number.isRequired,
};

const AntigravityBackground = ({
  count = 500,
  magnetRadius = 12,
  ringRadius = 8,
  waveSpeed = 0.12,
  waveAmplitude = 1.0,
  particleSize = 1.8,
  lerpSpeed = 0.02,
  autoAnimate = true,
  particleVariance = 0.8,
  rotationSpeed = 0.02,
  depthFactor = 1.2,
  pulseSpeed = 0.8,
  particleShape = 'capsule',
  fieldStrength = 8,
}) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      backgroundColor: '#eaeaea',
      pointerEvents: 'none',
      width: '100vw',
      height: '100vh',
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 50], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
    >
      <AntigravityInner
        count={count}
        magnetRadius={magnetRadius}
        ringRadius={ringRadius}
        waveSpeed={waveSpeed}
        waveAmplitude={waveAmplitude}
        particleSize={particleSize}
        lerpSpeed={lerpSpeed}
        autoAnimate={autoAnimate}
        particleVariance={particleVariance}
        rotationSpeed={rotationSpeed}
        depthFactor={depthFactor}
        pulseSpeed={pulseSpeed}
        particleShape={particleShape}
        fieldStrength={fieldStrength}
      />
    </Canvas>
  </div>
);

AntigravityBackground.propTypes = {
  count: PropTypes.number,
  magnetRadius: PropTypes.number,
  ringRadius: PropTypes.number,
  waveSpeed: PropTypes.number,
  waveAmplitude: PropTypes.number,
  particleSize: PropTypes.number,
  lerpSpeed: PropTypes.number,
  autoAnimate: PropTypes.bool,
  particleVariance: PropTypes.number,
  rotationSpeed: PropTypes.number,
  depthFactor: PropTypes.number,
  pulseSpeed: PropTypes.number,
  particleShape: PropTypes.string,
  fieldStrength: PropTypes.number,
};

AntigravityBackground.defaultProps = {
  count: 500,
  magnetRadius: 12,
  ringRadius: 8,
  waveSpeed: 0.12,
  waveAmplitude: 1.0,
  particleSize: 1.8,
  lerpSpeed: 0.02,
  autoAnimate: true,
  particleVariance: 0.8,
  rotationSpeed: 0.02,
  depthFactor: 1.2,
  pulseSpeed: 0.8,
  particleShape: 'capsule',
  fieldStrength: 8,
};

export default AntigravityBackground;
