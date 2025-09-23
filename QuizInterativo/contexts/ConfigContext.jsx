import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [somAtivado, setSomAtivado] = useState(true);

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const highContrast = await AsyncStorage.getItem('@quiz_high_contrast');
      const soundEnabled = await AsyncStorage.getItem('@quiz_sound_enabled');
      
      if (highContrast !== null) {
        setIsHighContrast(JSON.parse(highContrast));
      }
      if (soundEnabled !== null) {
        setSomAtivado(JSON.parse(soundEnabled));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const toggleHighContrast = async () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    try {
      await AsyncStorage.setItem('@quiz_high_contrast', JSON.stringify(newValue));
    } catch (error) {
      console.error('Erro ao salvar configuração de contraste:', error);
    }
  };

  const toggleSound = async () => {
    const newValue = !somAtivado;
    setSomAtivado(newValue);
    try {
      await AsyncStorage.setItem('@quiz_sound_enabled', JSON.stringify(newValue));
    } catch (error) {
      console.error('Erro ao salvar configuração de som:', error);
    }
  };

  // Temas de cores
  const getTheme = () => {
    if (isHighContrast) {
      return {
        backgroundColor: '#000000',
        primaryColor: '#FFFF00',
        secondaryColor: '#FFFFFF',
        textColor: '#FFFFFF',
        cardBackground: '#333333',
        buttonBackground: '#FFFF00',
        buttonText: '#000000',
        borderColor: '#FFFF00',
        shadowColor: '#FFFF00',
        infoColor: '#FFFF00',
      };
    }
    return {
      backgroundColor: '#f8f9fa',
      primaryColor: 'brown',
      secondaryColor: '#666',
      textColor: '#333',
      cardBackground: '#fff',
      buttonBackground: 'brown',
      buttonText: '#fff',
      borderColor: '#e0e0e0',
      shadowColor: '#000',
      infoColor: 'brown',
    };
  };

  const value = {
    isHighContrast,
    somAtivado,
    toggleHighContrast,
    toggleSound,
    theme: getTheme(),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};