'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { Mesh, Group, Vector3 } from 'three';
import { hexToWorld } from '@/lib/hexUtils';
import { hexEqual } from '@/lib/hexUtils';
import { CATEGORY_HEX_COLORS } from '@/lib/constants';
import { useGameStore } from '@/store/useGameStore';
import { useGameActions } from '@/hooks/useGameActions';
import type { Unit, HexCoord } from '@/lib/types';

interface UnitMeshProps {
  unit: Unit;
  visible: boolean;
}

function UnitMesh({ unit, visible }: UnitMeshProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { selectedUnit, combatAnimation } = useGameStore();
  const { selectGameUnit } = useGameActions();

  const isSelected = selectedUnit?.unitId === unit.id;
  const isAttacking = combatAnimation?.attackerId === unit.id;
  const isDefending = combatAnimation?.defenderId === unit.id;
  const color = CATEGORY_HEX_COLORS[unit.category];

  const [wx, , wz] = unit.position ? hexToWorld(unit.position.q, unit.position.r) : [0, 0, 0];
  const targetPos = useMemo(() => new Vector3(wx, 0, wz), [wx, wz]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Smooth movement interpolation
    groupRef.current.position.lerp(targetPos, Math.min(delta * 6, 1));

    // Idle bob animation
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(Date.now() * 0.002 + unit.id.charCodeAt(0)) * 0.04 + 0.5;
    }

    // Attack lunge
    if (isAttacking && meshRef.current) {
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.02) * 0.3;
    }
  });

  const hpPercent = unit.hp / unit.maxHp;

  if (!visible || !unit.position) return null;

  return (
    <group ref={groupRef} position={[wx, 0, wz]}>
      {/* Unit body */}
      <mesh
        ref={meshRef}
        castShadow
        position={[0, 0.5, 0]}
        onClick={(e) => { e.stopPropagation(); selectGameUnit(unit); }}
        onPointerEnter={(e) => e.stopPropagation()}
      >
        <UnitGeometry category={unit.category} />
        <meshStandardMaterial
          color={isSelected ? 0xffffff : color}
          emissive={isSelected ? color : (isAttacking ? 0xff4400 : 0x000000)}
          emissiveIntensity={isSelected ? 0.4 : (isAttacking ? 0.8 : 0)}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshStandardMaterial color={0x60a5fa} emissive={0x60a5fa} emissiveIntensity={1.5} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Hit flash */}
      {isDefending && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color={0xff0000} emissive={0xff0000} emissiveIntensity={2} transparent opacity={0.25} />
        </mesh>
      )}

      {/* HP bar (billboard) */}
      <Billboard position={[0, 1.4, 0]}>
        <HPBarMesh percent={hpPercent} />
        <Text
          position={[0, 0.28, 0]}
          fontSize={0.18}
          color="#f9fafb"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {unit.name}
        </Text>
      </Billboard>
    </group>
  );
}

function UnitGeometry({ category }: { category: string }) {
  switch (category) {
    case 'offense':
      return <coneGeometry args={[0.32, 0.7, 4]} />;
    case 'defense':
      return <boxGeometry args={[0.55, 0.55, 0.55]} />;
    case 'support':
      return <sphereGeometry args={[0.32, 10, 10]} />;
    case 'special':
      return <octahedronGeometry args={[0.38]} />;
    default:
      return <boxGeometry args={[0.4, 0.4, 0.4]} />;
  }
}

function HPBarMesh({ percent }: { percent: number }) {
  const BAR_W = 0.8;
  const color = percent > 0.6 ? 0x10b981 : percent > 0.3 ? 0xf59e0b : 0xef4444;

  return (
    <group>
      {/* Background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[BAR_W, 0.1]} />
        <meshBasicMaterial color={0x1f2937} />
      </mesh>
      {/* Fill */}
      <mesh position={[(BAR_W * percent - BAR_W) / 2, 0, 0.001]}>
        <planeGeometry args={[BAR_W * percent, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─── Multi-unit renderer ──────────────────────────────────────────────────────

interface UnitMeshesProps {
  units: Unit[];
  visibleTiles: HexCoord[];
  showFog: boolean;
}

export function UnitMeshes({ units, visibleTiles, showFog }: UnitMeshesProps) {
  return (
    <>
      {units.map((unit) => {
        const isVisible =
          !showFog ||
          !unit.position ||
          visibleTiles.some((t) => unit.position && hexEqual(t, unit.position));

        return <UnitMesh key={unit.id} unit={unit} visible={isVisible} />;
      })}
    </>
  );
}
