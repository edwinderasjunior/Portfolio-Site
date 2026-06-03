/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, {
  useRef,
  useMemo,
  useLayoutEffect,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Color } from 'three';

const hexToNormalizedRGB = (hex) => {
  const cleanHex = hex.replace('#', '');
  return [
    parseInt(cleanHex.slice(0, 2), 16) / 255,
    parseInt(cleanHex.slice(2, 4), 16) / 255,
    parseInt(cleanHex.slice(4, 6), 16) / 255,
  ];
};

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
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uOpacity;

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

  vec3 finalColor = mix(uColor2, uColor, pattern);
  vec4 col = vec4(finalColor, 1.0) - rnd / 15.0 * uNoiseIntensity;
  col.a = uOpacity;
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

  useEffect(() => {
    if (meshRef.current && meshRef.current.material && meshRef.current.material.uniforms) {
      const matUniforms = meshRef.current.material.uniforms;
      if (matUniforms.uColor && uniforms.uColor) {
        matUniforms.uColor.value.copy(uniforms.uColor.value);
      }
      if (matUniforms.uColor2 && uniforms.uColor2) {
        matUniforms.uColor2.value.copy(uniforms.uColor2.value);
      }
      if (matUniforms.uSpeed && uniforms.uSpeed) {
        matUniforms.uSpeed.value = uniforms.uSpeed.value;
      }
      if (matUniforms.uScale && uniforms.uScale) {
        matUniforms.uScale.value = uniforms.uScale.value;
      }
      if (matUniforms.uNoiseIntensity && uniforms.uNoiseIntensity) {
        matUniforms.uNoiseIntensity.value = uniforms.uNoiseIntensity.value;
      }
      if (matUniforms.uRotation && uniforms.uRotation) {
        matUniforms.uRotation.value = uniforms.uRotation.value;
      }
      if (matUniforms.uOpacity && uniforms.uOpacity) {
        matUniforms.uOpacity.value = uniforms.uOpacity.value;
      }
    }
  }, [uniforms]);

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
        transparent
      />
    </mesh>
  );
}

SilkPlane.propTypes = {
  uniforms: PropTypes.objectOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.instanceOf(Color),
      ]),
    }),
  ).isRequired,
};

const Silk = ({
  speed,
  scale,
  color,
  color2,
  noiseIntensity,
  rotation,
  opacity,
  paused,
}) => {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uColor2: { value: new Color(...hexToNormalizedRGB(color2)) },
      uRotation: { value: rotation },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.copy(new Color(...hexToNormalizedRGB(color)));
    uniforms.uColor2.value.copy(new Color(...hexToNormalizedRGB(color2)));
    uniforms.uRotation.value = rotation;
    uniforms.uOpacity.value = opacity;
  }, [speed, scale, color, color2, noiseIntensity, rotation, opacity, uniforms]);

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={paused ? 'never' : 'always'}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <SilkPlane uniforms={uniforms} />
    </Canvas>
  );
};

Silk.propTypes = {
  speed: PropTypes.number,
  scale: PropTypes.number,
  color: PropTypes.string,
  color2: PropTypes.string,
  noiseIntensity: PropTypes.number,
  rotation: PropTypes.number,
  opacity: PropTypes.number,
  paused: PropTypes.bool,
};

Silk.defaultProps = {
  speed: 9,
  scale: 1.0,
  color: '#70cd4bff',
  color2: '#8b8c89',
  noiseIntensity: 1.0,
  rotation: 1.6,
  opacity: 1.0,
  paused: false,
};

export default Silk;
