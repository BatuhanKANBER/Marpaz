import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { completedLists, deleteList } from '../api/api';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useList } from '../context/ListContext';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

interface ListItem {
  id: number;
  name: string;
  items: {
    id: number;
    name: string;
  }[];
  createdDate: string;
  enabled: boolean;
  clientId: string;
}

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { refreshHistory, setRefreshHistory } = useList();
  const [completedItems, setCompletedItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedListId, setExpandedListId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function getClientId() {
    let clientId = await SecureStore.getItemAsync('clientId');
    if (!clientId) {
      clientId = uuidv4();
      await SecureStore.setItemAsync('clientId', clientId);
    }
    return clientId;
  }

  const fetchCompletedLists = async (pageNumber = 0, isLoadMore = false) => {
    try {
      setLoading(!isLoadMore);
      setIsLoadingMore(isLoadMore);
      const clientId = await getClientId();
      const response = await completedLists(clientId, pageNumber);

      if (isLoadMore) {
        setCompletedItems(prev => [...prev, ...response.content]);
      } else {
        setCompletedItems(response.content);
      }

      setHasMore(pageNumber < response.totalPages - 1);
      setPage(pageNumber);
    } catch (error) {
      Alert.alert('Hata', 'Geçmiş listeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchCompletedLists(page + 1, true);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      Alert.alert(
        'Listeyi Sil',
        'Bu listeyi silmek istediğinizden emin misiniz?',
        [
          {
            text: 'İptal',
            style: 'cancel'
          },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              await deleteList(id);
              Alert.alert('Başarılı', 'Liste silindi');
              fetchCompletedLists();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Liste silinirken hata:', error);
      Alert.alert('Hata', 'Liste silinirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchCompletedLists();
  }, []);

  useEffect(() => {
    if (refreshHistory) {
      fetchCompletedLists();
      setRefreshHistory(false);
    }
  }, [refreshHistory, setRefreshHistory]);

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
            Yükleniyor...
          </Text>
        </View>
      ) : completedItems.length > 0 ? (
        <ScrollView style={styles.listsContainer}>
          {completedItems.map((list) => (
            <View
              key={list.id}
              style={[styles.listCard, theme === 'dark' && styles.darkListCard]}
            >
              <TouchableOpacity
                style={[
                  styles.listHeader,
                  theme === 'dark' && styles.darkListHeader,
                  expandedListId === list.id && styles.listHeaderExpanded,
                  expandedListId === list.id && theme === 'dark' && styles.darkListHeaderExpanded
                ]}
                onPress={() => setExpandedListId(expandedListId === list.id ? null : list.id)}
              >
                <View>
                  <Text style={[styles.listTitle, theme === 'dark' && styles.darkListTitle]}>
                    {list.name}
                  </Text>
                  <Text style={[styles.listDate, theme === 'dark' && styles.darkListDate]}>
                    {new Date(list.createdDate).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteList(list.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={theme === 'dark' ? '#ff6b6b' : '#dc3545'}
                    />
                  </TouchableOpacity>
                  <Ionicons
                    name={expandedListId === list.id ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={theme === 'dark' ? '#fff' : '#007AFF'}
                  />
                </View>
              </TouchableOpacity>

              {expandedListId === list.id && (
                <View style={[styles.listContent, theme === 'dark' && styles.darkListContent]}>
                  {list.items.map((item) => (
                    <View key={item.id} style={styles.listItem}>
                      <Text style={[styles.listItemText, theme === 'dark' && styles.darkListItemText]}>
                        - {item.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {hasMore && (
            <TouchableOpacity
              style={[styles.loadMoreButton, theme === 'dark' && styles.darkLoadMoreButton]}
              onPress={() => loadMore()}
              disabled={isLoadingMore}
            >
              <Text style={[styles.loadMoreText, theme === 'dark' && styles.darkText]}>
                {isLoadingMore ? 'Yükleniyor...' : 'Daha Fazla Göster'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
            Geçmiş Liste Bulunmamaktadır.
          </Text>
        </View>
      )}
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
    paddingBottom: 100,
  },
  listCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#333',
  },
  listDate: {
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
  darkListHeader: {
    borderBottomColor: '#333',
  },
  darkListContent: {
    backgroundColor: '#2a2a2a',
  },
  darkListTitle: {
    color: '#fff',
  },
  darkListDate: {
    color: '#999',
  },
  darkListItemText: {
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  darkListHeaderExpanded: {
    borderBottomColor: '#333',
  },
  loadMoreButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkLoadMoreButton: {
    backgroundColor: '#2a2a2a',
  },
  loadMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
}); 