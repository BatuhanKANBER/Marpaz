import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.darkContainer
    ]}>
      <TouchableOpacity
        style={[
          styles.settingItem,
          theme === 'dark' && styles.darkSettingItem
        ]}
        onPress={toggleTheme}
      >
        <View style={styles.settingContent}>
          <Ionicons 
            name={theme === 'dark' ? 'moon' : 'sunny'} 
            size={24} 
            color={theme === 'dark' ? '#fff' : '#000'} 
          />
          <Text style={[
            styles.settingText,
            theme === 'dark' && styles.darkText
          ]}>
            Karanlık Mod
          </Text>
        </View>
        <View style={[
          styles.radioButton,
          theme === 'dark' && styles.darkRadioButton
        ]}>
          <View style={[
            styles.radioInner,
            theme === 'dark' && styles.darkRadioInner,
            theme === 'dark' && styles.radioInnerSelected
          ]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkSettingItem: {
    backgroundColor: '#2a2a2a',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  darkText: {
    color: '#fff',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkRadioButton: {
    borderColor: '#fff',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    opacity: 0,
  },
  darkRadioInner: {
    backgroundColor: '#fff',
  },
  radioInnerSelected: {
    opacity: 1,
  },
}); 