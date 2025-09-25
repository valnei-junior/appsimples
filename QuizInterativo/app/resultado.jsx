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
import { useConfig } from '../contexts/ConfigContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

export default function Resultado() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, somAtivado } = useConfig();

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
    if (somAtivado) {
      setTimeout(() => {
        if (porcentagem >= 70) {
          soundService.playVictory();
        }
      }, 800);
    }

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
  }, [scaleAnim, fadeAnim, slideAnim, porcentagem, somAtivado]);

  // Salvar resultado no AsyncStorage
useEffect(() => {
  const salvarResultado = async () => {
    try {
      const nome = params.nomeUsuario || 'Anônimo';
      const novoResultado = {
        nome,
        pontuacao,
        totalPerguntas,
        porcentagem,
        data: new Date().toISOString(),
      };

      const historicoJSON = await AsyncStorage.getItem('@historico_resultados');
      const historicoAtual = historicoJSON ? JSON.parse(historicoJSON) : [];

      const novoHistorico = [novoResultado, ...historicoAtual]; // Adiciona no topo
      await AsyncStorage.setItem('@historico_resultados', JSON.stringify(novoHistorico));
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  salvarResultado();
}, []);


  const refazerQuiz = () => {
    router.push('/');
  };

  const voltarHome = () => {
    router.push('/');
  };

  const irParaHistorico = () => {
    router.push('/historico');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <View key={index} style={styles.respostaItem}>
              <View style={styles.respostaHeader}>
                <Text style={styles.respostaNumero}>#{index + 1}</Text>
                <View
                  style={[
                    styles.respostaStatus,
                    { backgroundColor: resposta.acertou ? '#e8f5e8' : '#ffebee' },
                  ]}
                >
                  <Text
                    style={[
                      styles.respostaStatusTexto,
                      { color: resposta.acertou ? '#2e7d32' : '#c62828' },
                    ]}
                  >
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

          <TouchableOpacity style={styles.botaoHistorico} onPress={irParaHistorico}>
            <Text style={styles.textoBotaoHistorico}>📜 Ver Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoHome} onPress={voltarHome}>
            <Text style={styles.textoBotaoHome}>🏠 Voltar ao Início</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
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
      color: theme.textColor,
    },
    pontuacaoTexto: {
      fontSize: 16,
      color: theme.secondaryColor,
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
      color: theme.textColor,
      marginBottom: 20,
      textAlign: 'center',
    },
    respostaItem: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 15,
      marginBottom: 10,
      shadowColor: theme.shadowColor,
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
      color: theme.secondaryColor,
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
      color: theme.textColor,
      lineHeight: 20,
    },
    estatisticasContainer: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: 20,
      padding: 25,
      marginHorizontal: 20,
      marginBottom: 30,
      shadowColor: theme.shadowColor,
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
      backgroundColor: theme.borderColor,
      marginHorizontal: 15,
    },
    estatisticaNumero: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.infoColor,
      marginBottom: 5,
    },
    estatisticaTexto: {
      fontSize: 14,
      color: theme.secondaryColor,
      fontWeight: '500',
    },
    botoesContainer: {
      paddingHorizontal: 30,
      gap: 15,
    },
    botaoRefazer: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 16,
      borderRadius: 25,
      shadowColor: theme.buttonBackground,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    textoBotaoRefazer: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    botaoHistorico: {
      backgroundColor: theme.cardBackground,
      paddingVertical: 16,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme.primaryColor,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 15,
    },
    textoBotaoHistorico: {
      color: theme.primaryColor,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    botaoHome: {
      backgroundColor: theme.cardBackground,
      paddingVertical: 16,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme.primaryColor,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    textoBotaoHome: {
      color: theme.primaryColor,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
