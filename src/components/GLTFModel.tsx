import { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface GLTFModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
}

export function GLTFModel({ 
  modelPath, 
  position = [0, -3.5, -5], 
  scale = [10, 10, 10] 
}: GLTFModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { mixer, actions } = useAnimations(animations, group);
  const { camera } = useThree();
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [flyAnimationStarted, setFlyAnimationStarted] = useState(false);

  // Update the mixer on each frame and check if animation is complete
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
      // Check if the embedded animation has finished
      if (animationPlayed && !flyAnimationStarted && actions && Object.keys(actions).length > 0) {
        const firstAction = Object.values(actions)[0];
        if (firstAction && !firstAction.isRunning()) {
          setFlyAnimationStarted(true);
          setTimeout(() => {
            // Move camera forward to position just behind the gate model
            // Gate is at z=-5, so move camera to z=-7 (2 units behind it)
            gsap.to(camera.position, {
              z: -7,
              duration: 1.5,
              ease: "power2.inOut"
            });
          }, 500); // 0.5 second pause
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