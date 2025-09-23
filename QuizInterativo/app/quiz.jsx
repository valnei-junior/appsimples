import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import perguntasData from '../data/perguntas.json';
import soundService from '../services/SimpleSoundService';
import { useConfig } from '../contexts/ConfigContext';

const { width } = Dimensions.get('window');

export default function Quiz() {
  const router = useRouter();
  const { theme, somAtivado } = useConfig();
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  
  // Animações
  const slideAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(1);

  // Configuração do gesto de swipe
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        slideAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > width * 0.3 && opcaoSelecionada !== null && mostrarResultado) {
        // Swipe para a direita suficiente - próxima pergunta
        proximaPergunta();
      } else {
        // Volta para posição original
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const voltarHome = () => {
    router.push('/');
  };

  const selecionarOpcao = (indice) => {
    if (mostrarResultado) return;
    
    setOpcaoSelecionada(indice);
    
    // Aguarda um momento antes de mostrar o resultado
    setTimeout(() => {
      setMostrarResultado(true);
      
      // Verifica se a resposta está correta
      const pergunta = perguntasData[perguntaAtual];
      const acertou = indice === pergunta.respostaCorreta;
      
      // 🔊 TOCAR SOM baseado na resposta (apenas se som estiver ativado)
      if (somAtivado) {
        if (acertou) {
          setPontuacao(pontuacao + 1);
          soundService.playCorrect(); // Som de acerto
        } else {
          soundService.playWrong(); // Som de erro
        }
      } else if (acertou) {
        setPontuacao(pontuacao + 1);
      }
      
      // Armazena a resposta do usuário
      const novaResposta = {
        pergunta: pergunta.pergunta,
        opcaoSelecionada: indice,
        respostaCorreta: pergunta.respostaCorreta,
        acertou: acertou,
      };
      
      setRespostasUsuario([...respostasUsuario, novaResposta]);
      
      // Auto-avança após 0,2 segundos se não for a última pergunta
      if (perguntaAtual < perguntasData.length - 1) {
        setTimeout(() => {
          proximaPergunta();
        }, 20);
      } else {
        // Se for a última pergunta, vai para resultado após 0,2 segundos
        setTimeout(() => {
          irParaResultado();
        }, 20);
      }
    }, 300);
  };

  const proximaPergunta = () => {
    if (perguntaAtual < perguntasData.length - 1) {
      // Animação de saída
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Resetar estado para próxima pergunta
        setPerguntaAtual(perguntaAtual + 1);
        setOpcaoSelecionada(null);
        setMostrarResultado(false);
        
        // Reset animações
        slideAnim.setValue(-width);
        fadeAnim.setValue(0);
        
        // Animação de entrada
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      irParaResultado();
    }
  };

  const irParaResultado = () => {
    const perguntaFinal = perguntasData[perguntaAtual];
    const acertou = opcaoSelecionada === perguntaFinal?.respostaCorreta;

    const ultimaResposta = {
      pergunta: perguntaFinal.pergunta,
      opcaoSelecionada: opcaoSelecionada,
      respostaCorreta: perguntaFinal.respostaCorreta,
      acertou: acertou,
    };

    const respostasCompletas = [...respostasUsuario, ultimaResposta];

    const resultadoFinal = {
      pontuacao: pontuacao + (acertou ? 1 : 0),
      totalPerguntas: perguntasData.length,
      respostasUsuario: respostasCompletas,
    };

    router.push({
      pathname: '/resultado',
      params: {
        pontuacao: resultadoFinal.pontuacao,
        totalPerguntas: resultadoFinal.totalPerguntas,
        respostasString: JSON.stringify(resultadoFinal.respostasUsuario)
      }
    });
  };

  // Efeito para animação inicial
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const pergunta = perguntasData[perguntaAtual];

  if (!pergunta) {
    return null;
  }

  const getOpcaoStyle = (index) => {
    const styles = createStyles(theme);
    
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? styles.opcaoSelecionada : styles.opcao;
    }
    
    if (index === pergunta.respostaCorreta) {
      return styles.opcaoCorreta;
    }
    
    if (opcaoSelecionada === index && index !== pergunta.respostaCorreta) {
      return styles.opcaoErrada;
    }
    
    return styles.opcaoDesabilitada;
  };

  const getTextoStyle = (index) => {
    const styles = createStyles(theme);
    
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? styles.textoSelecionado : styles.textoOpcao;
    }
    
    if (index === pergunta.respostaCorreta) {
      return styles.textoCorreto;
    }
    
    if (opcaoSelecionada === index && index !== pergunta.respostaCorreta) {
      return styles.textoErrado;
    }
    
    return styles.textoDesabilitado;
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((perguntaAtual + 1) / perguntasData.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Pergunta */}
        <View style={styles.perguntaSection}>
          <View style={styles.perguntaHeader}>
            <Text style={styles.contador}>
              Pergunta {perguntaAtual + 1} de {perguntasData.length}
            </Text>
          </View>
          <View style={styles.perguntaContainer}>
            <Text style={styles.perguntaTexto}>{pergunta.pergunta}</Text>
          </View>
        </View>

        {/* Opções */}
        <View style={styles.opcoesContainer}>
          {pergunta.opcoes.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              style={getOpcaoStyle(index)}
              onPress={() => selecionarOpcao(index)}
              disabled={mostrarResultado}
              activeOpacity={0.7}
            >
              <View style={styles.opcaoContent}>
                <Text style={styles.letra}>
                  {String.fromCharCode(65 + index)}
                </Text>
                <Text style={[styles.textoOpcao, getTextoStyle(index)]}>
                  {opcao}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.botaoHome} onPress={voltarHome}>
            <Text style={styles.textoBotaoHome}>🏠 Voltar ao Início</Text>
          </TouchableOpacity>
        </View>

        {mostrarResultado && (
          <View style={styles.feedback}>
            <Animated.View
              style={[
                styles.feedbackContent,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              {opcaoSelecionada === pergunta.respostaCorreta ? (
                <View style={styles.feedbackCorreto}>
                  <Text style={styles.feedbackEmoji}>🎉</Text>
                  <Text style={styles.feedbackTexto}>Correto!</Text>
                </View>
              ) : (
                <View style={styles.feedbackErrado}>
                  <Text style={styles.feedbackEmoji}>😔</Text>
                  <Text style={styles.feedbackTexto}>Ops! Tente novamente</Text>
                </View>
              )}
              <Text style={styles.proximaInstrucao}>
                {perguntaAtual < perguntasData.length - 1
                  ? '👉 Deslize para a próxima pergunta'
                  : '🏁 Finalizando quiz...'}
              </Text>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 5,
    marginTop: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.borderColor,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primaryColor,
    borderRadius: 3,
  },
  perguntaSection: {
    marginBottom: 30,
    marginTop: 20,
  },
  perguntaHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contador: {
    fontSize: 16,
    color: theme.secondaryColor,
    fontWeight: '600',
  },
  perguntaContainer: {
    backgroundColor: theme.cardBackground,
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: theme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  perguntaTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textColor,
    textAlign: 'center',
    lineHeight: 28,
  },
  opcoesContainer: {
    marginHorizontal: 20,
  },
  opcao: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: theme.borderColor,
    shadowColor: theme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  opcaoSelecionada: {
    backgroundColor: theme.isHighContrast ? theme.primaryColor + '20' : '#e3f2fd',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: theme.primaryColor,
    shadowColor: theme.primaryColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoCorreta: {
    backgroundColor: theme.isHighContrast ? '#00FF00' + '30' : '#e8f5e8',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: theme.isHighContrast ? '#00FF00' : '#4caf50',
    shadowColor: theme.isHighContrast ? '#00FF00' : '#4caf50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoErrada: {
    backgroundColor: theme.isHighContrast ? '#FF0000' + '30' : '#ffebee',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: theme.isHighContrast ? '#FF0000' : '#f44336',
    shadowColor: theme.isHighContrast ? '#FF0000' : '#f44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoDesabilitada: {
    backgroundColor: theme.isHighContrast ? theme.cardBackground : '#f5f5f5',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: theme.borderColor,
    opacity: theme.isHighContrast ? 0.8 : 0.6,
  },
  opcaoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  letra: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    color: theme.textColor,
    width: 30,
    textAlign: 'center',
  },
  textoOpcao: {
    fontSize: 16,
    color: theme.textColor,
    flex: 1,
    fontWeight: '500',
  },
  textoSelecionado: {
    color: theme.isHighContrast ? theme.buttonText : '#1976d2',
    fontWeight: '600',
  },
  textoCorreto: {
    color: theme.isHighContrast ? '#000000' : '#2e7d32',
    fontWeight: '600',
  },
  textoErrado: {
    color: theme.isHighContrast ? '#000000' : '#c62828',
    fontWeight: '600',
  },
  textoDesabilitado: {
    color: theme.secondaryColor,
  },
  botaoHome: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: theme.buttonBackground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 30,
  },
  textoBotaoHome: {
    color: theme.buttonText,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedback: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  feedbackContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 30,
    shadowColor: theme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  feedbackCorreto: {
    alignItems: 'center',
  },
  feedbackErrado: {
    alignItems: 'center',
  },
  feedbackEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  feedbackTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textColor,
    marginBottom: 10,
  },
  proximaInstrucao: {
    fontSize: 14,
    color: theme.secondaryColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});