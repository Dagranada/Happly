import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Trophy } from 'lucide-react';

/* Medidas del modelo (unidades de escena) */
const RIM_Y = 3.15;

const GOLD = '#FFBA24';
const GOLD_DEEP = '#EE8A08';

/** Perfil suave (spline por los puntos clave) torneado alrededor del eje Y. */
function smoothLathe(keys: [number, number][], divisions = 120, segments = 192) {
  const curve = new THREE.SplineCurve(keys.map(([r, y]) => new THREE.Vector2(r, y)));
  return new THREE.LatheGeometry(curve.getPoints(divisions), segments);
}

/** Estrella con puntas y valles redondeados, para un relieve "inflado". */
function roundedStar(outer: number, inner: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    return new THREE.Vector2(r * Math.cos(a), r * Math.sin(a));
  });
  const mid = (a: THREE.Vector2, b: THREE.Vector2) => a.clone().add(b).multiplyScalar(0.5);
  const shape = new THREE.Shape();
  const start = mid(pts[9], pts[0]);
  shape.moveTo(start.x, start.y);
  for (let i = 0; i < 10; i++) {
    const m = mid(pts[i], pts[(i + 1) % 10]);
    shape.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
  }
  return shape;
}

/** Copa: cuenco, reborde, asas en lazo, pie y base con perfiles suaves, y estrella en relieve. */
function buildTrophy(): { group: THREE.Group; dispose: () => void } {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const body = new THREE.MeshPhysicalMaterial({
    color: GOLD,
    roughness: 0.42,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
  });
  const accent = body.clone();
  accent.color = new THREE.Color(GOLD_DEEP);
  disposables.push(body, accent);

  const add = (geometry: THREE.BufferGeometry, material: THREE.Material = body) => {
    disposables.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    return mesh;
  };

  /* Cuenco */
  const bowlKeys: [number, number][] = [
    [1.1, 3.15],
    [1.13, 2.95],
    [1.08, 2.55],
    [0.93, 2.05],
    [0.68, 1.6],
    [0.42, 1.3],
    [0.25, 1.12],
    [0.12, 1.06],
    [0, 1.05],
  ];
  add(smoothLathe(bowlKeys));

  /* Pie y base en una sola pieza para que la unión sea continua */
  add(
    smoothLathe(
      [
        [0.2, 1.1],
        [0.2, 0.95],
        [0.25, 0.72],
        [0.4, 0.5],
        [0.66, 0.38],
        [0.92, 0.33],
        [1.02, 0.26],
        [1.02, 0.12],
        [0.92, 0.03],
        [0.7, 0],
        [0, 0],
      ],
      140
    )
  );

  /* Reborde y collar */
  const rim = add(new THREE.TorusGeometry(1.1, 0.11, 48, 192));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = RIM_Y;
  const collar = add(new THREE.TorusGeometry(0.3, 0.09, 40, 120));
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.04;

  /* Asas */
  const handle = (side: 1 | -1) => {
    const curve = new THREE.CatmullRomCurve3(
      [
        [1.0, 2.8],
        [1.55, 2.85],
        [1.95, 2.55],
        [1.95, 2.0],
        [1.6, 1.55],
        [0.92, 1.35],
      ].map(([x, y]) => new THREE.Vector3(side * x, y, 0)),
      false,
      'centripetal'
    );
    add(new THREE.TubeGeometry(curve, 160, 0.12, 32, false));
    for (const [x, y] of [
      [1.0, 2.8],
      [0.92, 1.35],
    ]) {
      const cap = add(new THREE.SphereGeometry(0.12, 32, 24));
      cap.position.set(side * x, y, 0);
    }
  };
  handle(1);
  handle(-1);

  /* Estrella en relieve, teselada y curvada para abrazar el cuenco */
  const starY = 2.0;
  const surfaceR = 1.04;
  let starGeo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(roundedStar(0.8, 0.4), {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 12,
    curveSegments: 14,
  });
  starGeo = new TessellateModifier(0.1, 8).modify(starGeo);
  const pos = starGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, pos.getZ(i) + Math.sqrt(Math.max(surfaceR * surfaceR - x * x, 0)) - 0.05);
  }
  starGeo.deleteAttribute('normal');
  starGeo.deleteAttribute('uv');
  starGeo = mergeVertices(starGeo, 1e-4);
  starGeo.computeVertexNormals();
  disposables.push(starGeo);

  const front = new THREE.Mesh(starGeo, accent);
  front.position.y = starY;
  const back = front.clone();
  back.rotation.y = Math.PI;
  group.add(front, back);

  return { group, dispose: () => disposables.forEach((d) => d.dispose()) };
}

interface Trophy3DProps {
  className?: string;
}

/**
 * Copa dorada en 3D que gira sobre su eje. Entra con un giro rápido que se
 * va frenando hasta la velocidad de crucero. Si WebGL no está disponible,
 * muestra el ícono de copa plano.
 */
const Trophy3D: React.FC<Trophy3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 3.1, 9.6);
    camera.lookAt(0, 1.65, 0);

    /* Luz de estudio suave (reflejos amplios) + una luz de relleno cálida */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.5;
    const key = new THREE.DirectionalLight('#fff1cc', 1.3);
    key.position.set(3, 5, 6);
    scene.add(key);

    const { group, dispose } = buildTrophy();
    const pivot = new THREE.Group();
    pivot.add(group);
    pivot.rotation.z = -0.07;
    scene.add(pivot);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      if (reduceMotion) {
        group.rotation.y = 0.5;
      } else {
        /* velocidad = crucero + impulso inicial que decae (integral de la velocidad) */
        group.rotation.y = 0.9 * t + (14 / 2.4) * (1 - Math.exp(-2.4 * t));
        pivot.position.y = Math.sin(t * 1.6) * 0.06;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="w-24 h-24 rounded-full gold-medal flex items-center justify-center shadow-lg">
          <Trophy className="w-12 h-12 text-warning-800 stroke-[1.8]" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className={className} role="img" aria-label="Copa ganada" />;
};

export default Trophy3D;
