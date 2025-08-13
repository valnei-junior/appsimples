import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import soundService from '../services/SimpleSoundService';

const { width, height } = Dimensions.get('window');

export default function Resultado() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const pontuacao = parseInt(params.pontuacao) || 0;
  const totalPerguntas = parseInt(params.totalPerguntas) || 15;
  const respostasUsuario = params.respostasString 
    ? JSON.parse(params.respostasString) 
    : [];
  
  // Animações
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const porcentagem = Math.round((pontuacao / totalPerguntas) * 100);

  const getMensagem = () => {
    if (porcentagem >= 90) return { emoji: '🏆', texto: 'Excelente!', cor: '#f39c12' };
    if (porcentagem >= 70) return { emoji: '🎉', texto: 'Muito Bom!', cor: '#27ae60' };
    if (porcentagem >= 50) return { emoji: '👍', texto: 'Bom trabalho!', cor: '#3498db' };
    return { emoji: '💪', texto: 'Continue tentando!', cor: '#e74c3c' };
  };

  const mensagem = getMensagem();

  useEffect(() => {
    // 🔊 Tocar som de vitória ao mostrar resultado
    setTimeout(() => {
      if (porcentagem >= 70) {
        soundService.playVictory(); // Som de vitória para boas pontuações
      }
    }, 800); // Aguarda um pouco para as animações iniciarem
    
    // Sequência de animações
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const refazerQuiz = () => {
    router.push('/');
  };

  const voltarHome = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header com resultado */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>{mensagem.emoji}</Text>
          <Text style={[styles.mensagem, { color: mensagem.cor }]}>
            {mensagem.texto}
          </Text>
          <View style={styles.pontuacaoContainer}>
            <Text style={styles.pontuacaoNumero}>
              {pontuacao}/{totalPerguntas}
            </Text>
            <Text style={styles.pontuacaoTexto}>acertos</Text>
          </View>
          <Text style={[styles.porcentagem, { color: mensagem.cor }]}>
            {porcentagem}%
          </Text>
        </Animated.View>

        {/* Detalhes das respostas */}
        <Animated.View
          style={[
            styles.detalhesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.detalhesTitle}>Resumo das Respostas</Text> 
          {respostasUsuario.map((resposta, index) => (
            //
            <View key={index} style={styles.respostaItem}>
              <View style={styles.respostaHeader}>
                <Text style={styles.respostaNumero}>#{index + 1}</Text>
                <View style={[
                  styles.respostaStatus,
                  { backgroundColor: resposta.acertou ? '#e8f5e8' : '#ffebee' }
                ]}>
                  <Text style={[
                    styles.respostaStatusTexto,
                    { color: resposta.acertou ? '#2e7d32' : '#c62828' }
                  ]}>
                    {resposta.acertou ? '✓ Correto' : '✗ Errado'}
                  </Text>
                </View>
              </View>
              <Text style={styles.respostaPergunta} numberOfLines={2}>
                {resposta.pergunta}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Estatísticas */}
        <Animated.View
          style={[
            styles.estatisticasContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaNumero}>{pontuacao}</Text>
            <Text style={styles.estatisticaTexto}>Acertos</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaNumero}>{totalPerguntas - pontuacao}</Text>
            <Text style={styles.estatisticaTexto}>Erros</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaNumero}>{porcentagem}%</Text>
            <Text style={styles.estatisticaTexto}>Aproveitamento</Text>
          </View>
        </Animated.View>

        {/* Botões */}
        <Animated.View
          style={[
            styles.botoesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.botaoRefazer} onPress={refazerQuiz}>
            <Text style={styles.textoBotaoRefazer}>🔄 Refazer Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botaoHome} onPress={voltarHome}>
            <Text style={styles.textoBotaoHome}>🏠 Voltar ao Início</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  mensagem: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pontuacaoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  pontuacaoNumero: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  pontuacaoTexto: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  porcentagem: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detalhesContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  detalhesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  respostaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  respostaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  respostaNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  respostaStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  respostaStatusTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  respostaPergunta: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  estatisticasContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  estatisticaItem: {
    flex: 1,
    alignItems: 'center',
  },
  divisor: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  estatisticaNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'brown',
    marginBottom: 5,
  },
  estatisticaTexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  botoesContainer: {
    paddingHorizontal: 30,
    gap: 15,
  },
  botaoRefazer: {
    backgroundColor: 'brown',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: 'brown',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  textoBotaoRefazer: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoHome: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoBotaoHome: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});