import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useConfig } from '../contexts/ConfigContext';
import { AccessibilityContext } from '../utils/AccessibilityContext';

export default function Configuracoes() {
  const router = useRouter();
  
  // Acessa as configurações de tema e som
  const {
    isHighContrast,
    somAtivado,
    toggleHighContrast,
    toggleSound,
    theme,
  } = useConfig();

  // Acessa as configurações de acessibilidade da fonte
  const { fontSize, increaseFont, decreaseFont } = useContext(AccessibilityContext);

  const voltar = () => {
    router.back();
  };

  const styles = createStyles(theme, fontSize);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Configurações</Text>
        <View style={styles.espacoVazio} />
      </View>

      <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* Aparência */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>🎨 Aparência</Text>
          <View style={styles.opcao}>
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Alto Contraste</Text>
              <Text style={styles.opcaoDescricao}>
                Ativa cores de alto contraste para melhor legibilidade
              </Text>
            </View>
            <Switch
              value={isHighContrast}
              onValueChange={toggleHighContrast}
              trackColor={{ false: theme.borderColor, true: theme.primaryColor }}
              thumbColor={isHighContrast ? theme.buttonText : theme.secondaryColor}
              ios_backgroundColor={theme.borderColor}
            />
          </View>
        </View>

        {/* Áudio */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>🔊 Áudio</Text>
          <View style={styles.opcao}>
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Efeitos Sonoros</Text>
              <Text style={styles.opcaoDescricao}>
                Ativa ou desativa os sons do quiz
              </Text>
            </View>
            <Switch
              value={somAtivado}
              onValueChange={toggleSound}
              trackColor={{ false: theme.borderColor, true: theme.primaryColor }}
              thumbColor={somAtivado ? theme.buttonText : theme.secondaryColor}
              ios_backgroundColor={theme.borderColor}
            />
          </View>
        </View>

        {/* Acessibilidade */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>♿ Acessibilidade</Text>
          <View style={styles.opcao}>
            <View style={styles.opcaoTexto}>
              <Text style={styles.opcaoTitulo}>Tamanho da Fonte</Text>
              <Text style={styles.opcaoDescricao}>
                Ajuste o tamanho do texto para melhor leitura
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.botaoFonte}
                onPress={decreaseFont} // Corrigido para chamar a função do AccessibilityContext
              >
                <Text style={styles.botaoTexto}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoFonte}
                onPress={increaseFont} // Corrigido para chamar a função do AccessibilityContext
              >
                <Text style={styles.botaoTexto}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>ℹ️ Informações</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitulo}>Sobre o Quiz</Text>
            <Text style={styles.infoTexto}>
              Potiquiz v1.0{'\n'}
              Um quiz interativo desenvolvido para testar seus conhecimentos de forma divertida.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitulo}>Como usar</Text>
            <Text style={styles.infoTexto}>
              • Deslize para a direita para próxima pergunta{'\n'}
              • Toque nas opções para selecionar{'\n'}
              • Configure o som e contraste aqui
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme, fontSize) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    botaoVoltar: {
      padding: 5,
    },
    textoVoltar: {
      fontSize: fontSize,
      color: theme.primaryColor,
      fontWeight: '600',
    },
    titulo: {
      fontSize: fontSize + 4, // Exemplo de ajuste proporcional
      fontWeight: 'bold',
      color: theme.textColor,
    },
    espacoVazio: {
      width: 60,
    },
    conteudo: {
      flex: 1,
      paddingHorizontal: 20,
    },
    secao: {
      marginTop: 30,
    },
    tituloSecao: {
      fontSize: fontSize + 2, // Exemplo de ajuste proporcional
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 15,
    },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardBackground,
      padding: 20,
      borderRadius: 15,
      marginBottom: 10,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    opcaoTexto: {
      flex: 1,
      marginRight: 15,
    },
    opcaoTitulo: {
      fontSize: fontSize,
      fontWeight: '600',
      color: theme.textColor,
      marginBottom: 5,
    },
    opcaoDescricao: {
      fontSize: fontSize - 2,
      color: theme.secondaryColor,
      lineHeight: fontSize + 4,
    },
    botaoFonte: {
      backgroundColor: theme.primaryColor,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    botaoTexto: {
      fontSize: fontSize,
      fontWeight: 'bold',
      color: theme.buttonText,
    },
    infoCard: {
      backgroundColor: theme.cardBackground,
      padding: 20,
      borderRadius: 15,
      marginBottom: 15,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoTitulo: {
      fontSize: fontSize,
      fontWeight: '600',
      color: theme.textColor,
      marginBottom: 10,
    },
    infoTexto: {
      fontSize: fontSize - 2,
      color: theme.secondaryColor,
      lineHeight: fontSize + 4,
    },
  });