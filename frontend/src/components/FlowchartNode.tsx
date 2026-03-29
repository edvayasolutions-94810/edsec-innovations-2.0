import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FlowchartNodeProps {
  position: [number, number, number];
  text: string;
  color: string;
  delay?: number;
  isCenter?: boolean;
  isSubNode?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isClickable?: boolean;
}

const FlowchartNode = ({ 
  position, 
  text, 
  color, 
  delay = 0, 
  isCenter = false,
  isSubNode = false,
  onClick,
  isSelected = false,
  isClickable = true
}: FlowchartNodeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(delay === 0 ? 1 : 0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Floating animation
      const floatIntensity = isSubNode ? 0.04 : 0.06;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + delay) * floatIntensity;
      
      // Gentle rotation on hover
      if (hovered && isClickable) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.12, 0.08);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
      }

      // Entry animation
      if (animationProgress < 1 && state.clock.elapsedTime > delay * 0.12) {
        const newProgress = Math.min(1, animationProgress + delta * 3.5);
        setAnimationProgress(newProgress);
      }

      // Scale animation
      let baseScale = isCenter ? 1.25 : isSubNode ? 0.75 : 1;
      const hoverScale = hovered && isClickable ? 1.12 : 1;
      const selectedScale = isSelected ? 1.1 : 1;
      const targetScale = baseScale * hoverScale * selectedScale * animationProgress;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }

    // Glow pulsing effect
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + delay) * 0.15 + 0.85;
      const baseOpacity = isSelected ? 0.5 : hovered ? 0.4 : isCenter ? 0.3 : 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = baseOpacity * pulse * animationProgress;
    }
  });

  const boxWidth = isCenter ? 3.8 : isSubNode ? 2.0 : 3.0;
  const boxHeight = isCenter ? 1.3 : isSubNode ? 0.65 : 0.9;
  const boxDepth = isSubNode ? 0.2 : 0.3;

  const handlePointerOver = () => {
    if (isClickable) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    if (onClick && isClickable) {
      onClick();
    }
  };

  const nodeColor = isSelected ? '#22c55e' : hovered && isClickable ? '#4ade80' : color;

  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1], position[2]]}
      scale={[0, 0, 0]}
    >
      {/* Outer glow effect */}
      <RoundedBox
        ref={glowRef}
        args={[boxWidth + 0.4, boxHeight + 0.4, boxDepth * 0.5]}
        radius={0.2}
        smoothness={4}
        position={[0, 0, -0.1]}
      >
        <meshBasicMaterial 
          color={nodeColor}
          transparent
          opacity={0.2}
        />
      </RoundedBox>

      {/* Main node box */}
      <RoundedBox
        args={[boxWidth, boxHeight, boxDepth]}
        radius={0.15}
        smoothness={4}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial 
          color={nodeColor}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={Math.min(1, animationProgress * 1.2)}
          emissive={nodeColor}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.3 : 0.15}
        />
      </RoundedBox>
      
      {/* Inner highlight */}
      <RoundedBox
        args={[boxWidth - 0.15, boxHeight - 0.1, boxDepth + 0.05]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0.02]}
      >
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.08}
        />
      </RoundedBox>

      {/* Text */}
      <Text
        position={[0, 0, boxDepth / 2 + 0.08]}
        fontSize={isCenter ? 0.26 : isSubNode ? 0.135 : 0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={boxWidth - 0.25}
        textAlign="center"
        font="/fonts/inter-bold.woff"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {text}
      </Text>
      
      {/* Click hint for clickable nodes */}
      {isClickable && !isCenter && !isSubNode && (
        <group position={[0, -boxHeight / 2 - 0.22, boxDepth / 2]}>
          <Text
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={hovered ? 0.9 : 0.5}
          >
            {hovered ? '→ Click to explore' : '◇ Tap to expand'}
          </Text>
        </group>
      )}

      {/* Selected indicator ring */}
      {isSelected && (
        <mesh position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
          <ringGeometry args={[Math.max(boxWidth, boxHeight) * 0.7, Math.max(boxWidth, boxHeight) * 0.75, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export default FlowchartNode;
