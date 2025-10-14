interface GridFloorProps {
  /**
   * The position where the grid floor starts (origin of the grid)
   * Default: [0, -5, 0]
   */
  position?: [number, number, number];
  /**
   * The width of the grid (X axis, centered on X=0)
   * Default: 8
   */
  width?: number;
  /**
   * The length of the grid (Z axis, starting at Z=0 and extending forward)
   * Required
   */
  length: number;
  /**
   * Spacing between grid lines
   * Default: 2
   */
  gridSpacing?: number;
  horizontalLineColor?: string | number;
  verticalLineColor?: string | number;
  horizontalEmissiveIntensity?: number;
  verticalEmissiveIntensity?: number;
  opacity?: number;
  lineThickness?: number;
}

export function GridFloor({
  position = [0, -5, 0],
  width = 8,
  length,
  gridSpacing = 2,
  horizontalLineColor = "#6287f8",
  verticalLineColor = 0xce02d4,
  horizontalEmissiveIntensity = 4.5,
  verticalEmissiveIntensity = 4.5,
  opacity = 0.7,
  lineThickness = 0.02
}: GridFloorProps) {
  
  // Calculate number of lines based on length and spacing
  const numHorizontalLines = Math.floor(length / gridSpacing) + 1;
  const numVerticalLines = Math.floor(width / gridSpacing) + 1;
  
  // Center the grid on X-axis, but start at Z=0 and extend in -Z direction
  const widthOffset = (numVerticalLines - 1) * gridSpacing / 2;

  return (
    <group position={position}>
      {/* Horizontal lines (along X-axis, starting from Z=0 and extending in -Z direction) */}
      {Array.from({ length: numHorizontalLines }, (_, i) => {
        const z = -i * gridSpacing;
        return (
          <mesh key={`h-${i}`} position={[0, 0, z]}>
            <boxGeometry args={[width, lineThickness, lineThickness]} />
            <meshStandardMaterial 
              color={horizontalLineColor}
              emissive={horizontalLineColor}
              emissiveIntensity={horizontalEmissiveIntensity}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}

      {/* Vertical lines (centered on X-axis, extending along Z from 0 to -length) */}
      {Array.from({ length: numVerticalLines }, (_, i) => {
        const x = i * gridSpacing - widthOffset;
        return (
          <mesh key={`v-${i}`} position={[x, 0, -length / 2]}>
            <boxGeometry args={[lineThickness, lineThickness, length]} />
            <meshStandardMaterial 
              color={verticalLineColor}
              emissive={verticalLineColor}
              emissiveIntensity={verticalEmissiveIntensity}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}
