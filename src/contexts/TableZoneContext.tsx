import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface Table {
  id: string;
  number: string;
  zoneId: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  position?: { x: number; y: number };
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  color: string;
  tables: string[]; // Table IDs
}

interface TableZoneContextType {
  tables: Table[];
  zones: Zone[];
  addTable: (table: Omit<Table, 'id'>) => void;
  removeTable: (tableId: string) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  addZone: (zone: Omit<Zone, 'id' | 'tables'>) => void;
  removeZone: (zoneId: string) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;
  getTablesByZone: (zoneId: string) => Table[];
  getZoneById: (zoneId: string) => Zone | undefined;
}

const TableZoneContext = createContext<TableZoneContextType | undefined>(undefined);

export const TableZoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 'A1', zoneId: 'zone-a', capacity: 2, status: 'available' },
    { id: '2', number: 'A2', zoneId: 'zone-a', capacity: 4, status: 'occupied' },
    { id: '3', number: 'A3', zoneId: 'zone-a', capacity: 6, status: 'available' },
    { id: '4', number: 'A4', zoneId: 'zone-a', capacity: 8, status: 'reserved' },
    { id: '5', number: 'B1', zoneId: 'zone-b', capacity: 2, status: 'available' },
    { id: '6', number: 'B2', zoneId: 'zone-b', capacity: 4, status: 'occupied' },
    { id: '7', number: 'B3', zoneId: 'zone-b', capacity: 6, status: 'available' },
    { id: '8', number: 'B4', zoneId: 'zone-b', capacity: 8, status: 'maintenance' },
    { id: '9', number: 'C1', zoneId: 'zone-c', capacity: 2, status: 'available' },
    { id: '10', number: 'C2', zoneId: 'zone-c', capacity: 4, status: 'occupied' },
    { id: '11', number: 'C3', zoneId: 'zone-c', capacity: 6, status: 'available' },
    { id: '12', number: 'C4', zoneId: 'zone-c', capacity: 8, status: 'reserved' },
  ]);

  const [zones, setZones] = useState<Zone[]>([
    { id: 'zone-a', name: 'Zone A', description: 'Main dining area', color: '#06b6d4', tables: ['1', '2', '3', '4'] },
    { id: 'zone-b', name: 'Zone B', description: 'Window seating', color: '#3b82f6', tables: ['5', '6', '7', '8'] },
    { id: 'zone-c', name: 'Zone C', description: 'Private dining', color: '#10b981', tables: ['9', '10', '11', '12'] },
  ]);

  const addTable = (table: Omit<Table, 'id'>) => {
    const newId = (tables.length + 1).toString();
    const newTable = { ...table, id: newId };
    setTables(prev => [...prev, newTable]);
    
    // Update zone's tables array
    setZones(prev => prev.map(zone => 
      zone.id === table.zoneId 
        ? { ...zone, tables: [...zone.tables, newId] }
        : zone
    ));
  };

  const removeTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    
    // Remove table from zone's tables array
    setZones(prev => prev.map(zone => ({
      ...zone,
      tables: zone.tables.filter(id => id !== tableId)
    })));
  };

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, ...updates } : table
    ));
  };

  const addZone = (zone: Omit<Zone, 'id' | 'tables'>) => {
    const newId = `zone-${zones.length + 1}`;
    const newZone = { ...zone, id: newId, tables: [] };
    setZones(prev => [...prev, newZone]);
  };

  const removeZone = (zoneId: string) => {
    // Remove all tables in this zone
    const zoneTables = zones.find(z => z.id === zoneId)?.tables || [];
    setTables(prev => prev.filter(table => !zoneTables.includes(table.id)));
    
    // Remove the zone
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const updateZone = (zoneId: string, updates: Partial<Zone>) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, ...updates } : zone
    ));
  };

  const getTablesByZone = (zoneId: string) => {
    return tables.filter(table => table.zoneId === zoneId);
  };

  const getZoneById = (zoneId: string) => {
    return zones.find(zone => zone.id === zoneId);
  };

  return (
    <TableZoneContext.Provider value={{
      tables,
      zones,
      addTable,
      removeTable,
      updateTable,
      addZone,
      removeZone,
      updateZone,
      getTablesByZone,
      getZoneById
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
