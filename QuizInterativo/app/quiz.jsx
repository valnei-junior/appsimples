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

const { width } = Dimensions.get('window');

// Componente Pergunta
const Pergunta = ({ pergunta, numeroPergunta, totalPerguntas }) => {
  return (
    <View style={perguntaStyles.container}>
      <View style={perguntaStyles.header}>
        <Text style={perguntaStyles.contador}>
          Pergunta {numeroPergunta} de {totalPerguntas}
        </Text>
      </View>
      <View style={perguntaStyles.perguntaContainer}>
        <Text style={perguntaStyles.perguntaTexto}>{pergunta}</Text>
      </View>
    </View>
  );
};

// Componente Opções
const Opcoes = ({ opcoes, onSelect, opcaoSelecionada, respostaCorreta, mostrarResultado }) => {
  
  const getOpcaoStyle = (index) => {
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? opcoesStyles.opcaoSelecionada : opcoesStyles.opcao;
    }
    
    if (index === respostaCorreta) {
      return opcoesStyles.opcaoCorreta;
    }
    
    if (opcaoSelecionada === index && index !== respostaCorreta) {
      return opcoesStyles.opcaoErrada;
    }
    
    return opcoesStyles.opcaoDesabilitada;
  };

  const getTextoStyle = (index) => {
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? opcoesStyles.textoSelecionado : opcoesStyles.textoOpcao;
    }
    
    if (index === respostaCorreta) {
      return opcoesStyles.textoCorreto;
    }
    
    if (opcaoSelecionada === index && index !== respostaCorreta) {
      return opcoesStyles.textoErrado;
    }
    
    return opcoesStyles.textoDesabilitado;
  };

  return (
    <View style={opcoesStyles.container}>
      {opcoes.map((opcao, index) => (
        <TouchableOpacity
          key={index}
          style={getOpcaoStyle(index)}
          onPress={() => !mostrarResultado && onSelect(index)}
          disabled={mostrarResultado}
          activeOpacity={0.7}
        >
          <View style={opcoesStyles.opcaoContent}>
            <Text style={opcoesStyles.letra}>
              {String.fromCharCode(65 + index)}
            </Text>
            <Text style={[opcoesStyles.textoOpcao, getTextoStyle(index)]}>
              {opcao}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Quiz() {
  const router = useRouter();
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

  const selecionarOpcao = (indice) => {
    if (mostrarResultado) return;
    
    setOpcaoSelecionada(indice);
    
    // Aguarda um momento antes de mostrar o resultado
    setTimeout(() => {
      setMostrarResultado(true);
      
      // Verifica se a resposta está correta
      const pergunta = perguntasData[perguntaAtual];
      const acertou = indice === pergunta.respostaCorreta;
      
      // 🔊 TOCAR SOM baseado na resposta
      if (acertou) {
        setPontuacao(pontuacao + 1);
        soundService.playCorrect(); // Som de acerto
      } else {
        soundService.playWrong(); // Som de erro
      }
      
      // Armazena a resposta do usuário
      const novaResposta = {
        pergunta: pergunta.pergunta,
        opcaoSelecionada: indice,
        respostaCorreta: pergunta.respostaCorreta,
        acertou: acertou,
      };
      
      setRespostasUsuario([...respostasUsuario, novaResposta]);
      
      // Auto-avança após 2 segundos se não for a última pergunta
      if (perguntaAtual < perguntasData.length - 1) {
        setTimeout(() => {
          proximaPergunta();
        }, 2000);
      } else {
        // Se for a última pergunta, vai para resultado após 2 segundos
        setTimeout(() => {
          irParaResultado();
        }, 2000);
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
    const resultadoFinal = {
      pontuacao: pontuacao + (opcaoSelecionada === perguntasData[perguntaAtual]?.respostaCorreta ? 1 : 0),
      totalPerguntas: perguntasData.length,
      respostasUsuario: respostasUsuario,
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
  }, []);

  const pergunta = perguntasData[perguntaAtual];

  if (!pergunta) {
    return null;
  }

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

        <Pergunta
          pergunta={pergunta.pergunta}
          numeroPergunta={perguntaAtual + 1}
          totalPerguntas={perguntasData.length}
        />

        <Opcoes
          opcoes={pergunta.opcoes}
          onSelect={selecionarOpcao}
          opcaoSelecionada={opcaoSelecionada}
          respostaCorreta={pergunta.respostaCorreta}
          mostrarResultado={mostrarResultado}
        />

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

// Estilos para Pergunta
const perguntaStyles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contador: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  perguntaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
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
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 28,
  },
});

// Estilos para Opções
const opcoesStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  opcao: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  opcaoSelecionada: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoCorreta: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#4caf50',
    shadowColor: '#4caf50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoErrada: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#f44336',
    shadowColor: '#f44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  opcaoDesabilitada: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    opacity: 0.6,
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
    color: '#2c3e50',
    width: 30,
    textAlign: 'center',
  },
  textoOpcao: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    fontWeight: '500',
  },
  textoSelecionado: {
    color: '#1976d2',
    fontWeight: '600',
  },
  textoCorreto: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  textoErrado: {
    color: '#c62828',
    fontWeight: '600',
  },
  textoDesabilitado: {
    color: '#9e9e9e',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  feedback: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  feedbackContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 30,
    shadowColor: '#000',
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
    color: '#2c3e50',
    marginBottom: 10,
  },
  proximaInstrucao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
