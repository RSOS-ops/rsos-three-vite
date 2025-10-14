import { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GLTFModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  onAnimationComplete?: () => void;
}

export function GLTFModel({ 
  modelPath, 
  position = [0, -3.5, -5], 
  scale = [10, 10, 10],
  onAnimationComplete
}: GLTFModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { mixer, actions } = useAnimations(animations, group);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // Update the mixer on each frame and check if animation is complete
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
      // Check if the embedded animation has finished
      if (animationPlayed && !animationCompleted && actions && Object.keys(actions).length > 0) {
        const firstAction = Object.values(actions)[0];
        if (firstAction && !firstAction.isRunning()) {
          setAnimationCompleted(true);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }
    }
  });

  // Set up click handler to play animation once
  useEffect(() => {
    const handleClick = () => {
      if (!animationPlayed && actions && Object.keys(actions).length > 0) {
        const firstAction = Object.values(actions)[0];
        if (firstAction) {
          firstAction.setLoop(THREE.LoopOnce, 1);
          firstAction.clampWhenFinished = true;
          firstAction.play();
          setAnimationPlayed(true);
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [actions, animationPlayed]);

  // Log material types for debugging (similar to original code)
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log('Mesh name:', child.name, 'Material type:', child.material.type);
        }
      });

      // Compute bounding box and log info
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      console.log('Model bounding box:', box);
      console.log('Model size:', size);
      console.log('Model center:', center);
    }
  }, [scene]);

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/gate-animated-2-emissive.glb');