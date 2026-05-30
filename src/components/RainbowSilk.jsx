/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import PropTypes from 'prop-types';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float E = 2.7182818;

float noise(vec2 texCoord) {
  vec2 r = (E * sin(E * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

// Inigo Quilez rainbow spectrum cosine palette generator
vec3 rainbow(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2 uv          = rotateUvs(vUv * uScale, uRotation);
  vec2 tex         = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                            sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  // Generate gorgeous rainbow shifting colors
  float colorShift = 0.08 * tOffset + tex.x * 0.15 + tex.y * 0.05;
  vec3 dynamicColor = rainbow(colorShift);

  vec4 col = vec4(dynamicColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

function SilkPlane({ uniforms }) {
  const { viewport } = useThree();
  const meshRef = useRef();

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport]);

  useFrame((_, delta) => {
    if (meshRef.current && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

SilkPlane.propTypes = {
  uniforms: PropTypes.objectOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number]),
    }),
  ).isRequired,
};

const RainbowSilk = ({
  speed,
  scale,
  noiseIntensity,
  rotation,
}) => {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, rotation],
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <SilkPlane uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

RainbowSilk.propTypes = {
  speed: PropTypes.number,
  scale: PropTypes.number,
  noiseIntensity: PropTypes.number,
  rotation: PropTypes.number,
};

RainbowSilk.defaultProps = {
  speed: 9,
  scale: 0.6,
  noiseIntensity: 1.0,
  rotation: 0.4,
};

export default RainbowSilk;
