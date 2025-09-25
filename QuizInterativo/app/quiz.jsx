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
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import perguntasData from '../data/perguntas.json';
import soundService from '../services/SimpleSoundService';
import { useConfig } from '../contexts/ConfigContext';

const { width } = Dimensions.get('window');

export default function Quiz() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const nome = params.nomeUsuario || 'Usuário';
  const { theme, somAtivado } = useConfig();
  const [perguntas, setPerguntas] = useState([]); // Estado local para perguntas embaralhadas
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState([]);

  const [gifUrl, setGifUrl] = useState(null);
  
  // Animações
  const slideAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(1);

  // Função para embaralhar array (Fisher-Yates)
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Função que embaralha as opções da pergunta e ajusta índice da resposta correta
  function shuffleOptions(pergunta) {
    const opcoes = [...pergunta.opcoes];
    const indiceCorretoOriginal = pergunta.respostaCorreta;

    const opcoesComFlag = opcoes.map((opcao, index) => ({
      texto: opcao,
      correta: index === indiceCorretoOriginal,
    }));

    const opcoesEmbaralhadas = shuffleArray(opcoesComFlag);

    const novoIndiceCorreto = opcoesEmbaralhadas.findIndex(o => o.correta);

    return {
      ...pergunta,
      opcoes: opcoesEmbaralhadas.map(o => o.texto),
      respostaCorreta: novoIndiceCorreto,
    };
  }

  useEffect(() => {
    // Embaralha perguntas e opções no início do quiz
    let perguntasEmbaralhadas = shuffleArray(perguntasData);
    perguntasEmbaralhadas = perguntasEmbaralhadas.map(pergunta => shuffleOptions(pergunta));
    setPerguntas(perguntasEmbaralhadas);

    // Animações iniciais
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
  }, []);

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
        proximaPergunta();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const fetchGif = async (type) => {
    const apiKey = 'KZ6zQ1fvRWajOxuXnvce3uPFWYdgOUph';
      const successWords = [
    'success', 'yay', 'congratulations', 'winner', 'awesome', 'celebration', 'party', 'applause', 'happy', 'victory'
  ];
  const failWords = [
    'fail', 'sad', 'try again', 'lost', 'defeat', 'nope', 'cry', 'error', 'wrong','bad luck', 'game over', 'incorrect'  ];
    const wordList = type === 'success' ? successWords : failWords;
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(randomWord)}&limit=1`
      );
      const data = await response.json();
      console.log(data);
      
      setGifUrl(data.data[0]?.images?.downsized_medium?.url);
    } catch {
      setGifUrl(null);
    }
  };

  const voltarHome = () => {
    router.push('/');
  };

  const selecionarOpcao = (indice) => {
  if (mostrarResultado) return;
  setOpcaoSelecionada(indice);

  setTimeout(() => {
    setMostrarResultado(true);

    const pergunta = perguntas[perguntaAtual];
    const acertou = indice === pergunta.respostaCorreta;

    // Fetch GIF
    fetchGif(acertou ? 'success' : 'fail');

    // 🔊 TOCAR SOM baseado na resposta (apenas se som estiver ativado)
    if (somAtivado) {
      if (acertou) {
        setPontuacao(pontuacao + 1);
        soundService.playCorrect();
      } else {
        soundService.playWrong();
      }
    } else if (acertou) {
      setPontuacao(pontuacao + 1);
    }

    const novaResposta = {
      pergunta: pergunta.pergunta,
      opcaoSelecionada: indice,
      respostaCorreta: pergunta.respostaCorreta,
      acertou,
    };

    setRespostasUsuario([...respostasUsuario, novaResposta]);

    // Corrigido: usar apenas perguntas.length para checar última pergunta
    if (perguntaAtual < perguntas.length - 1) {
      setTimeout(() => {
        proximaPergunta();
      }, 3000);
    } else {
      setTimeout(() => {
        irParaResultado();
      }, 3000);
    }
  }, 300);
};

  const proximaPergunta = () => {
    if (perguntaAtual < perguntas.length - 1) {
      if (perguntaAtual < perguntasData.length - 1) {
        // Limpa o GIF antes da próxima pergunta
        setGifUrl(null);

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
          setPerguntaAtual(perguntaAtual + 1);
          setOpcaoSelecionada(null);
          setMostrarResultado(false);

          slideAnim.setValue(-width);
          fadeAnim.setValue(0);

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
    }
  };

  const irParaResultado = async () => {
  const perguntaFinal = perguntas[perguntaAtual];
  const acertou = opcaoSelecionada === perguntaFinal?.respostaCorreta;

  const ultimaResposta = {
    pergunta: perguntaFinal.pergunta,
    opcaoSelecionada,
    respostaCorreta: perguntaFinal.respostaCorreta,
    acertou,
  };

  const respostasCompletas = [...respostasUsuario, ultimaResposta];

  const pontuacaoFinal = pontuacao + (acertou ? 1 : 0);
  const totalPerguntas = perguntas.length;
  const porcentagem = Math.round((pontuacaoFinal / totalPerguntas) * 100);

  const resultadoFinal = {
    nome,
    pontuacao: pontuacaoFinal,
    totalPerguntas,
    porcentagem,
    respostasUsuario: respostasCompletas,
    data: new Date().toISOString(),
  };

  try {
    const historicoAnteriorJSON = await AsyncStorage.getItem('@historico_resultados');
    const historicoAnterior = historicoAnteriorJSON ? JSON.parse(historicoAnteriorJSON) : [];

    const novoHistorico = [resultadoFinal, ...historicoAnterior];
    await AsyncStorage.setItem('@historico_resultados', JSON.stringify(novoHistorico));
  } catch (e) {
    console.error('Erro ao salvar resultado:', e);
    Alert.alert('Erro', 'Não foi possível salvar o resultado. Por favor, tente novamente.');
  }

  router.push({
  pathname: '/resultado',
  params: {
    nomeUsuario: resultadoFinal.nome,
    pontuacao: resultadoFinal.pontuacao,
    totalPerguntas: resultadoFinal.totalPerguntas,
    respostasString: JSON.stringify(resultadoFinal.respostasUsuario),
  },
});

};


  if (perguntas.length === 0) {
    // Ainda não carregou perguntas embaralhadas
    return null;
  }

  const pergunta = perguntas[perguntaAtual];

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
                  width: `${((perguntaAtual + 1) / perguntas.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Pergunta */}
        <View style={styles.perguntaSection}>
          <View style={styles.perguntaHeader}>
            <Text style={styles.contador}>
              Pergunta {perguntaAtual + 1} de {perguntas.length}
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
                <Text style={styles.letra}>{String.fromCharCode(65 + index)}</Text>
                <Text style={[styles.textoOpcao, getTextoStyle(index)]}>{opcao}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.botaoHome} onPress={voltarHome}>
            <Text style={styles.textoBotaoHome}>🏠 Voltar ao Início</Text>
          </TouchableOpacity>
        </View>

        {mostrarResultado && (
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                },
              ]}
            >
              {opcaoSelecionada === pergunta.respostaCorreta ? (
                <View style={styles.modalContent}>
                  <Text style={styles.modalEmoji}>🎉</Text>
                  <Text style={styles.modalTitle}>Parabéns!</Text>
                  <Text style={styles.modalSubtitle}>Resposta Correta</Text>
                  {gifUrl && (
                    <Image
                      source={{ uri: gifUrl }}
                      style={styles.modalGifImage}
                      resizeMode="contain"
                    />
                  )}
                  <View style={styles.modalFooter}>
                    <Text style={styles.modalInstrucao}>
                      {perguntaAtual < perguntasData.length - 1
                        ? '👉 Deslize para continuar'
                        : '🏁 Finalizando...'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.modalContent}>
                  <Text style={styles.modalEmoji}>😔</Text>
                  <Text style={styles.modalTitle}>Ops!</Text>
                  <Text style={styles.modalSubtitle}>Resposta Incorreta</Text>
                  {gifUrl && (
                    <Image
                      source={{ uri: gifUrl }}
                      style={styles.modalGifImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.respostaCorretaTexto}>
                    Resposta correta: {pergunta.opcoes[pergunta.respostaCorreta]}
                  </Text>
                  <View style={styles.modalFooter}>
                    <Text style={styles.modalInstrucao}>
                      {perguntaAtual < perguntasData.length - 1
                        ? '👉 Deslize para continuar'
                        : '🏁 Finalizando...'}
                    </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 25,
    marginHorizontal: 30,
    maxWidth: width * 0.85,
    shadowColor: theme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.textColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    color: theme.secondaryColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalGifImage: {
    width: 200,
    height: 150,
    marginVertical: 15,
    borderRadius: 12,
  },
  respostaCorretaTexto: {
    fontSize: 16,
    color: theme.textColor,
    textAlign: 'center',
    backgroundColor: theme.isHighContrast ? '#00FF00' + '20' : '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: '600',
  },
  modalFooter: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
    width: '100%',
  },
  modalInstrucao: {
    fontSize: 16,
    color: theme.secondaryColor,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gifImage: {
    width: 150,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
  },
});