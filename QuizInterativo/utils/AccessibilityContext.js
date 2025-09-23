import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AccessibilityContext = createContext();

const FONT_SIZE_KEY = 'fontSize';

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedSize = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (savedSize !== null) {
          setFontSize(parseFloat(savedSize));
        }
      } catch (e) {
        console.error('Failed to load font size from storage', e);
      }
    };
    loadFontSize();
  }, []);

  const saveFontSize = async (newSize) => {
    try {
      const limitedSize = Math.max(12, Math.min(newSize, 24));
      await AsyncStorage.setItem(FONT_SIZE_KEY, limitedSize.toString());
      setFontSize(limitedSize);
    } catch (e) {
      console.error('Failed to save font size to storage', e);
    }
  };

  const increaseFont = () => {
    saveFontSize(fontSize + 2);
  };

  const decreaseFont = () => {
    saveFontSize(fontSize - 2);
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, increaseFont, decreaseFont }}>
      {children}
    </AccessibilityContext.Provider>
  );
};