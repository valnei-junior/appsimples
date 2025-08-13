import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Opcoes = ({ opcoes, onSelect, opcaoSelecionada, respostaCorreta, mostrarResultado }) => {
  
  const getOpcaoStyle = (index) => {
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? styles.opcaoSelecionada : styles.opcao;
    }
    
    if (index === respostaCorreta) {
      return styles.opcaoCorreta;
    }
    
    if (opcaoSelecionada === index && index !== respostaCorreta) {
      return styles.opcaoErrada;
    }
    
    return styles.opcaoDesabilitada;
  };

  const getTextoStyle = (index) => {
    if (!mostrarResultado) {
      return opcaoSelecionada === index ? styles.textoSelecionado : styles.textoOpcao;
    }
    
    if (index === respostaCorreta) {
      return styles.textoCorreto;
    }
    
    if (opcaoSelecionada === index && index !== respostaCorreta) {
      return styles.textoErrado;
    }
    
    return styles.textoDesabilitado;
  };

  return (
    <View style={styles.container}>
      {opcoes.map((opcao, index) => (
        <TouchableOpacity
          key={index}
          style={getOpcaoStyle(index)}
          onPress={() => !mostrarResultado && onSelect(index)}
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
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Opcoes;