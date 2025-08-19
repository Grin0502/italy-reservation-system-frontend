import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tablesAPI, zonesAPI } from '../services/api';
import { useAuth } from './AuthContext';

export interface Table {
  _id: string;
  number: string;
  zoneId: string | { _id: string; name: string; color: string };
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  position?: { x: number; y: number };
  shape?: 'round' | 'square' | 'rectangle';
  notes?: string;
  isActive: boolean;
  currentBooking?: any;
}

export interface Zone {
  _id: string;
  name: string;
  description?: string;
  color: string;
  position?: { x: number; y: number };
  isActive: boolean;
  tableCount?: number;
}

interface TableZoneContextType {
  tables: Table[];
  zones: Zone[];
  loading: boolean;
  error: string | null;
  addTable: (table: Omit<Table, '_id'>) => Promise<void>;
  removeTable: (tableId: string) => Promise<void>;
  updateTable: (tableId: string, updates: Partial<Table>) => Promise<void>;
  addZone: (zone: Omit<Zone, '_id'>) => Promise<void>;
  removeZone: (zoneId: string) => Promise<void>;
  updateZone: (zoneId: string, updates: Partial<Zone>) => Promise<void>;
  getTablesByZone: (zoneId: string) => Table[];
  getZoneById: (zoneId: string) => Zone | undefined;
  refreshData: () => Promise<void>;
}

const TableZoneContext = createContext<TableZoneContextType | undefined>(undefined);

export const TableZoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user || !token) {
      return; // Don't fetch if not authenticated
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const [tablesResponse, zonesResponse] = await Promise.all([
        tablesAPI.getAll(),
        zonesAPI.getAll()
      ]);
      
      setTables(tablesResponse.data || []);
      setZones(zonesResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user logs in
  useEffect(() => {
    if (user && token) {
      fetchData();
    } else {
      // Clear data when user logs out
      setTables([]);
      setZones([]);
      setError(null);
    }
  }, [user, token]);

  const addTable = async (table: Omit<Table, '_id'>) => {
    try {
      setError(null);
      const response = await tablesAPI.create(table);
      const newTable = response.data;
      setTables(prev => [...prev, newTable]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add table');
      throw err;
    }
  };

  const removeTable = async (tableId: string) => {
    try {
      setError(null);
      await tablesAPI.delete(tableId);
      setTables(prev => prev.filter(table => table._id !== tableId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove table');
      throw err;
    }
  };

  const updateTable = async (tableId: string, updates: Partial<Table>) => {
    try {
      setError(null);
      const response = await tablesAPI.update(tableId, updates);
      const updatedTable = response.data;
      setTables(prev => prev.map(table => 
        table._id === tableId ? updatedTable : table
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update table');
      throw err;
    }
  };

  const addZone = async (zone: Omit<Zone, '_id'>) => {
    try {
      setError(null);
      const response = await zonesAPI.create(zone);
      const newZone = response.data;
      setZones(prev => [...prev, newZone]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add zone');
      throw err;
    }
  };

  const removeZone = async (zoneId: string) => {
    try {
      setError(null);
      await zonesAPI.delete(zoneId);
      setZones(prev => prev.filter(zone => zone._id !== zoneId));
      // Also remove tables in this zone
      setTables(prev => prev.filter(table => {
        // Handle both populated zoneId (object) and non-populated zoneId (string)
        if (typeof table.zoneId === 'object' && table.zoneId !== null) {
          return table.zoneId._id !== zoneId;
        }
        return table.zoneId !== zoneId;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove zone');
      throw err;
    }
  };

  const updateZone = async (zoneId: string, updates: Partial<Zone>) => {
    try {
      setError(null);
      const response = await zonesAPI.update(zoneId, updates);
      const updatedZone = response.data;
      setZones(prev => prev.map(zone => 
        zone._id === zoneId ? updatedZone : zone
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update zone');
      throw err;
    }
  };

  const getTablesByZone = (zoneId: string) => {
    return tables.filter(table => {
      // Handle both populated zoneId (object) and non-populated zoneId (string)
      if (typeof table.zoneId === 'object' && table.zoneId !== null) {
        return table.zoneId._id === zoneId;
      }
      return table.zoneId === zoneId;
    });
  };

  const getZoneById = (zoneId: string) => {
    return zones.find(zone => zone._id === zoneId);
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <TableZoneContext.Provider value={{
      tables,
      zones,
      loading,
      error,
      addTable,
      removeTable,
      updateTable,
      addZone,
      removeZone,
      updateZone,
      getTablesByZone,
      getZoneById,
      refreshData
    }}>
      {children}
    </TableZoneContext.Provider>
  );
};

export const useTableZone = (): TableZoneContextType => {
  const context = useContext(TableZoneContext);
  if (context === undefined) {
    throw new Error('useTableZone must be used within a TableZoneProvider');
  }
  return context;
};
