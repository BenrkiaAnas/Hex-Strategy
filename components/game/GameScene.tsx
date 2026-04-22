'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { HexGrid } from './HexGrid';
import { UnitMeshes } from './Unit';
import { CameraRig } from './Camera';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';

export function GameScene() {
  const { match } = useMatchStore();
  const { showFog } = useGameStore();

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [14, 18, 14], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-8, 6, -8]} intensity={0.4} color="#3b82f6" />

        {/* Background */}
        <Stars radius={80} depth={40} count={3000} factor={3} fade />
        <color attach="background" args={['#0a0e1a']} />
        <fog attach="fog" args={['#0a0e1a', 40, 90]} />

        <Suspense fallback={null}>
          {/* Hex battlefield */}
          <HexGrid />

          {/* Units */}
          {match && (
            <UnitMeshes
              units={Object.values(match.units)}
              visibleTiles={match.visibleTiles}
              showFog={showFog}
            />
          )}
        </Suspense>

        {/* Camera controls */}
        <CameraRig />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={35}
          target={[0, 0, 0]}
          panSpeed={0.6}
          rotateSpeed={0.4}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
