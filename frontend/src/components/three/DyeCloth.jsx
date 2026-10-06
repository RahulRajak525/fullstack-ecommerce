import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, DoubleSide, MathUtils, ShaderMaterial } from "three";

/*
 * A length of cloth hanging from a rod, dipped into a dye bath.
 *
 * Everything is procedural: the drape and sway are a vertex shader, the weave,
 * the uneven take-up of the dye and the tide line where it gathers are a
 * fragment shader. There are no model or texture files to download, so the
 * whole scene is the three.js chunk plus this file.
 *
 * Loaded lazily by DyeBath, so three.js never touches the main bundle.
 */

const CLOTH_W = 3.0;
const CLOTH_H = 2.6;
// Seconds for the dye to climb from the hem to the rod
const DIP_SECONDS = 2.2;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;          // 0 under reduced motion: a still drape
  uniform vec2 uPointer;          // pointer position in uv space
  uniform float uPointerStrength; // eases to 0 when the pointer leaves
  uniform vec2 uSize;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;

  // Where a point on the flat plane ends up once the cloth hangs and moves
  vec3 displace(vec3 p) {
    vec2 uv = p.xy / uSize + 0.5;
    float t = uTime * uMotion;

    // 0 at the rod, 1 at the hem. Squared, so the pinned edge barely moves
    // and the hem swings freely.
    float hang = 1.0 - uv.y;
    float sway = hang * hang;

    // Folds that fall from the rod, present along the whole length: a few
    // deep ones with finer creases between them
    float folds = (sin(p.x * 7.0 + sin(t * 0.5) * 0.6) * 0.085
                 + sin(p.x * 13.0 + 1.3 + t * 0.3) * 0.022)
                * (0.4 + 0.6 * hang);

    // Slow travelling waves for the draught moving through it
    float wave = sin(p.x * 2.1 + t * 1.3) * 0.08
               + sin(p.x * 4.3 - t * 1.7 + p.y * 1.5) * 0.035
               + sin(p.y * 3.0 + t * 0.9) * 0.05;

    // The pointer presses the cloth back, with a small ring rippling out
    float d = distance(uv, uPointer);
    float press = uPointerStrength * exp(-d * d * 28.0) * 0.32;
    float ring = uPointerStrength * sin(d * 38.0 - t * 7.0) * exp(-d * 7.0) * 0.018;

    p.z += folds + wave * sway - (press + ring) * (0.25 + 0.75 * hang);
    p.x += sin(p.y * 2.0 + t * 1.1) * 0.03 * sway;
    return p;
  }

  void main() {
    vUv = uv;
    vec3 p = displace(position);

    // Normals by finite differences on the displacement, so lighting follows
    // the folds smoothly instead of faceting per triangle
    float e = 0.01;
    vec3 px = displace(position + vec3(e, 0.0, 0.0));
    vec3 py = displace(position + vec3(0.0, e, 0.0));
    vNormal = normalize(normalMatrix * cross(px - p, py - p));

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uFrom;      // colour before this dip
  uniform vec3 uTo;        // colour being dyed
  uniform float uProgress; // 0 -> 1 over the dip

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    // Dye wicks up from the hem unevenly, so the front is ragged
    float h = vUv.y + (fbm(vUv * vec2(6.0, 3.0)) - 0.5) * 0.22;
    float front = uProgress * 1.35 - 0.15;
    float dyed = 1.0 - smoothstep(front - 0.03, front + 0.03, h);

    // Pigment gathers at the wicking front as a darker tide line, which
    // fades once the dip is complete
    float tide = smoothstep(0.07, 0.0, front - h) * dyed;
    tide *= 1.0 - smoothstep(0.8, 1.0, uProgress);

    vec3 base = mix(uFrom, uTo, dyed);
    base = mix(base, uTo * 0.62, tide * 0.65);

    // Plant dyes never take perfectly evenly, and raw cotton has slubs
    base *= 0.93 + 0.12 * fbm(vUv * vec2(3.0, 9.0));

    // Plain weave: alternate cells show the warp or the weft on top
    vec2 g = vUv * vec2(260.0, 230.0);
    vec2 f = fract(g);
    float over = mod(floor(g.x) + floor(g.y), 2.0);
    float thread = mix(sin(f.y * 3.14159), sin(f.x * 3.14159), over);
    float weave = 0.9 + 0.1 * thread;
    // Fade the weave out where it is finer than a pixel, to stop moire
    float fw = fwidth(g.x) + fwidth(g.y);
    weave = mix(weave, 0.95, clamp(fw - 0.6, 0.0, 1.0));

    // Matte, wrapped lighting for cotton, with a faint fuzz at grazing angles
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    // Raking light from the side, so the folds read as relief
    vec3 light = normalize(vec3(0.85, 0.45, 0.6));
    float diffuse = clamp(dot(n, light), 0.0, 1.0) * 0.75 + 0.3;
    vec3 view = normalize(cameraPosition - vWorld);
    float sheen = pow(1.0 - clamp(dot(n, view), 0.0, 1.0), 3.0) * 0.1;

    gl_FragColor = vec4(base * weave * diffuse + sheen, 1.0);
    #include <colorspace_fragment>
  }
