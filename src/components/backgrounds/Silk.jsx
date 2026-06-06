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

const darkSilk1List = [
  [0.27, 0.25, 0.23],
  [0.08, 0.13, 0.21],
  [0.15, 0.08, 0.19],
  [0.21, 0.08, 0.08],
];

const darkSilk2List = [
  [0.55, 0.55, 0.54],
  [0.05, 0.09, 0.14],
  [0.09, 0.04, 0.11],
  [0.12, 0.05, 0.05],
];

const lightSilk1List = [
  [0.74, 0.72, 0.69],
  [0.82, 0.88, 0.98],
  [0.92, 0.85, 0.99],
  [0.99, 0.86, 0.83],
];

const lightSilk2List = [
  [0.96, 0.95, 0.93],
  [0.94, 0.96, 0.97],
  [0.97, 0.95, 0.99],
  [0.99, 0.96, 0.96],
];

const lerpVal = (a, b, t) => a + (b - a) * t;

const interpolateArray = (list, progress) => {
  const segmentCount = list.length - 1;
  const rawIndex = progress * segmentCount;
  const index1 = Math.floor(rawIndex);
  const index2 = Math.min(index1 + 1, segmentCount);
  const t = rawIndex - index1;

  const c1 = list[index1];
  const c2 = list[index2];

  return [
    lerpVal(c1[0], c2[0], t),
    lerpVal(c1[1], c2[1], t),
    lerpVal(c1[2], c2[2], t),
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

function SilkPlane({ uniforms, isDark }) {
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
      const matUniforms = meshRef.current.material.uniforms;
      matUniforms.uTime.value += 0.1 * delta;

      const isAbout = window.location.pathname === '/about';
      const { portfolioScrollLenis } = window;

      if (isAbout && portfolioScrollLenis) {
        const { scroll, limit } = portfolioScrollLenis;
        const progress = limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0;

        const s1List = isDark ? darkSilk1List : lightSilk1List;
        const s2List = isDark ? darkSilk2List : lightSilk2List;

        const rgb1 = interpolateArray(s1List, progress);
        const rgb2 = interpolateArray(s2List, progress);

        if (matUniforms.uColor && matUniforms.uColor.value) {
          matUniforms.uColor.value.setRGB(rgb1[0], rgb1[1], rgb1[2]);
        }
        if (matUniforms.uColor2 && matUniforms.uColor2.value) {
          matUniforms.uColor2.value.setRGB(rgb2[0], rgb2[1], rgb2[2]);
        }
      } else {
        if (matUniforms.uColor && uniforms.uColor) {
          matUniforms.uColor.value.copy(uniforms.uColor.value);
        }
        if (matUniforms.uColor2 && uniforms.uColor2) {
          matUniforms.uColor2.value.copy(uniforms.uColor2.value);
        }
      }
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
  isDark: PropTypes.bool,
};

SilkPlane.defaultProps = {
  isDark: false,
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
  isDark,
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
      <SilkPlane uniforms={uniforms} isDark={isDark} />
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
  isDark: PropTypes.bool,
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
  isDark: false,
};

export default Silk;
