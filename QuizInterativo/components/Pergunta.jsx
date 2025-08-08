import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Pergunta = ({ pergunta, numeroPergunta, totalPerguntas }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.contador}>
          Pergunta {numeroPergunta} de {totalPerguntas}
        </Text>
      </View>
      <View style={styles.perguntaContainer}>
        <Text style={styles.perguntaTexto}>{pergunta}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Pergunta;
