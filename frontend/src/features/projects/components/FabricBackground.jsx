import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/* =========================
   Fabric Plane
========================= */
const FabricPlane = ({ imageUrl, mousePosition }) => {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { viewport } = useThree();

  const progressRef = useRef({ value: 0 });
  const originalPositionsRef = useRef(null);

  /* Fix color space */
  useEffect(() => {
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.anisotropy = 16;
  }, [texture]);

  /* Material */
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
  }, [texture]);

  /* -------- COVER SCALING (KEY FIX) -------- */
  const scale = useMemo(() => {
    if (!texture?.image) return [1, 1, 1];

    const imageAspect =
      texture.image.width / texture.image.height;
    const viewportAspect =
      viewport.width / viewport.height;

    let width, height;

    if (viewportAspect > imageAspect) {
      width = viewport.width;
      height = viewport.width / imageAspect;
    } else {
      height = viewport.height;
      width = viewport.height * imageAspect;
    }

    return [width, height, 1];
  }, [texture, viewport]);

  /* Initial distortion animation */
  useEffect(() => {
    if (!texture || !meshRef.current) return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;

    if (!originalPositionsRef.current) {
      originalPositionsRef.current = new Float32Array(positions);
    }

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      const distance = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);

      const noise =
        (Math.random() - 0.5) * 2 +
        Math.sin(angle * 3) * Math.cos(distance * 2);

      positions[i + 2] = noise;
    }

    geometry.attributes.position.needsUpdate = true;

    progressRef.current.value = 0;

    gsap.to(progressRef.current, {
      value: 1,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        const p = progressRef.current.value;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] *= 1 - p;
        }
        geometry.attributes.position.needsUpdate = true;
      },
    });
  }, [texture]);

  /* Mouse interaction */
  useFrame((state) => {
    if (
      !meshRef.current ||
      !originalPositionsRef.current ||
      progressRef.current.value !== 1 ||
      !mousePosition
    )
      return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositionsRef.current[i];
      const y = originalPositionsRef.current[i + 1];

      const dx = x - mousePosition.x;
      const dy = y - mousePosition.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const influence = Math.max(0, 1 - dist / 0.3);
      positions[i + 2] = influence * 0.4 * Math.sin(time * 3);
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} scale={scale} material={material}>
      <planeGeometry args={[1, 1, 24, 24]} />
    </mesh>
  );
};

/* =========================
   Fabric Background
========================= */
const FabricBackground = ({ imageUrl }) => {
  const [mousePosition, setMousePosition] = useState(null);

  useEffect(() => {
    const handleMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }} flat>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <FabricPlane
            imageUrl={imageUrl}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FabricBackground;
