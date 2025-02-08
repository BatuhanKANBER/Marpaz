import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useList } from '../context/ListContext';
import { useTheme } from '../context/ThemeContext';

interface ListItem {
  id: string;
  name: string;
  items: string[];
  isExpanded?: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export default function HomeScreen() {
  const { activeLists, setActiveLists, completeList } = useList();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [listName, setListName] = useState('');
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const { theme } = useTheme();

  const toggleList = (id: string) => {
    setActiveLists(activeLists.map(list => 
      list.id === id ? { ...list, isExpanded: !list.isExpanded } : list
    ));
  };

  const addItemToList = () => {
    if (newItem.trim()) {
      setCurrentItems([...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const createNewList = () => {
    if (currentItems.length > 0 && listName.trim()) {
      const newList: ListItem = {
        id: `new-${Date.now()}`,
        name: listName.trim(),
        items: currentItems,
        isExpanded: false,
        createdAt: new Date(),
      };
      setActiveLists([...activeLists, newList]);
      setCurrentItems([]);
      setListName('');
      setModalVisible(false);
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

      <ScrollView style={styles.listsContainer}>
        {activeLists.length > 0 ? (
          activeLists.map((list) => (
            <View key={list.id} style={[styles.listCard, theme === 'dark' && styles.darkListCard]}>
              <TouchableOpacity 
                style={[
                  styles.listHeader,
                  list.isExpanded && styles.listHeaderExpanded,
                  theme === 'dark' && styles.darkListHeader,
                  list.isExpanded && theme === 'dark' && styles.darkListHeaderExpanded
                ]}
                onPress={() => toggleList(list.id)}
              >
                <Text style={[styles.listTitle, theme === 'dark' && styles.darkText]}>
                  {list.name}
                </Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity 
                    style={styles.completeButton}
                    onPress={() => completeList(list.id)}
                  >
                    <Ionicons name="checkmark-circle" size={24} color={theme === 'dark' ? '#6FCF97' : '#4CAF50'} />
                  </TouchableOpacity>
                  <Ionicons 
                    name={list.isExpanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={theme === 'dark' ? '#fff' : '#007AFF'} 
                  />
                </View>
              </TouchableOpacity>
              
              {list.isExpanded && (
                <View style={[styles.listContent, theme === 'dark' && styles.darkListContent]}>
                  {list.items.map((item, index) => (
                    <View key={`${list.id}-${index}`} style={styles.listItem}>
                      <Text style={[styles.listItemText, theme === 'dark' && styles.darkText]}>
                        - {item}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
              Aktif Liste Bulunmamaktadır.
            </Text>
          </View>
        )}
      </ScrollView>

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

            <ScrollView style={styles.currentItemsList}>
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
            </ScrollView>

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
                  (!listName.trim() || currentItems.length === 0) && 
                    (theme === 'dark' ? styles.darkSaveButtonDisabled : styles.saveButtonDisabled)
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
  listsContainer: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeButton: {
    padding: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
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
  darkListCard: {
    backgroundColor: '#2a2a2a',
  },
  darkListHeader: {
    borderBottomColor: '#333',
  },
  darkListHeaderExpanded: {
    borderBottomColor: '#333',
  },
  darkListContent: {
    borderTopColor: '#333',
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
}); 