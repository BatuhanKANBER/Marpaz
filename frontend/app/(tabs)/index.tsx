import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { create, getActiveLists, listCompleted } from '../api/api';
import { useList } from '../context/ListContext';

interface ListItem {
  id: number;
  name: string;
  items: {
    id: number;
    name: string;
  }[];
  createdDate: string;
  enabled: boolean;
}

interface PageResponse {
  content: ListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export default function HomeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [listName, setListName] = useState('');
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [activeLists, setActiveLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [expandedListId, setExpandedListId] = useState<number | null>(null);
  const { setRefreshHistory } = useList();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchActiveLists = async (pageNumber = 0, isLoadMore = false) => {
    try {
      setLoading(!isLoadMore);
      setIsLoadingMore(isLoadMore);
      const response = await getActiveLists(pageNumber);

      const reversedContent = [...response.content].reverse();

      if (isLoadMore) {
        setActiveLists(prev => [...prev, ...reversedContent]);
      } else {
        setActiveLists(reversedContent);
      }

      setHasMore(pageNumber < response.totalPages - 1);
      setPage(pageNumber);
    } catch (error) {
      console.error('Listeler yüklenirken hata:', error);
      Alert.alert('Hata', 'Listeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchActiveLists(page + 1, true);
    }
  };

  useEffect(() => {
    fetchActiveLists();
  }, []);

  const addItemToList = () => {
    if (newItem.trim()) {
      setCurrentItems([...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const createNewList = async () => {
    if (currentItems.length > 0 && listName.trim()) {
      const requestBody = {
        name: listName.trim().toUpperCase(),
        items: currentItems.map(item => ({
          name: item.trim().toUpperCase()
        }))
      };

      try {
        console.log("Gönderilen veri:", JSON.stringify(requestBody, null, 2));
        const response = await create(requestBody);
        console.log("Sunucu yanıtı:", response.data);
        console.log("Sunucu yanıtı:", response.status);

        if (response.status === 200) {
          Alert.alert('Başarılı', 'Liste oluşturuldu');
          setCurrentItems([]);
          setListName('');
          setModalVisible(false);
          fetchActiveLists();
        }
      } catch (error: any) {
        console.error('API Hatası:', error);
        
        // Validation hatalarını kontrol et
        if (error.response?.data?.validationErrors) {
          const errors = error.response.data.validationErrors;
          const errorMessages = Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          
          Alert.alert('Doğrulama Hatası', errorMessages);
        } else if (error.response?.data?.message) {
          // Genel hata mesajı
          Alert.alert('Hata', error.response.data.message);
        } else {
          // Diğer hatalar
          Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu');
        }
      }
    }
  };

  const handleCompleteList = async (id: number) => {
    try {
      await listCompleted(id);
      Alert.alert('Başarılı', 'Liste tamamlandı');
      fetchActiveLists();
      setRefreshHistory(true); // History sayfasını yenilemek için
    } catch (error) {
      console.error('Liste tamamlanırken hata:', error);
      Alert.alert('Hata', 'Liste tamamlanırken bir hata oluştu');
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <TouchableOpacity
        style={[styles.createButton, theme === 'dark' && styles.darkCreateButton]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme === 'dark' ? '#fff' : '#007AFF'} />
        <Text style={[styles.createButtonText, theme === 'dark' && styles.darkText]}>
          Liste Oluştur
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
            Yükleniyor...
          </Text>
        </View>
      ) : activeLists.length > 0 ? (
        <ScrollView style={styles.listsContainer}>
          {activeLists.map((list) => (
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
                    style={styles.completeButton}
                    onPress={() => handleCompleteList(list.id)}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color={theme === 'dark' ? '#6FCF97' : '#4CAF50'}
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
            Aktif Liste Bulunmamaktadır.
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme === 'dark' && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, theme === 'dark' && styles.darkText]}>
              Yeni Liste Oluştur
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  theme === 'dark' && styles.darkInput,
                  { color: theme === 'dark' ? '#fff' : '#000' }
                ]}
                value={listName}
                onChangeText={setListName}
                placeholder="Liste adı..."
                placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  theme === 'dark' && styles.darkInput,
                  { color: theme === 'dark' ? '#fff' : '#000' }
                ]}
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Ürün ekle..."
                onSubmitEditing={addItemToList}
                placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
              />
              <TouchableOpacity
                style={[styles.addButton, theme === 'dark' && styles.darkAddButton]}
                onPress={addItemToList}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.currentItemsList}>
              {currentItems.map((item, index) => (
                <View key={`new-${index}`} style={[
                  styles.currentItem,
                  theme === 'dark' && styles.darkCurrentItem
                ]}>
                  <Text style={[styles.currentItemText, theme === 'dark' && styles.darkText]}>
                    - {item}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentItems(currentItems.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={20} color={theme === 'dark' ? '#ff6b6b' : 'red'} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  theme === 'dark' && styles.darkCancelButton
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentItems([]);
                  setNewItem('');
                  setListName('');
                }}
              >
                <Text style={[styles.cancelButtonText, theme === 'dark' && styles.darkText]}>
                  İptal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  theme === 'dark' && styles.darkSaveButton,
                  (!listName.trim() || currentItems.length === 0) && {
                    backgroundColor: theme === 'dark' ? '#333' : '#ccc'
                  }
                ]}
                onPress={createNewList}
                disabled={!listName.trim() || currentItems.length === 0}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
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
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentItemsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  currentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  currentItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  darkCreateButton: {
    backgroundColor: '#2a2a2a',
  },
  darkText: {
    color: '#fff',
  },
  darkModalContent: {
    backgroundColor: '#2a2a2a',
  },
  darkInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    color: '#fff',
  },
  darkAddButton: {
    backgroundColor: '#007AFF',
  },
  darkCurrentItem: {
    borderBottomColor: '#333',
  },
  darkCancelButton: {
    backgroundColor: '#1a1a1a',
  },
  darkSaveButton: {
    backgroundColor: '#007AFF',
  },
  darkSaveButtonDisabled: {
    backgroundColor: '#333',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  listsContainer: {
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
  darkListCard: {
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
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
  listHeaderExpanded: {
    borderBottomColor: '#e0e0e0',
  },
  darkListHeaderExpanded: {
    borderBottomColor: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeButton: {
    padding: 4,
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
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
}); 