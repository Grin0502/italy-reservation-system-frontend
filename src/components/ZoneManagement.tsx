import React, { useState } from 'react';
import styled from 'styled-components';

import type { Zone } from '../contexts/TableZoneContext';

import { useTableZone } from '../contexts/TableZoneContext';
import { useUser } from '../contexts/UserContext';

interface ZoneFormData {
  name: string;
  description: string;
  color: string;
}

const ZoneManagement: React.FC = () => {
  const { zones, tables, addZone, removeZone, updateZone, getTablesByZone } = useTableZone();
  const { hasPermission } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<ZoneFormData>({
    name: '',
    description: '',
    color: '#06b6d4'
  });

  if (!hasPermission('manage_zones')) {
    return (
      <AccessDenied>
        <h3>Access Denied</h3>
        <p>You don't have permission to manage zones.</p>
      </AccessDenied>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateZone(editingZone.id, formData);
      setEditingZone(null);
    } else {
      addZone(formData);
    }
    setFormData({ name: '', description: '', color: '#06b6d4' });
    setShowAddForm(false);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description || '',
      color: zone.color
    });
  };

  const handleCancel = () => {
    setEditingZone(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '', color: '#06b6d4' });
  };

  const handleDelete = (zoneId: string) => {
    const zoneTables = getTablesByZone(zoneId);
    if (zoneTables.length > 0) {
      if (!confirm(`This zone has ${zoneTables.length} tables. Deleting it will also remove all tables in this zone. Are you sure?`)) {
        return;
      }
    }
    removeZone(zoneId);
  };

  const getZoneStats = (zoneId: string) => {
    const zoneTables = getTablesByZone(zoneId);
    const totalTables = zoneTables.length;
    const availableTables = zoneTables.filter(t => t.status === 'available').length;
    const occupiedTables = zoneTables.filter(t => t.status === 'occupied').length;
    const totalCapacity = zoneTables.reduce((sum, table) => sum + table.capacity, 0);
    
    return { totalTables, availableTables, occupiedTables, totalCapacity };
  };

  return (
    <Container>
      <Header>
        <h3>Zone Management</h3>
        <AddButton onClick={() => setShowAddForm(true)}>
          + Add Zone
        </AddButton>
      </Header>

      {(showAddForm || editingZone) && (
        <FormOverlay>
          <FormCard>
            <FormHeader>
              <h4>{editingZone ? 'Edit Zone' : 'Add New Zone'}</h4>
              <CloseButton onClick={handleCancel}>×</CloseButton>
            </FormHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Zone Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Dining, Window Seating"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the zone"
                  rows={3}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Color</Label>
                <ColorInput
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingZone ? 'Update' : 'Add'} Zone
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </FormCard>
        </FormOverlay>
      )}

      <ZoneGrid>
        {zones.map(zone => {
          const stats = getZoneStats(zone.id);
          return (
            <ZoneCard key={zone.id}>
              <ZoneHeader>
                <ZoneInfo>
                  <ZoneName>{zone.name}</ZoneName>
                  <ZoneColor color={zone.color} />
                </ZoneInfo>
                <ZoneActions>
                  <EditButton onClick={() => handleEdit(zone)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(zone.id)}>
                    Delete
                  </DeleteButton>
                </ZoneActions>
              </ZoneHeader>
              
              {zone.description && (
                <ZoneDescription>{zone.description}</ZoneDescription>
              )}
              
              <ZoneStats>
                <StatItem>
                  <StatLabel>Total Tables</StatLabel>
                  <StatValue>{stats.totalTables}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Available</StatLabel>
                  <StatValue available>{stats.availableTables}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Occupied</StatLabel>
                  <StatValue occupied>{stats.occupiedTables}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Total Capacity</StatLabel>
                  <StatValue>{stats.totalCapacity} seats</StatValue>
                </StatItem>
              </ZoneStats>
              
              {stats.totalTables > 0 && (
                <ZoneTables>
                  <TableListTitle>Tables in this zone:</TableListTitle>
                  <TableList>
                    {getTablesByZone(zone.id).map(table => (
                      <TableItem key={table.id}>
                        <span>{table.number}</span>
                        <span>{table.capacity} seats</span>
                        <StatusBadge status={table.status}>
                          {table.status}
                        </StatusBadge>
                      </TableItem>
                    ))}
                  </TableList>
                </ZoneTables>
              )}
            </ZoneCard>
          );
        })}
      </ZoneGrid>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

const AddButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0891b2;
  }
`;

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  
  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const SubmitButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background: #0891b2;
  }
`;

const ZoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ZoneCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f9fafb;
`;

const ZoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ZoneInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ZoneName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ZoneColor = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ZoneActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background: #dc2626;
  }
`;

const ZoneDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ZoneStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div<{ available?: boolean; occupied?: boolean }>`
  font-weight: 600;
  color: ${props => {
    if (props.available) return '#10b981';
    if (props.occupied) return '#ef4444';
    return '#1e293b';
  }};
`;

const ZoneTables = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

const TableListTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const TableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TableItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.75rem;
  
  span:first-child {
    font-weight: 500;
  }
  
  span:nth-child(2) {
    color: #6b7280;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => {
    switch (props.status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'reserved': return '#f59e0b';
      case 'maintenance': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  
  h3 {
    margin-bottom: 0.5rem;
  }
`;

export default ZoneManagement;
