import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

class SimpleSoundService {
  constructor() {
    this.isEnabled = true;
    this.useVibration = true; // Fallback para vibração
    this.isAudioReady = false;
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🔊 Inicializando serviço de som...');
      
      // Configurar modo de áudio simples
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      console.log('✅ Áudio configurado');
      this.isAudioReady = true;
      
    } catch (error) {
      console.log('⚠️ Erro ao configurar áudio:', error);
      console.log('🔄 Usando vibração como fallback');
      this.isAudioReady = false;
    }
  }

  // Som de acerto - beep agudo
  async playCorrect() {
    if (!this.isEnabled) return;
    
    console.log('🎵 Tocando som de acerto...');
    
    try {
      if (this.isAudioReady) {
        // Tentar tocar som usando Audio.Sound
        const { sound } = await Audio.Sound.createAsync(
          { uri: this.generateBeepTone(800, 200) }, // 800Hz por 200ms
          { shouldPlay: true, volume: 0.5 }
        );
        
        // Limpar o som após tocar
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } else {
        // Fallback: vibração de sucesso
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('⚠️ Erro ao tocar som de acerto:', error);
      // Fallback final: vibração leve
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        console.log('⚠️ Vibração não disponível');
      }
    }
  }

  // Som de erro - beep grave
  async playWrong() {
    if (!this.isEnabled) return;
    
    console.log('❌ Tocando som de erro...');
    
    try {
      if (this.isAudioReady) {
        // Tentar tocar som usando Audio.Sound
        const { sound } = await Audio.Sound.createAsync(
          { uri: this.generateBeepTone(300, 300) }, // 300Hz por 300ms
          { shouldPlay: true, volume: 0.4 }
        );
        
        // Limpar o som após tocar
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } else {
        // Fallback: vibração de erro
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.log('⚠️ Erro ao tocar som de erro:', error);
      // Fallback final: vibração pesada
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (e) {
        console.log('⚠️ Vibração não disponível');
      }
    }
  }

  // Som de vitória
  async playVictory() {
    if (!this.isEnabled) return;
    
    console.log('🏆 Tocando som de vitória...');
    
    try {
      // Sequência de vibrações para vitória
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 100);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 200);
    } catch (error) {
      console.log('⚠️ Erro ao tocar som de vitória:', error);
    }
  }

  // Gerar tom simples (beep)
  generateBeepTone(frequency, duration) {
    // Gerar um beep simples usando data URI
    const sampleRate = 22050;
    const numSamples = Math.floor(sampleRate * duration / 1000);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    // Gerar dados do áudio
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const amplitude = Math.exp(-t * 2) * 0.3; // Decay
      const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
      const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
      view.setInt16(44 + i * 2, intSample, true);
    }
    
    // Converter para base64
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    console.log(`🔊 Som ${this.isEnabled ? 'ligado' : 'desligado'}`);
    return this.isEnabled;
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`🔊 Som ${enabled ? 'ligado' : 'desligado'}`);
  }

  // Teste rápido
  async test() {
    console.log('🔍 Testando sistema de som...');
    await this.playCorrect();
    setTimeout(async () => {
      await this.playWrong();
    }, 500);
  }
}

// Instância singleton
const simpleSoundService = new SimpleSoundService();
export default simpleSoundService;
