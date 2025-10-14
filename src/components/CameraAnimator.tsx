import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraAnimatorProps {
  targetPosition: [number, number, number];
  duration?: number;
  delay?: number;
  ease?: string;
  trigger?: boolean;
}

export function CameraAnimator({ 
  targetPosition, 
  duration = 1.5, 
  delay = 0.5,
  ease = "power2.inOut",
  trigger = false 
}: CameraAnimatorProps) {
  const { camera } = useThree();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (trigger && !hasAnimated.current) {
      hasAnimated.current = true;
      setTimeout(() => {
        gsap.to(camera.position, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          duration,
          ease
        });
      }, delay * 1000);
    }
  }, [trigger, camera, targetPosition, duration, delay, ease]);

  return null;
}

export class CameraFlightController {
  private camera: THREE.Camera;
  private hasAnimated: boolean = false;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  flyTo(
    targetPosition: [number, number, number],
    options: {
      duration?: number;
      delay?: number;
      ease?: string;
      onComplete?: () => void;
    } = {}
  ): void {
    const {
      duration = 1.5,
      delay = 0.5,
      ease = "power2.inOut",
      onComplete
    } = options;

    if (this.hasAnimated) {
      return;
    }

    this.hasAnimated = true;

    setTimeout(() => {
      gsap.to(this.camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration,
        ease,
        onComplete
      });
    }, delay * 1000);
  }

  reset(): void {
    this.hasAnimated = false;
  }

  getHasAnimated(): boolean {
    return this.hasAnimated;
  }
}
