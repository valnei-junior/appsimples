import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const router = useRouter();

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const historicoStr = await AsyncStorage.getItem('historicoPontuacoes');
      const dados = historicoStr ? JSON.parse(historicoStr) : [];
      setHistorico(dados.reverse()); // Mostra o mais recente primeiro
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Pontuações</Text>
      <ScrollView style={styles.lista}>
        {historico.length === 0 ? (
          <Text style={styles.semHistorico}>Nenhum resultado salvo ainda.</Text>
        ) : (
          historico.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text>
                {item.pontuacao} / {item.totalPerguntas} — {new Date(item.data).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Button title="Voltar ao Início" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  lista: { flex: 1 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nome: { fontWeight: '600', fontSize: 18 },
  semHistorico: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#666' },
});
