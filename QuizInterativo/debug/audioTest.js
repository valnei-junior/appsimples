import simpleSoundService from './services/SimpleSoundService';

// Função para testar sistema de som
export const testarSistemaDeAudio = async () => {
  console.log('🔧 TESTE DO SISTEMA DE ÁUDIO');
  console.log('================================');
  
  try {
    console.log('1. Testando som de acerto...');
    await simpleSoundService.playCorrect();
    
    setTimeout(async () => {
      console.log('2. Testando som de erro...');
      await simpleSoundService.playWrong();
      
      setTimeout(async () => {
        console.log('3. Testando som de vitória...');
        await simpleSoundService.playVictory();
        
        console.log('✅ Teste concluído!');
      }, 1000);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
};

// Log do estado do serviço
export const verificarEstadoAudio = () => {
  console.log('📊 ESTADO DO SISTEMA DE ÁUDIO');
  console.log('==============================');
  console.log(`Habilitado: ${simpleSoundService.isEnabled}`);
  console.log(`Áudio pronto: ${simpleSoundService.isAudioReady}`);
  console.log(`Usar vibração: ${simpleSoundService.useVibration}`);
};
