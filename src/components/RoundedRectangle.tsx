import { useMemo } from 'react';
import * as THREE from 'three';

interface RoundedRectangleProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  cornerRadius?: number;
  tubeRadius?: number;
  fillColor?: THREE.ColorRepresentation;
  edgeColor?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  onClick?: () => void;
}

export function RoundedRectangle({
  position,
  width = 15,
  height = 7.5,
  cornerRadius = 1.1,
  tubeRadius = 0.05,
  fillColor = 0x000000,
  edgeColor = "#ff6327",
  emissiveIntensity = 4.5,
  onClick,
}: RoundedRectangleProps) {
  
  // Create the rounded rectangle path
  const createRoundedRectPath = (w: number, h: number, r: number) => {
    const shape = new THREE.Shape();
    const x = -w/2, y = -h/2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  };

  const { rectGeometry, tubeGeometry } = useMemo(() => {
    // Black fill rectangle (slightly smaller to account for tube thickness)
    const rectGeometry = new THREE.PlaneGeometry(
      width - tubeRadius * 2, 
      height - tubeRadius * 2
    );

    // Create the rounded rectangle outline using TubeGeometry
    const path = createRoundedRectPath(width, height, cornerRadius);
    const points = path.getPoints(200); // Smooth corners
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(p.x, p.y, 0))
    );
    curve.closed = true;
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 200, tubeRadius, 16, true);
    
    return { rectGeometry, tubeGeometry };
  }, [width, height, cornerRadius, tubeRadius]);

  return (
    <group position={position}>
      {/* Fill rectangle */}
      <mesh 
        geometry={rectGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <meshBasicMaterial 
          color={fillColor} 
          transparent 
          opacity={0} 
        />
      </mesh>
      
      {/* Edge outline */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial 
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}