import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const FabricPlane = ({ imageUrl, mousePosition }) => {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, imageUrl);
    const { viewport } = useThree();
    const progressRef = useRef({ value: 0 });
    const originalPositionsRef = useRef(null);

    // Create textured material
    const material = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
    }, [texture]);

    // Animate on texture change
    useEffect(() => {
        if (texture && meshRef.current) {
            const geometry = meshRef.current.geometry;
            const positions = geometry.attributes.position.array;

            // Store original positions
            if (!originalPositionsRef.current) {
                originalPositionsRef.current = new Float32Array(positions);
            }

            // Apply non-uniform initial distortion
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];

                const distanceFromCenter = Math.sqrt(x * x + y * y);
                const angle = Math.atan2(y, x);

                const randomNoise = (Math.random() - 0.5) * 3;
                const positionNoise = Math.sin(angle * 3) * Math.cos(distanceFromCenter * 2) * 2;
                const combinedNoise = randomNoise + positionNoise;

                positions[i + 2] = combinedNoise;
            }
            geometry.attributes.position.needsUpdate = true;

            // Animate back to flat
            progressRef.current.value = 0;
            gsap.to(progressRef.current, {
                value: 1,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                    const progress = progressRef.current.value;

                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 2] = positions[i + 2] * (1 - progress);
                    }
                    geometry.attributes.position.needsUpdate = true;
                }
            });
        }
    }, [texture]);

    // Mouse interaction
    useFrame((state) => {
        if (meshRef.current && originalPositionsRef.current && progressRef.current.value === 1) {
            const geometry = meshRef.current.geometry;
            const positions = geometry.attributes.position.array;
            const time = state.clock.getElapsedTime();

            // Apply mouse-based distortion
            if (mousePosition) {
                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositionsRef.current[i];
                    const y = originalPositionsRef.current[i + 1];

                    // Calculate distance from mouse position
                    const dx = x - mousePosition.x;
                    const dy = y - mousePosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Create localized distortion around mouse (radius of 0.3)
                    const influence = Math.max(0, 1 - distance / 0.3);
                    const distortion = influence * 0.5 * Math.sin(time * 3);

                    positions[i + 2] = distortion;
                }
                geometry.attributes.position.needsUpdate = true;
            }
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]} material={material}>
            <planeGeometry args={[1, 1, 16, 16]} />
        </mesh>
    );
};

const FabricBackground = ({ imageUrl }) => {
    const [mousePosition, setMousePosition] = useState(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            // Convert screen coordinates to normalized device coordinates (-1 to +1)
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (!imageUrl) return null;

    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={1} />
                <Suspense fallback={null}>
                    <FabricPlane imageUrl={imageUrl} mousePosition={mousePosition} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default FabricBackground;
