import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/ConfigContext';

export default function Layout() {
  return (
    <ConfigProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ConfigProvider>
  );
}