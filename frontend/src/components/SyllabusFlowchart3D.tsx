import { Suspense, useMemo, useState, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Text, RoundedBox } from '@react-three/drei';
import FlowchartNode from './FlowchartNode';
import FlowchartConnection from './FlowchartConnection';
import { courseSyllabusDetails } from '@/data/syllabusDetails';
import * as THREE from 'three';

interface SyllabusFlowchart3DProps {
  courseTitle: string;
  features: string[];
  theme?: 'tech' | 'nature' | 'gradient' | 'minimal' | 'warm';
}

// Theme configurations with course-specific styling
const themes = {
  tech: {
    background: 'from-[#0a0f1a] via-[#0d1929] to-[#0a1628]',
    nodeColors: ['#00d4ff', '#00a8cc', '#0088aa', '#00c9ff', '#00b4e6', '#00d9ff'],
    centerColor: '#0066aa',
    ambientLight: 0.4,
    accentColor: '#00d4ff',
    subNodeColor: '#004466',
    glowColor: '#00d4ff'
  },
  nature: {
    background: 'from-[#0a1f1a] via-[#0d2920] to-[#0a2018]',
    nodeColors: ['#00ff88', '#00cc6a', '#00aa55', '#00ff77', '#00dd66', '#00ee77'],
    centerColor: '#006644',
    ambientLight: 0.45,
    accentColor: '#00ff88',
    subNodeColor: '#004433',
    glowColor: '#00ff88'
  },
  gradient: {
    background: 'from-[#1a0a2e] via-[#2d1045] to-[#1f0835]',
    nodeColors: ['#bf5fff', '#a855f7', '#9333ea', '#c084fc', '#d946ef', '#e879f9'],
    centerColor: '#6b21a8',
    ambientLight: 0.4,
    accentColor: '#bf5fff',
    subNodeColor: '#4c1d95',
    glowColor: '#bf5fff'
  },
  minimal: {
    background: 'from-[#1a1a2e] via-[#16213e] to-[#0f0f23]',
    nodeColors: ['#64748b', '#94a3b8', '#cbd5e1', '#475569', '#6b7280', '#9ca3af'],
    centerColor: '#334155',
    ambientLight: 0.5,
    accentColor: '#94a3b8',
    subNodeColor: '#1e293b',
    glowColor: '#64748b'
  },
  warm: {
    background: 'from-[#1f0a0a] via-[#2d1515] to-[#1a0808]',
    nodeColors: ['#ff6b35', '#ff8c42', '#ffb347', '#ff7043', '#ff9800', '#ffc107'],
    centerColor: '#cc4400',
    ambientLight: 0.45,
    accentColor: '#ff6b35',
    subNodeColor: '#662200',
    glowColor: '#ff6b35'
  }
};

// Data Science / ML themed background - Neural network nodes and connections
const DataScienceBackground = ({ color }: { color: string }) => {
  const nodes = useMemo(() => {
    const nodePositions: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      nodePositions.push([
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 18,
        -8 - Math.random() * 8
      ]);
    }
    return nodePositions;
  }, []);

  const connections = useMemo(() => {
    const conns: [[number, number, number], [number, number, number]][] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() > 0.6) {
        const targetIdx = Math.min(i + 1 + Math.floor(Math.random() * 3), nodes.length - 1);
        conns.push([nodes[i], nodes[targetIdx]]);
      }
    }
    return conns;
  }, [nodes]);

  return (
    <group>
      {/* Neural network nodes */}
      {nodes.map((pos, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.5} floatIntensity={0.3}>
          <mesh position={pos}>
            <sphereGeometry args={[0.15 + Math.random() * 0.15, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.4 + Math.random() * 0.3} />
          </mesh>
        </Float>
      ))}
      {/* Neural connections */}
      {connections.map(([start, end], i) => {
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive 
            key={`conn-${i}`} 
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 }))} 
          />
        );
      })}
      {/* Floating data symbols */}
      {['Σ', 'μ', 'σ', '∫', 'Δ', 'π'].map((symbol, i) => (
        <Float key={`sym-${i}`} speed={0.8} floatIntensity={0.5}>
          <Text
            position={[(i - 2.5) * 4, (Math.random() - 0.5) * 8, -6 - Math.random() * 4]}
            fontSize={0.8}
            color={color}
            fillOpacity={0.2}
          >
            {symbol}
          </Text>
        </Float>
      ))}
    </group>
  );
};

