import React, { useState } from 'react';
import styled from 'styled-components';

import type { Table } from '../contexts/TableZoneContext';

import { useTableZone } from '../contexts/TableZoneContext';
import { useUser } from '../contexts/UserContext';

interface TableFormData {
  number: string;
  zoneId: string;
  isActive?: boolean;
}

const TableManagement: React.FC = () => {
  const { tables, zones, addTable, removeTable, updateTable, loading, error } = useTableZone();
  const { hasPermission } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [movingTable, setMovingTable] = useState<string | null>(null); // tableId or null
  const [targetZoneId, setTargetZoneId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TableFormData>({
    number: '',
    zoneId: ''
  });

  const canManageTables = hasPermission('manage_tables');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTable) {
        await updateTable(editingTable._id, formData);
        setEditingTable(null);
      } else {
        await addTable({ ...formData, isActive: true });
      }
      setFormData({ number: '', zoneId: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving table:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveTable = async (tableId: string) => {
    if (targetZoneId) {
      setIsSubmitting(true);
      try {
        await updateTable(tableId, { zoneId: targetZoneId });
        setMovingTable(null);
        setTargetZoneId('');
      } catch (err) {
        console.error('Error moving table:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    // Handle both populated zoneId (object) and non-populated zoneId (string)
    let zoneId: string;
    if (typeof table.zoneId === 'object' && table.zoneId !== null) {
      zoneId = table.zoneId._id;
    } else {
      zoneId = table.zoneId as string;
    }
    setFormData({
      number: table.number,
      zoneId: zoneId
    });
  };

  const handleCancel = () => {
    setEditingTable(null);
    setShowAddForm(false);
    setFormData({ number: '', zoneId: '' });
  };

  const handleMoveCancel = () => {
    setMovingTable(null);
    setTargetZoneId('');
  };

  const handleDelete = async (tableId: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      try {
        await removeTable(tableId);
      } catch (err) {
        console.error('Error deleting table:', err);
      }
    }
  };

  const getUnassignedTables = () => {
    return tables.filter(table => {
      // Handle both populated zoneId (object) and non-populated zoneId (string)
      if (typeof table.zoneId === 'object' && table.zoneId !== null) {
        return false; // If it's an object, it's assigned to a zone
      }
      return !table.zoneId || (table.zoneId as string) === '';
    });
  };

  const assignTableToZone = async (tableId: string, zoneId: string) => {
    try {
      await updateTable(tableId, { zoneId });
    } catch (err) {
      console.error('Error assigning table to zone:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading tables...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3>Table Management</h3>
        {canManageTables && (
          <AddButton onClick={() => setShowAddForm(true)}>
            + Add Table
          </AddButton>
        )}
      </Header>

      {error && (
        <ErrorMessage>
          Error: {error}
        </ErrorMessage>
      )}

             {/* Unassigned Tables Section */}
       {canManageTables && getUnassignedTables().length > 0 && (
        <UnassignedSection>
          <UnassignedHeader>
            <h4>Unassigned Tables</h4>
            <span>{getUnassignedTables().length} tables</span>
          </UnassignedHeader>
          <UnassignedGrid>
            {getUnassignedTables().map(table => (
              <UnassignedTableCard key={table._id}>
                <TableInfo>
                  <TableNumber>{table.number}</TableNumber>
                  <span>Unassigned</span>
                </TableInfo>
                <UnassignedAssignActions>
                  <UnassignedAssignSelect
                    value=""
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      if (e.target.value) {
                        assignTableToZone(table._id, e.target.value);
                      }
                    }}
                  >
                    <option value="">Assign to zone...</option>
                    {zones.map(zone => (
                      <option key={zone._id} value={zone._id}>
                        {zone.name}
                      </option>
                    ))}
                  </UnassignedAssignSelect>
                </UnassignedAssignActions>
              </UnassignedTableCard>
            ))}
          </UnassignedGrid>
        </UnassignedSection>
      )}

             {canManageTables && (showAddForm || editingTable) && (
        <FormOverlay>
          <FormCard>
            <FormHeader>
              <h4>{editingTable ? 'Edit Table' : 'Add New Table'}</h4>
              <CloseButton onClick={handleCancel}>×</CloseButton>
            </FormHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Table Number</Label>
                <Input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., A1, B2"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Zone</Label>
                <Select
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                >
                  <option value="">No zone (unassigned)</option>
                  {zones.map(zone => (
                    <option key={zone._id} value={zone._id}>
                      {zone.name} ({zone.seatsPerTable} seats/table)
                    </option>
                  ))}
                </Select>
                <FormNote>Note: Table capacity is managed at the zone level. Select a zone to inherit its seating configuration.</FormNote>
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingTable ? 'Update' : 'Add') + ' Table'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </FormCard>
        </FormOverlay>
      )}

             {canManageTables && movingTable && (
        <FormOverlay>
          <FormCard>
            <FormHeader>
              <h4>Move Table to Zone</h4>
              <CloseButton onClick={handleMoveCancel}>×</CloseButton>
            </FormHeader>
            <Form onSubmit={(e) => { e.preventDefault(); handleMoveTable(movingTable); }}>
              <FormGroup>
                <Label>Select Target Zone</Label>
                <Select
                  value={targetZoneId}
                  onChange={(e) => setTargetZoneId(e.target.value)}
                  required
                >
                  <option value="">Select a zone</option>
                  {zones.map(zone => (
                    <option key={zone._id} value={zone._id}>
                      {zone.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleMoveCancel} disabled={isSubmitting}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={!targetZoneId || isSubmitting}>
                  {isSubmitting ? 'Moving...' : 'Move Table'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </FormCard>
        </FormOverlay>
      )}

      <TableGrid>
        {tables.map(table => {
          // Handle both populated zoneId (object) and non-populated zoneId (string)
          let zoneId: string;
          let zoneName: string;
          let zoneSeatsPerTable: number = 0;
          if (typeof table.zoneId === 'object' && table.zoneId !== null) {
            zoneId = table.zoneId._id;
            zoneName = table.zoneId.name;
            // For populated objects, we need to find the zone to get seatsPerTable
            const zone = zones.find(z => z._id === zoneId);
            zoneSeatsPerTable = zone?.seatsPerTable || 0;
          } else {
            zoneId = table.zoneId as string;
            const zone = zones.find(z => z._id === zoneId);
            zoneName = zone?.name || 'Unassigned';
            zoneSeatsPerTable = zone?.seatsPerTable || 0;
          }
          return (
            <TableCard key={table._id}>
              <TableHeader>
                <TableNumber>{table.number}</TableNumber>
              </TableHeader>
              <TableInfo>
                <InfoItem>
                  <Label>Zone:</Label>
                  <span>{zoneName}</span>
                </InfoItem>
                <InfoItem>
                  <Label>Capacity:</Label>
                  <span>{zoneName !== 'Unassigned' ? `${zoneSeatsPerTable} seats` : 'Unassigned'}</span>
                </InfoItem>
              </TableInfo>
                             {canManageTables && (
                 <TableActions>
                   <MoveButton onClick={() => setMovingTable(table._id)}>
                     Move
                   </MoveButton>
                   <EditButton onClick={() => handleEdit(table)}>
                     Edit
                   </EditButton>
                   <DeleteButton onClick={() => handleDelete(table._id)}>
                     Delete
                   </DeleteButton>
                 </TableActions>
               )}
            </TableCard>
          );
        })}
      </TableGrid>
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

const FormNote = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  font-style: italic;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
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

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const TableCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const TableNumber = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
  color: #1e293b;
`;

const TableInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  
  span {
    color: #6b7280;
  }
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MoveButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background: #d97706;
  }
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  flex: 1;
  
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
  flex: 1;
  
  &:hover {
    background: #dc2626;
  }
`;

const UnassignedSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 8px;
`;

const UnassignedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #22c55e;
  }
  
  span {
    font-size: 0.875rem;
    color: #4b5563;
  }
`;

const UnassignedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
`;

const UnassignedTableCard = styled.div`
  border: 1px solid #d1fae5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UnassignedAssignActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const UnassignedAssignSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ef4444;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export default TableManagement;
