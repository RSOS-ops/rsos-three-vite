import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WizardAnimationControllerProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  idleAnimationName: string;
  attackAnimationName: string;
  timeScale?: number;
  onAnimationTrigger?: () => void;
}

export interface WizardAnimationHandle {
  playAttackAnimation: () => void;
}

export const WizardAnimationController = forwardRef<WizardAnimationHandle, WizardAnimationControllerProps>((props, ref) => {
  const { 
    modelPath, 
    position = [0, -5, -600], 
    scale = [5, 5, 5],
    rotation = [0, 0, 0],
    idleAnimationName,
    attackAnimationName,
    timeScale = 0.333,
  } = props;
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { mixer, actions } = useAnimations(animations, group);
  const [isPlayingAttack, setIsPlayingAttack] = useState(false);

  // Update the mixer on each frame
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  // Start idle animation on load
  useEffect(() => {
    if (actions && actions[idleAnimationName]) {
      const idleAction = actions[idleAnimationName];
      idleAction.timeScale = timeScale;
      idleAction.setLoop(THREE.LoopRepeat, Infinity);
      idleAction.play();
    }
  }, [actions, idleAnimationName, timeScale]);

  // Public method to trigger attack animation
  const playAttackAnimation = () => {
    if (!actions || isPlayingAttack) return;

    const idleAction = actions[idleAnimationName];
    const attackAction = actions[attackAnimationName];

    if (idleAction && attackAction) {
      setIsPlayingAttack(true);

      // Fade out idle animation
      idleAction.fadeOut(0.2);

      // Setup and play attack animation
      attackAction.reset();
      attackAction.setLoop(THREE.LoopOnce, 1);
      attackAction.clampWhenFinished = true;
      attackAction.timeScale = timeScale;
      attackAction.fadeIn(0.2);
      attackAction.play();

      // Listen for attack animation finish
      const onFinished = (e: any) => {
        if (e.action === attackAction) {
          // Fade back to idle
          attackAction.fadeOut(0.2);
          idleAction.reset();
          idleAction.fadeIn(0.2);
          idleAction.play();
          setIsPlayingAttack(false);
          mixer?.removeEventListener('finished', onFinished);
        }
      };

      mixer?.addEventListener('finished', onFinished);
    }
  };

  // Expose the playAttackAnimation method via ref
  useImperativeHandle(ref, () => ({
    playAttackAnimation
  }));

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
});
