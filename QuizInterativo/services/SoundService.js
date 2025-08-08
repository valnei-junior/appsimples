import { Audio } from 'expo-av';

class SoundService {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.isLoaded = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Configurar modo de áudio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      // Pré-carregar sons
      await this.loadSounds();
      this.isLoaded = true;
    } catch (error) {
      console.log('Erro ao inicializar áudio:', error);
      this.isEnabled = false;
    }
  }

  async loadSounds() {
    try {
      // Som de acerto (frequência mais alta, agradável)
      this.sounds.correct = await this.createSuccessSound();
      
      // Som de erro (frequência mais baixa, alerta)
      this.sounds.wrong = await this.createErrorSound();
      
      // Som de vitória (para resultado final)
      this.sounds.victory = await this.createVictorySound();
      
    } catch (error) {
      console.log('Erro ao carregar sons:', error);
    }
  }

  // Criar som de acerto usando Web Audio API (funciona no Expo)
  async createSuccessSound() {
    try {
      // Som positivo: sequência de notas ascendentes
      const { sound } = await Audio.Sound.createAsync(
        { 
          uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgVJnbE8N6QQAkTXbPn7KpVFAlEnt/yv2kVJnbD8N6QQAkUXbPo7KlUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kV'
        },
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      console.log('Erro ao criar som de sucesso:', error);
      return null;
    }
  }

  async createErrorSound() {
    try {
      // Som negativo: nota mais grave e áspera
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/error.mp3'), // Vamos criar este arquivo
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      // Fallback: criar som programaticamente
      return await this.createFallbackErrorSound();
    }
  }

  async createVictorySound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/victory.mp3'), // Vamos criar este arquivo
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      // Fallback: usar som de sucesso
      return this.sounds.correct;
    }
  }

  async createFallbackErrorSound() {
    try {
      // Som de erro simples usando dados base64
      const { sound } = await Audio.Sound.createAsync(
        { 
          uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSw='
        },
        { shouldPlay: false }
      );
      return sound;
    } catch (error) {
      console.log('Erro ao criar som de erro fallback:', error);
      return null;
    }
  }

  async playCorrect() {
    if (!this.isEnabled || !this.sounds.correct) return;
    
    try {
      await this.sounds.correct.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar som de acerto:', error);
    }
  }

  async playWrong() {
    if (!this.isEnabled || !this.sounds.wrong) return;
    
    try {
      await this.sounds.wrong.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar som de erro:', error);
    }
  }

  async playVictory() {
    if (!this.isEnabled || !this.sounds.victory) return;
    
    try {
      await this.sounds.victory.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar som de vitória:', error);
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  async cleanup() {
    try {
      Object.values(this.sounds).forEach(async (sound) => {
        if (sound) {
          await sound.unloadAsync();
        }
      });
      this.sounds = {};
    } catch (error) {
      console.log('Erro ao limpar sons:', error);
    }
  }
}

// Instância singleton
const soundService = new SoundService();
export default soundService;
