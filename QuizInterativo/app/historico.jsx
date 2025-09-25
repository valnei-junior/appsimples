import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConfig } from '../contexts/ConfigContext';

const { width } = Dimensions.get('window');

export default function Historico() {
  const router = useRouter();
  const { theme } = useConfig();

  const [historico, setHistorico] = useState([]);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Puxar histórico do AsyncStorage
  const carregarHistorico = async () => {
    try {
      const historicoJSON = await AsyncStorage.getItem('@historico_resultados');
      const dados = historicoJSON ? JSON.parse(historicoJSON) : [];
      setHistorico(dados);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  useEffect(() => {
    carregarHistorico();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const formatarData = (isoString) => {
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const voltarHome = () => {
    router.push('/');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <Text style={styles.title}>Histórico de Resultados</Text>

        {historico.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum resultado registrado ainda.</Text>
        ) : (
          historico.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.nome}>{item.nomeUsuario}</Text>
                <Text style={styles.data}>{formatarData(item.data)}</Text>
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.pontuacao}>
                  {item.pontuacao}/{item.totalPerguntas} acertos
                </Text>
                <Text style={styles.porcentagem}>
                  Aproveitamento: {item.porcentagem}%
                </Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.botaoHome} onPress={voltarHome}>
          <Text style={styles.textoBotaoHome}>🏠 Voltar ao Início</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.textColor,
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.secondaryColor,
    textAlign: 'center',
    marginTop: 40,
  },
  itemContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  data: {
    fontSize: 14,
    color: theme.secondaryColor,
  },
  itemBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pontuacao: {
    fontSize: 16,
    color: theme.textColor,
    fontWeight: '600',
  },
  porcentagem: {
    fontSize: 16,
    color: theme.infoColor,
    fontWeight: '600',
  },
  botaoHome: {
    backgroundColor: theme.cardBackground,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.primaryColor,
    marginTop: 30,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
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
