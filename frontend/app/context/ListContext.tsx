import { createContext, useContext, useState } from 'react';

interface ListItem {
  id: string;
  name: string;
  items: string[];
  isExpanded?: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface ListContextType {
  activeLists: ListItem[];
  completedLists: ListItem[];
  setActiveLists: (lists: ListItem[]) => void;
  setCompletedLists: (lists: ListItem[]) => void;
  completeList: (id: string) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [activeLists, setActiveLists] = useState<ListItem[]>([]);
  const [completedLists, setCompletedLists] = useState<ListItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const generateUniqueId = () => {
    const id = `list-${nextId}`;
    setNextId(prev => prev + 1);
    return id;
  };

  const completeList = (id: string) => {
    const listToComplete = activeLists.find(list => list.id === id);
    if (listToComplete) {
      // Listeyi aktif listelerden kaldır
      setActiveLists(activeLists.filter(list => list.id !== id));
      
      // Listeyi tamamlanmış listelere ekle
      const completedList = {
        ...listToComplete,
        id: generateUniqueId(), // Yeni benzersiz ID oluştur
        completedAt: new Date(),
      };
      setCompletedLists([completedList, ...completedLists]);
    }
  };

  return (
    <ListContext.Provider value={{
      activeLists,
      completedLists,
      setActiveLists: (lists) => {
        setActiveLists(lists.map(list => ({
          ...list,
          id: list.id.startsWith('list-') ? list.id : generateUniqueId()
        })));
      },
      setCompletedLists,
      completeList,
    }}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
} 