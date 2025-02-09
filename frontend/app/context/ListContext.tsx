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
  setActiveLists: (lists: ListItem[]) => void;
  refreshHistory: boolean;
  setRefreshHistory: (refresh: boolean) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [activeLists, setActiveLists] = useState<ListItem[]>([]);
  const [refreshHistory, setRefreshHistory] = useState(false);

  return (
    <ListContext.Provider value={{
      activeLists,
      setActiveLists,
      refreshHistory,
      setRefreshHistory,
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