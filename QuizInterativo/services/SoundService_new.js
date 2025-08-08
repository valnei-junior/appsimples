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
      // Som de acerto - tom agudo e agradável
      this.sounds.correct = await Audio.Sound.createAsync(
        { 
          uri: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU1vT19' +
               'BhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgVJnbE8N6QQAkTXbPn7KpVFAlEnt/yv2kVJnbD8N6QQAkUXbPo7KlUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kV'
        },
        { 
          shouldPlay: false,
          volume: 0.6,
          rate: 1.2, // Mais agudo
          isLooping: false
        }
      );
      
      // Som de erro - tom grave e desagradável  
      this.sounds.wrong = await Audio.Sound.createAsync(
        { 
          uri: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU1vT19' +
               'BhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgVJnbE8N6QQAkTXbPn7KpVFAlEnt/yv2kVJnbD8N6QQAkUXbPo7KlUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kVJnbE8N6QQAoUXrTp66hUEQhDnt/yu2kV'
        },
        { 
          shouldPlay: false,
          volume: 0.5,
          rate: 0.6, // Mais grave
          isLooping: false
        }
      );
      
      // Som de vitória - mesmo que acerto mas mais longo
      this.sounds.victory = this.sounds.correct;
      
    } catch (error) {
      console.log('Erro ao carregar sons:', error);
      this.isEnabled = false;
    }
  }

  async playCorrect() {
    if (!this.isEnabled || !this.isLoaded || !this.sounds.correct) return;
    
    try {
      await this.sounds.correct.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar som de acerto:', error);
    }
  }

  async playWrong() {
    if (!this.isEnabled || !this.isLoaded || !this.sounds.wrong) return;
    
    try {
      await this.sounds.wrong.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar som de erro:', error);
    }
  }

  async playVictory() {
    if (!this.isEnabled || !this.isLoaded || !this.sounds.victory) return;
    
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
      this.isLoaded = false;
    } catch (error) {
      console.log('Erro ao limpar sons:', error);
    }
  }
}

// Instância singleton
const soundService = new SoundService();
export default soundService;