// Full Stack themed background - Code brackets and server icons
const FullStackBackground = ({ color }: { color: string }) => {
  const codeElements = useMemo(() => [
    '< / >', '{ }', '( )', '[ ]', '< >', '=> ', '&&', '||', '!=', '==='
  ], []);

  return (
    <group>
      {/* Code brackets floating */}
      {codeElements.map((code, i) => (
        <Float key={i} speed={0.6 + Math.random() * 0.4} floatIntensity={0.4}>
          <Text
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 14,
              -6 - Math.random() * 6
            ]}
            fontSize={0.6 + Math.random() * 0.4}
            color={color}
            fillOpacity={0.15 + Math.random() * 0.15}
          >
            {code}
          </Text>
        </Float>
      ))}
      {/* Server/database icons as boxes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Float key={`server-${i}`} speed={0.4} floatIntensity={0.3}>
          <group position={[(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, -8 - Math.random() * 5]}>
            <RoundedBox args={[0.8, 1.2, 0.4]} radius={0.1}>
              <meshBasicMaterial color={color} transparent opacity={0.12} wireframe />
            </RoundedBox>
            {[0.3, 0, -0.3].map((y, j) => (
              <mesh key={j} position={[0, y, 0.21]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
};

// Data Analytics themed background - Charts and graphs
const DataAnalyticsBackground = ({ color }: { color: string }) => {
  return (
    <group>
      {/* Bar chart representations */}
      {Array.from({ length: 5 }).map((_, chartIdx) => (
        <group 
          key={chartIdx} 
          position={[(chartIdx - 2) * 5, (Math.random() - 0.5) * 10, -8 - Math.random() * 4]}
          rotation={[0, Math.random() * 0.3, 0]}
        >
          {Array.from({ length: 5 }).map((_, barIdx) => (
            <Float key={barIdx} speed={0.3} floatIntensity={0.2}>
              <mesh position={[barIdx * 0.4 - 0.8, (0.3 + Math.random() * 0.6) / 2, 0]}>
                <boxGeometry args={[0.25, 0.3 + Math.random() * 0.6, 0.1]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} />
              </mesh>
            </Float>
          ))}
        </group>
      ))}
      {/* Pie chart segments */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Float key={`pie-${i}`} speed={0.5} floatIntensity={0.3}>
          <mesh 
            position={[(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, -10 - Math.random() * 3]}
            rotation={[0, 0, Math.random() * Math.PI]}
          >
            <ringGeometry args={[0.5, 1, 32, 1, 0, Math.PI * (0.5 + Math.random() * 1)]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        </Float>
      ))}
      {/* Percentage symbols */}
      {['%', '$', '↑', '↓', '📊'].map((sym, i) => (
        <Float key={`stat-${i}`} speed={0.6} floatIntensity={0.4}>
          <Text
            position={[(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, -7 - Math.random() * 4]}
            fontSize={0.7}
            color={color}
            fillOpacity={0.2}
          >
            {sym}
          </Text>
        </Float>
      ))}
    </group>
  );
};

