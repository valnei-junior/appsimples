import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AccessibilityContext } from '../utils/AccessibilityContext';

export default function FontSizeControls() {
  const { increaseFont, decreaseFont } = useContext(AccessibilityContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={increaseFont}>
        <Text style={styles.buttonText}>A+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={decreaseFont}>
        <Text style={styles.buttonText}>A-</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
    gap: 5,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
});