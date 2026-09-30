import '../global.css'; // Deve ser a primeira linha
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1e40af' }, // Azul escuro
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes' }} />
    </Stack>
  );
}