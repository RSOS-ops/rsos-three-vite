import { Bloom, Selection, Select, Noise, EffectComposer } from '@react-three/postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Bloom effect for enhanced lighting on emissive materials */}
      <Bloom intensity={0.1} luminanceThreshold={0.1} />
    </EffectComposer>
  );
}