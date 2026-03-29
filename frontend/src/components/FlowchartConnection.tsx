import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowchartConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
  color?: string;
  isSubConnection?: boolean;
  animated?: boolean;
}

const FlowchartConnection = ({ 
  start, 
  end, 
  delay = 0,
  color = '#6366f1',
  isSubConnection = false,
  animated = false
}: FlowchartConnectionProps) => {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current && animated) {
      // Pulsing animation for active connections
      const pulse = Math.sin(state.clock.elapsedTime * 3 + delay) * 0.3 + 0.7;
      materialRef.current.opacity = pulse;
    }
  });

  const lineObject = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);
    mid.z += isSubConnection ? 0.3 : 0.5;
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: isSubConnection ? 0.5 : 0.7
    });
    
    return new THREE.Line(geometry, material);
  }, [start, end, color, isSubConnection]);

  return <primitive object={lineObject} />;
};

export default FlowchartConnection;