// Web Development themed background - Browser windows and HTML tags
const WebDevBackground = ({ color }: { color: string }) => {
  const htmlTags = ['<div>', '</div>', '<head>', '<body>', '<p>', '<a>', '<img>', '<css>', '<js>'];

  return (
    <group>
      {/* Browser window outlines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Float key={`browser-${i}`} speed={0.4} floatIntensity={0.25}>
          <group position={[(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, -9 - Math.random() * 4]}>
            {/* Browser frame */}
            <RoundedBox args={[3, 2, 0.1]} radius={0.1}>
              <meshBasicMaterial color={color} transparent opacity={0.08} />
            </RoundedBox>
            {/* Title bar */}
            <mesh position={[0, 0.85, 0.06]}>
              <planeGeometry args={[2.9, 0.25]} />
              <meshBasicMaterial color={color} transparent opacity={0.15} />
            </mesh>
            {/* Browser dots */}
            {[-1.2, -1, -0.8].map((x, j) => (
              <mesh key={j} position={[x, 0.85, 0.08]}>
                <circleGeometry args={[0.05, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
      {/* HTML tags */}
      {htmlTags.map((tag, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.3} floatIntensity={0.35}>
          <Text
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 14,
              -6 - Math.random() * 5
            ]}
            fontSize={0.4 + Math.random() * 0.3}
            color={color}
            fillOpacity={0.18}
          >
            {tag}
          </Text>
        </Float>
      ))}
    </group>
  );
};

// Python themed background - Python symbols and code snippets
const PythonBackground = ({ color }: { color: string }) => {
  const pythonElements = ['def', 'class', 'import', 'for', 'while', 'if', 'else', 'return', 'print()', 'lambda'];

  return (
    <group>
      {/* Python code keywords */}
      {pythonElements.map((elem, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.4} floatIntensity={0.35}>
          <Text
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 14,
              -6 - Math.random() * 6
            ]}
            fontSize={0.45 + Math.random() * 0.25}
            color={color}
            fillOpacity={0.2}
          >
            {elem}
          </Text>
        </Float>
      ))}
      {/* Snake-like curves */}
      {Array.from({ length: 3 }).map((_, i) => {
        const points: THREE.Vector3[] = [];
        for (let j = 0; j < 20; j++) {
          points.push(new THREE.Vector3(
            (j - 10) * 0.5 + (Math.random() - 0.5) * 8,
            Math.sin(j * 0.5) * 2 + (Math.random() - 0.5) * 6,
            -10 - i * 2
          ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        return (
          <primitive 
            key={`curve-${i}`} 
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 }))} 
          />
        );
      })}
    </group>
  );
};

// Digital Marketing themed background - Social icons and engagement symbols
const MarketingBackground = ({ color }: { color: string }) => {
  const marketingSymbols = ['@', '#', '♥', '↗', '📈', '🎯', '💬', '👁', '🔔', '$'];

  return (
    <group>
      {/* Social/marketing symbols */}
      {marketingSymbols.map((sym, i) => (
        <Float key={i} speed={0.6 + Math.random() * 0.5} floatIntensity={0.45}>
          <Text
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 14,
              -5 - Math.random() * 6
            ]}
            fontSize={0.6 + Math.random() * 0.4}
            color={color}
            fillOpacity={0.22}
          >
            {sym}
          </Text>
        </Float>
      ))}
      {/* Connection lines representing networks */}
      {Array.from({ length: 15 }).map((_, i) => {
        const start = new THREE.Vector3(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 12,
          -8 - Math.random() * 4
        );
        const end = new THREE.Vector3(
          start.x + (Math.random() - 0.5) * 6,
          start.y + (Math.random() - 0.5) * 6,
          start.z + (Math.random() - 0.5) * 2
        );
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        return (
          <primitive 
            key={`net-${i}`} 
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.1 }))} 
          />
        );
      })}
    </group>
  );
};

// Get appropriate background based on course ID
const CourseBackground = ({ courseId, color }: { courseId: string; color: string }) => {
  switch (courseId) {
    case 'data-science':
      return <DataScienceBackground color={color} />;
    case 'data-analytics':
      return <DataAnalyticsBackground color={color} />;
    case 'python-sql':
    case 'python-basics':
      return <PythonBackground color={color} />;
    case 'full-stack':
      return <FullStackBackground color={color} />;
    case 'web-development':
      return <WebDevBackground color={color} />;
    case 'digital-marketing':
      return <MarketingBackground color={color} />;
    case 'sql-language':
      return <DataAnalyticsBackground color={color} />;
    case 'augmented-reality':
      return <DataScienceBackground color={color} />;
    default:
      return <DataScienceBackground color={color} />;
  }
};

