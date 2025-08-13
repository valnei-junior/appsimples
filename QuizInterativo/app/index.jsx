import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import simpleSoundService from '../services/SimpleSoundService';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [somAtivado, setSomAtivado] = useState(simpleSoundService.isEnabled);

  const iniciarQuiz = () => {
    router.push('/quiz');
  };

  const toggleSom = () => {
    const novoEstado = simpleSoundService.toggle();
    setSomAtivado(novoEstado);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.titulo}>🧠</Text>
          <Text style={styles.subtitulo}>Potiquiz</Text>
          <Text style={styles.descricao}>
            Teste seus conhecimentos com perguntas desafiadoras sobre nossa história!
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumero}>15</Text>
            <Text style={styles.infoTexto}>Perguntas</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.infoItem}>
            <Text style={styles.infoNumero}>🏆</Text>
            <Text style={styles.infoTexto}>Pontuação</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.infoItem}>
            <Text style={styles.infoNumero}>📱</Text>
            <Text style={styles.infoTexto}>Gestos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoIniciar} onPress={iniciarQuiz}>
          <Text style={styles.textoBotao}>Iniciar Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSom} onPress={toggleSom}>
          <Text style={styles.textoBotaoSom}>
            {somAtivado ? '🔊 Som Ligado' : '🔇 Som Desligado'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.dica}>
          💡 Dica: Deslize para a direita para próxima pergunta
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titulo: {
    fontSize: 80,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'brown',
    marginBottom: 10,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: width * 0.85,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  divisor: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  infoNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'brown',
    marginBottom: 5,
  },
  infoTexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  botaoIniciar: {
    backgroundColor: 'brown',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: 'brown',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 30,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoSom: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#95a5a6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textoBotaoSom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dica: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});