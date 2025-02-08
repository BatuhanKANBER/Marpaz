import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
      },
      headerTintColor: theme === 'dark' ? '#fff' : '#000',
      tabBarStyle: {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
        borderTopColor: theme === 'dark' ? '#333' : '#e0e0e0',
      },
      tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#007AFF',
      tabBarInactiveTintColor: theme === 'dark' ? '#666' : 'gray',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Geçmiş Listeler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 