// Camera controller for smooth transitions
const CameraController = ({ 
  targetPosition, 
  targetLookAt,
  isZoomed 
}: { 
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isZoomed: boolean;
}) => {
  const cameraRef = useRef({ position: new THREE.Vector3(0, 0, 12), lookAt: new THREE.Vector3(0, 0, 0) });
  
  useFrame(({ camera }) => {
    cameraRef.current.position.lerp(new THREE.Vector3(...targetPosition), 0.04);
    cameraRef.current.lookAt.lerp(new THREE.Vector3(...targetLookAt), 0.04);
    camera.position.copy(cameraRef.current.position);
    camera.lookAt(cameraRef.current.lookAt);
  });
  
  return null;
};

// Back button in 3D space
const BackButton = ({ onClick, position, visible }: { onClick: () => void; position: [number, number, number]; visible: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      const targetScale = visible ? (hovered ? 1.15 : 1) : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0, 0, 0]}>
      <mesh
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={onClick}
      >
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color={hovered ? '#22c55e' : '#ffffff'} emissive={hovered ? '#22c55e' : '#3b82f6'} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color={hovered ? '#ffffff' : '#1a1a2e'}
        anchorX="center"
        anchorY="middle"
      >
        ←
      </Text>
      <Text
        position={[0, -0.85, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.9}
      >
        Back
      </Text>
    </group>
  );
};

interface FlowchartSceneProps extends SyllabusFlowchart3DProps {
  courseId?: string;
}

