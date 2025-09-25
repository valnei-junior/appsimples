// _layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/ConfigContext';
import { AccessibilityProvider } from '../utils/AccessibilityContext';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <AccessibilityProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AccessibilityProvider>
    </ConfigProvider>
  );
}