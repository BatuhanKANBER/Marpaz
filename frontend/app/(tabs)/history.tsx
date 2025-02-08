import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../context/ListContext';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function HistoryScreen() {
  const { completedLists } = useList();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <ScrollView style={styles.listsContainer}>
        {completedLists.length > 0 ? (
          completedLists.map((list) => (
            <View key={`completed-list-${list.id}`} 
              style={[styles.listCard, theme === 'dark' && styles.darkListCard]}
            >
              <TouchableOpacity 
                style={[styles.listHeader, expandedId === list.id && styles.listHeaderExpanded]}
                onPress={() => setExpandedId(expandedId === list.id ? null : list.id)}
              >
                <View>
                  <Text style={[styles.listTitle, theme === 'dark' && styles.darkText]}>{list.name}</Text>
                  <Text style={[styles.completedDate, theme === 'dark' && styles.darkText]}>
                    {new Date(list.completedAt!).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <Ionicons 
                  name={expandedId === list.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
              
              {expandedId === list.id && (
                <View style={styles.listContent}>
                  {list.items.map((item, index) => (
                    <View key={`completed-item-${list.id}-${index}`} style={styles.listItem}>
                      <Text style={[styles.listItemText, theme === 'dark' && styles.darkText]}>- {item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={[styles.emptyContainer, theme === 'dark' && styles.darkText]}>
            <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
              Geçmiş Liste Bulunmamaktadır.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  listsContainer: {
    flex: 1,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  listHeaderExpanded: {
    borderBottomColor: '#e0e0e0',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  listItem: {
    paddingVertical: 4,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  darkListCard: {
    backgroundColor: '#2a2a2a',
  },
  darkText: {
    color: '#fff',
  },
}); 