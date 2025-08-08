// Gerador de sons simples para o quiz
export const generateErrorSoundData = () => {
  // Som de erro - frequência baixa com vibração
  const sampleRate = 22050;
  const duration = 0.3; // 300ms
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(samples * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < samples; i++) {
    // Frequência baixa (200Hz) com modulação para dar sensação de erro
    const t = i / sampleRate;
    const frequency = 200 + Math.sin(t * 10) * 50; // Vibração na frequência
    const amplitude = Math.exp(-t * 3) * 0.3; // Decay exponencial
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    
    // Converter para 16-bit signed integer
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
    view.setInt16(i * 2, intSample, true);
  }
  
  return buffer;
};

export const generateSuccessSoundData = () => {
  // Som de sucesso - sequência de notas ascendentes
  const sampleRate = 22050;
  const duration = 0.4; // 400ms
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(samples * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    
    // Sequência de notas: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
    let frequency = 523; // C5
    if (t > 0.133) frequency = 659; // E5
    if (t > 0.266) frequency = 784; // G5
    
    const amplitude = Math.exp(-t * 2) * 0.4; // Decay suave
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    
    // Converter para 16-bit signed integer
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
    view.setInt16(i * 2, intSample, true);
  }
  
  return buffer;
};

export const generateVictorySoundData = () => {
  // Som de vitória - melodia triunfante
  const sampleRate = 22050;
  const duration = 0.8; // 800ms
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(samples * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    
    // Melodia triunfante: C5 -> G5 -> C6
    let frequency = 523; // C5
    if (t > 0.2) frequency = 784; // G5
    if (t > 0.4) frequency = 1047; // C6
    if (t > 0.6) frequency = 1047; // Manter C6
    
    const amplitude = Math.exp(-t * 1.5) * 0.5;
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    
    // Adicionar harmônico para som mais rico
    const harmonic = Math.sin(2 * Math.PI * frequency * 2 * t) * amplitude * 0.3;
    const finalSample = sample + harmonic;
    
    // Converter para 16-bit signed integer
    const intSample = Math.max(-1, Math.min(1, finalSample)) * 0x7FFF;
    view.setInt16(i * 2, intSample, true);
  }
  
  return buffer;
};
