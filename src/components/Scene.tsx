import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoundedRectangle } from './RoundedRectangle';
import { GLTFModel } from './GLTFModel';
import { PostProcessing } from './PostProcessing';

export function Scene() {
  console.log('Scene component rendering...');
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        gl={{ antialias: true }}
        style={{ background: 'black' }}
      >
        {/* Lighting */}
        <ambientLight intensity={125} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={25} 
        />

        {/* Smooth camera controls */}
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={100}
        />

        {/* Rounded rectangles positioned behind the gate model */}
        <RoundedRectangle position={[-6, 4, -30]} />
        <RoundedRectangle position={[0, 4, -30]} />
        <RoundedRectangle position={[6, 4, -30]} />

        {/* Gate model */}
        <GLTFModel 
          modelPath="/models/gate-animated-2-emissive.glb"
          position={[0, -3.5, -5]}
          scale={[10, 10, 10]}
        />

        {/* Clean grid floor - horizontal and vertical lines only */}
        <group position={[0, -5, 0]}>
          {/* Horizontal lines */}
          {Array.from({ length: 201 }, (_, i) => {
            const z = (i - 100) * 2;
            return (
              <mesh key={`h-${i}`} position={[0, 0, z]}>
                <boxGeometry args={[8, 0.02, 0.02]} />
                <meshStandardMaterial 
                  color={"#6287f8"}
                  emissive={"#6287f8"}
                  emissiveIntensity={4.5}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
          {/* Vertical lines */}
          {Array.from({ length: 5 }, (_, i) => {
            const x = (i - 2) * 2;
            return (
              <mesh key={`v-${i}`} position={[x, 0, 0]}>
                <boxGeometry args={[0.02, 0.02, 400]} />
                <meshStandardMaterial 
                  color={0xce02d4}
                  emissive={0xce02d4}
                  emissiveIntensity={4.5}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </group>

        {/* Post-processing effects */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}