`;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function Cloth({ hex, reduced }) {
  const mesh = useRef(null);
  const progress = useRef(1);
  const pointerTarget = useRef(0);

  // The material is built here and attached as a primitive, rather than
  // declared as <shaderMaterial uniforms={...}>: given that prop, R3F hands
  // the material a copy of the uniforms, so per-frame writes (time, dip
  // progress) only reached the shader whenever React happened to re-render.
  // This way there is exactly one uniforms object, and it is the live one.
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMotion: { value: 1 },
          uPointer: { value: [0.5, 0.5] },
          uPointerStrength: { value: 0 },
          uSize: { value: [CLOTH_W, CLOTH_H] },
          uFrom: { value: new Color(hex) },
          uTo: { value: new Color(hex) },
          uProgress: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        side: DoubleSide,
      }),
    // Created once; colour changes go through the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const uniforms = material.uniforms;

  useEffect(() => () => material.dispose(), [material]);

  // A new dye: whatever was soaking in becomes the starting colour, and the
  // cloth goes back into the bath
  useEffect(() => {
    const to = new Color(hex);
    if (to.equals(uniforms.uTo.value)) return;
    uniforms.uFrom.value.copy(uniforms.uTo.value);
    uniforms.uTo.value.copy(to);
    progress.current = reduced ? 1 : 0;
  }, [hex, reduced, uniforms]);

  useEffect(() => {
    uniforms.uMotion.value = reduced ? 0 : 1;
  }, [reduced, uniforms]);

  useFrame((_, delta) => {
    // Clamp so a backgrounded tab does not jump the animation on return
    const dt = Math.min(delta, 1 / 20);
    uniforms.uTime.value += dt;

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + dt / DIP_SECONDS);
    }
    const p = easeInOut(progress.current);
    uniforms.uProgress.value = p;

    // The cloth sinks a little into the bath and rises out again
    if (mesh.current) {
      mesh.current.position.y = reduced ? 0 : -Math.sin(p * Math.PI) * 0.12;
    }

    uniforms.uPointerStrength.value = MathUtils.damp(
      uniforms.uPointerStrength.value,
      pointerTarget.current,
      6,
      dt,
    );
  });

  const onPointerMove = (e) => {
    if (reduced || !e.uv) return;
    uniforms.uPointer.value = [e.uv.x, e.uv.y];
    pointerTarget.current = 1;
  };
  const onPointerOut = () => {
    pointerTarget.current = 0;
  };

  return (
    <group>
      <mesh
        ref={mesh}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
      >
        <planeGeometry args={[CLOTH_W, CLOTH_H, 120, 104]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* The rod, with turned finials */}
      <group position={[0, CLOTH_H / 2 + 0.02, 0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, CLOTH_W + 0.5, 24]} />
          <meshStandardMaterial color="#9a7550" roughness={0.55} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * (CLOTH_W / 2 + 0.27), 0, 0]}>
            <sphereGeometry args={[0.075, 24, 16]} />
            <meshStandardMaterial color="#8a6644" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Pulls the camera back far enough that the rod and cloth always fit. */
function Fit() {
  const size = useThree((state) => state.size);
  const get = useThree((state) => state.get);
  useEffect(() => {
    // Read through get() rather than taking the camera from the hook: the
    // camera is a three.js object that is meant to be mutated in place
    const { camera } = get();
    const aspect = size.width / size.height;
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const halfW = CLOTH_W / 2 + 0.45;
    const halfH = CLOTH_H / 2 + 0.3;
    camera.position.z = Math.max(halfH / tan, halfW / (tan * aspect));
    camera.updateProjectionMatrix();
  }, [get, size]);
  return null;
}

export default function DyeCloth({ hex, reduced = false, active = true }) {
  return (
    <Canvas
      // Nothing to draw while the section is off screen
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [0, 0, 6] }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Fit />
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <Cloth hex={hex} reduced={reduced} />
    </Canvas>
  );
}
