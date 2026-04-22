'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameStore } from '@/store/useGameStore';

export function CameraRig() {
  const { camera } = useThree();
  const { cameraTarget } = useGameStore();
  const targetVec = useRef(new Vector3(0, 0, 0));

  useFrame((_, delta) => {
    targetVec.current.set(...cameraTarget);
    // Smooth camera target following
    camera.position.lerp(
      new Vector3(
        cameraTarget[0] + 14,
        cameraTarget[1] + 18,
        cameraTarget[2] + 14
      ),
      Math.min(delta * 3, 1)
    );
  });

  return null;
}
