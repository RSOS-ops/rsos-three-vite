import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoundedRectangle } from './RoundedRectangle';
import { GLTFModel } from './GLTFModel';
import { PostProcessing } from './PostProcessing';
import { GridFloor } from './GridFloor';


import { useState } from 'react';
import { CameraAnimator } from './CameraAnimator';

export function Scene() {
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [flyCamera, setFlyCamera] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Lock/Unlock Camera Button */}
      <button
        onClick={() => setControlsEnabled((v) => !v)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#fff',
          color: '#222',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 10,
          fontSize: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        title={controlsEnabled ? 'Lock Camera' : 'Unlock Camera'}
        aria-label={controlsEnabled ? 'Lock Camera' : 'Unlock Camera'}
      >
        {controlsEnabled ? '🔓' : '🔒'}
      </button>
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
          enabled={controlsEnabled}
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={100}
        />

        {/* Rounded rectangles positioned behind the gate model */}
        <RoundedRectangle position={[-6, 4, -610]} />
        <RoundedRectangle position={[0, 4, -610]} /> 
        <RoundedRectangle position={[6, 4, -610]} />

        {/* Gate model */}

        <GLTFModel 
          modelPath="/models/gate-animated-2-emissive.glb"
          position={[0, -3.5, -5]}
          scale={[10, 10, 10]}
          onAnimationComplete={() => {
            setTimeout(() => setFlyCamera(true), 500);
          }}
        />

        {/* Camera fly animation after gate animation completes */}
        <CameraAnimator
          targetPosition={[0, 0, -590]}
          duration={1.5}
          delay={0}
          trigger={flyCamera}
        />

        {/* Grid floor - reusable component with configurable dimensions */}
        <GridFloor 
          position={[0, -5, 0]}
          width={8}
          length={590}
          gridSpacing={2}
          horizontalLineColor="#6287f8"
          verticalLineColor={0xce02d4}
          horizontalEmissiveIntensity={4.5}
          verticalEmissiveIntensity={4.5}
          opacity={0.7}
          lineThickness={0.02}
        />

        {/* Post-processing effects */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}