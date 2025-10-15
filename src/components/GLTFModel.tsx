import { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GLTFModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  onAnimationComplete?: () => void;
  loopAnimation?: boolean;
  timeScale?: number;
  autoPlay?: boolean;
}

export function GLTFModel({ 
  modelPath, 
  position = [0, -3.5, -5], 
  scale = [10, 10, 10],
  onAnimationComplete,
  loopAnimation = false,
  timeScale = 1,
  autoPlay = true
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

  // Play animation automatically if autoPlay is true, otherwise wait for click
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0 && !animationPlayed) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.timeScale = timeScale;
        firstAction.reset();
        if (loopAnimation) {
          firstAction.setLoop(THREE.LoopRepeat, Infinity);
          firstAction.clampWhenFinished = false;
        } else {
          firstAction.setLoop(THREE.LoopOnce, 1);
          firstAction.clampWhenFinished = true;
        }
        
        if (autoPlay) {
          firstAction.play();
          setAnimationPlayed(true);
        } else {
          // Wait for click to play
          const handleClick = () => {
            if (!animationPlayed) {
              firstAction.play();
              setAnimationPlayed(true);
            }
          };
          window.addEventListener('click', handleClick);
          return () => window.removeEventListener('click', handleClick);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, loopAnimation, timeScale, autoPlay, animationPlayed]);

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
    <group ref={group} position={position} scale={scale} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/gate-animated-2-emissive.glb');