const FlowchartScene = ({ courseTitle, features, theme = 'tech', courseId }: FlowchartSceneProps) => {
  const themeConfig = themes[theme];
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const syllabusDetails = courseId ? courseSyllabusDetails[courseId] || {} : {};
  
  const getNodePosition = (index: number, total: number): [number, number, number] => {
    const radius = 4.2;
    const angleOffset = -Math.PI / 2;
    const angle = (index / total) * Math.PI * 2 + angleOffset;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.65,
      0
    ];
  };

  const getSubNodePosition = (index: number, total: number, parentPos: [number, number, number]): [number, number, number] => {
    const radius = 2.2;
    const startAngle = -Math.PI / 2;
    const angleSpread = Math.PI * 1.4;
    const angle = startAngle + (index / (total - 1 || 1)) * angleSpread;
    return [
      parentPos[0] + Math.cos(angle) * radius,
      parentPos[1] + Math.sin(angle) * radius * 0.55,
      0.3
    ];
  };

  const centerPosition: [number, number, number] = [0, 0, 0];
  
  const selectedIndex = selectedFeature ? features.indexOf(selectedFeature) : -1;
  const selectedPosition = selectedIndex >= 0 ? getNodePosition(selectedIndex, features.length) : centerPosition;
  const subtopics = selectedFeature ? syllabusDetails[selectedFeature] || [] : [];

  const defaultCameraPos: [number, number, number] = [0, 0, 12];
  const zoomedCameraPos: [number, number, number] = [selectedPosition[0] * 0.25, selectedPosition[1] * 0.25, 7];
  
  const handleFeatureClick = useCallback((feature: string) => {
    if (syllabusDetails[feature] && syllabusDetails[feature].length > 0) {
      setSelectedFeature(feature);
      setIsZoomed(true);
    }
  }, [syllabusDetails]);

  const handleBack = useCallback(() => {
    setSelectedFeature(null);
    setIsZoomed(false);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={defaultCameraPos} fov={55} />
      <CameraController 
        targetPosition={isZoomed ? zoomedCameraPos : defaultCameraPos}
        targetLookAt={isZoomed ? selectedPosition : centerPosition}
        isZoomed={isZoomed}
      />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        autoRotate={!isZoomed}
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={themeConfig.ambientLight} />
      <pointLight position={[8, 8, 8]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-8, -8, -8]} intensity={0.6} color={themeConfig.accentColor} />
      <pointLight position={[0, 0, 6]} intensity={0.4} color={themeConfig.glowColor} />
      <spotLight 
        position={[0, 10, 5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={0.8}
        color="#ffffff"
      />

      {/* Course-specific themed background */}
      {courseId && <CourseBackground courseId={courseId} color={themeConfig.accentColor} />}

      {/* Back button */}
      <BackButton 
        onClick={handleBack} 
        position={[-5.5, 3.2, 1.5]} 
        visible={isZoomed}
      />

      {/* Center node - Course Title with glow */}
      <FlowchartNode
        position={centerPosition}
        text={courseTitle}
        color={themeConfig.centerColor}
        delay={0}
        isCenter
        isClickable={false}
      />

      {/* Feature nodes */}
      {features.map((feature, index) => {
        const position = getNodePosition(index, features.length);
        const isSelected = feature === selectedFeature;
        const hasSubtopics = syllabusDetails[feature] && syllabusDetails[feature].length > 0;
        
        return (
          <group key={index}>
            <FlowchartConnection
              start={centerPosition}
              end={position}
              delay={index + 1}
              color={isSelected ? '#22c55e' : themeConfig.accentColor}
              animated={isSelected}
            />
            <FlowchartNode
              position={position}
              text={feature}
              color={themeConfig.nodeColors[index % themeConfig.nodeColors.length]}
              delay={index + 1}
              onClick={() => handleFeatureClick(feature)}
              isSelected={isSelected}
              isClickable={hasSubtopics}
            />
            
            {/* Subtopics when selected */}
            {isSelected && subtopics.map((subtopic, subIndex) => {
              const subPosition = getSubNodePosition(subIndex, subtopics.length, position);
              return (
                <group key={`sub-${subIndex}`}>
                  <FlowchartConnection
                    start={position}
                    end={subPosition}
                    delay={subIndex * 0.08}
                    color={themeConfig.accentColor}
                    isSubConnection
                  />
                  <FlowchartNode
                    position={subPosition}
                    text={subtopic}
                    color={themeConfig.subNodeColor}
                    delay={subIndex * 0.08}
                    isSubNode
                    isClickable={false}
                  />
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
};

// Map course IDs to themes
const courseThemeMap: Record<string, 'tech' | 'nature' | 'gradient' | 'minimal' | 'warm'> = {
  'data-science': 'tech',
  'data-analytics': 'gradient',
  'python-sql': 'nature',
  'full-stack': 'minimal',
  'web-development': 'warm',
  'python-basics': 'nature',
  'augmented-reality': 'gradient',
  'sql-language': 'tech',
  'digital-marketing': 'warm'
};

interface SyllabusFlowchart3DContainerProps extends SyllabusFlowchart3DProps {
  courseId?: string;
}

const SyllabusFlowchart3D = ({ courseTitle, features, courseId }: SyllabusFlowchart3DContainerProps) => {
  const theme = courseId ? courseThemeMap[courseId] || 'tech' : 'tech';
  const themeConfig = themes[theme];

  return (
    <div className={`relative w-full h-[550px] bg-gradient-to-br ${themeConfig.background} rounded-2xl overflow-hidden border border-white/20 shadow-2xl`}>
      {/* Glow effect overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${themeConfig.accentColor}15 0%, transparent 70%)`
        }}
      />
      <Canvas gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <FlowchartScene 
            courseTitle={courseTitle} 
            features={features} 
            theme={theme}
            courseId={courseId}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 text-sm text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
        🎯 Click topic to explore • 🖱️ Drag to rotate • 🔍 Scroll to zoom
      </div>
    </div>
  );
};

export default SyllabusFlowchart3D;
