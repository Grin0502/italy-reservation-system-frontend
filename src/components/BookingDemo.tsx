import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurant } from '../contexts/RestaurantContext';
import api from '../services/api';

interface BookingFormData {
  guestCount: number;
  date: string;
  time: string;
  phoneNumber: string;
  username: string;
}

interface AvailableTable {
  tableId: string;
  tableNumber: number;
  capacity: number;
  zoneName: string;
  efficiency: number;
  isSuitable: boolean;
  suitabilityNote: string;
}

const BookingDemo: React.FC = () => {
  const { bookingRules, restaurantInfo } = useRestaurant();
  
  const [formData, setFormData] = useState<BookingFormData>({
    guestCount: 2,
    date: '',
    time: '',
    phoneNumber: '',
    username: ''
  });
  
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.time || !formData.phoneNumber || !formData.username) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsCheckingAvailability(true);
    setMessage(null);

    try {
      const response = await api.bookingDemo.checkAvailability(formData);
      console.log("[DEBUG] response from check availability:", response.data);

      if (response.data) {
        const tables = response.data.availableTables;
        setAvailableTables(tables);
        
        // Automatically select the optimal table combination
        const optimalTables = findOptimalTableCombination(tables, formData.guestCount);
        
        if (optimalTables) {
          setSelectedTables(optimalTables);
          setMessage({ type: 'success', text: 'Available tables found and automatically selected!' });
        } else {
          setSelectedTables([]);
          setMessage({ 
            type: 'error', 
            text: `No combination of available tables can accommodate ${formData.guestCount} guests. Please try a different time or date.` 
          });
        }
      } else {
        setMessage({ type: 'error', text: response.data.error || 'Failed to check availability' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to check availability';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const createBooking = async () => {
    if (selectedTables.length === 0) {
      setMessage({ type: 'error', text: 'No tables selected for booking' });
      return;
    }

    // Calculate total capacity of selected tables
    const selectedTableData = availableTables.filter(table => selectedTables.includes(table.tableId));
    const totalCapacity = selectedTableData.reduce((sum, table) => sum + table.capacity, 0);
    
    if (totalCapacity < formData.guestCount) {
      setMessage({ 
        type: 'error', 
        text: `Selected tables can only accommodate ${totalCapacity} guests, but you have ${formData.guestCount} guests. Please try a different time or date.` 
      });
      return;
    }

    setIsCreatingBooking(true);
    setMessage(null);

    try {
      // Create bookings for all selected tables
      const bookingPromises = selectedTables.map(tableId => 
        api.bookingDemo.createBooking({
          ...formData,
          tableId: tableId
        })
      );
      
      const responses = await Promise.all(bookingPromises);
      const allSuccessful = responses.every(response => response.data.success);
      
      if (allSuccessful) {
        const tableNames = selectedTableData.map(table => `Table ${table.tableNumber}`).join(', ');
        setMessage({ 
          type: 'success', 
          text: `Booking created successfully for ${tableNames}!` 
        });
        // Reset form
        setFormData({
          guestCount: 2,
          date: '',
          time: '',
          phoneNumber: '',
          username: ''
        });
        setSelectedTables([]);
        setAvailableTables([]);
      } else {
        const failedResponses = responses.filter(response => !response.data.success);
        const errorMessages = failedResponses.map(response => response.data.error).join(', ');
        setMessage({ type: 'error', text: `Failed to create some bookings: ${errorMessages}` });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create booking';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    const [openHour] = restaurantInfo.openingHours.split(' - ')[0].split(':').map(Number);
    const [closeHour] = restaurantInfo.openingHours.split(' - ')[1].split(':').map(Number);
    
    for (let hour = openHour; hour < closeHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  // Algorithm to find the best combination of tables for the guest count
  const findOptimalTableCombination = (tables: AvailableTable[], guestCount: number) => {
    // Sort tables by efficiency (least wasted seats first)
    const sortedTables = [...tables].sort((a, b) => a.efficiency - b.efficiency);
    
    // First, try to find a single table that can accommodate all guests
    const singleTable = sortedTables.find(table => table.isSuitable);
    if (singleTable) {
      return [singleTable.tableId];
    }
    
    // If no single table is suitable, find the best combination
    // Use a greedy approach: start with the most efficient tables
    let selectedTableIds: string[] = [];
    let totalCapacity = 0;
    
    for (const table of sortedTables) {
      if (totalCapacity >= guestCount) break;
      
      selectedTableIds.push(table.tableId);
      totalCapacity += table.capacity;
    }
    
    // Check if we have enough capacity
    if (totalCapacity < guestCount) {
      return null; // No combination can accommodate the guests
    }
    
    return selectedTableIds;
  };

  return (
    <Container>
      <Header>
        <h2>Book a Table</h2>
        <p>Make a reservation at {restaurantInfo.name}</p>
      </Header>

      <BookingForm>
        <FormSection>
          <h3>Booking Details</h3>
          
          <FormGrid>
            <FormGroup>
              <Label>Number of Guests *</Label>
              <Select
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <FormGroup>
              <Label>Time *</Label>
              <Select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              >
                <option value="">Select time</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+1234567890"
              />
            </FormGroup>

            <FormGroup>
              <Label>Username *</Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your name"
              />
            </FormGroup>
          </FormGrid>

          <CheckAvailabilityButton 
            onClick={checkAvailability}
            disabled={isCheckingAvailability}
          >
            {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
          </CheckAvailabilityButton>
        </FormSection>

        {message && (
          <MessageBox type={message.type}>
            {message.text}
          </MessageBox>
        )}

        {availableTables.length > 0 && (
          <TableSelection>
            <h3>Available Tables</h3>
                         <TableGrid>
               {availableTables.map(table => (
                 <TableCard 
                   key={table.tableId}
                   selected={selectedTables.includes(table.tableId)}
                   suitable={table.isSuitable}
                 >
                   <TableNumber>Table {table.tableNumber}</TableNumber>
                   <TableInfo>
                     <span>Capacity: {table.capacity} guests</span>
                     <span>Zone: {table.zoneName}</span>
                     <SuitabilityBadge suitable={table.isSuitable}>
                       {table.isSuitable ? '✓ Suitable' : '⚠ Too Small'}
                     </SuitabilityBadge>
                     {selectedTables.includes(table.tableId) && (
                       <SelectionBadge>✓ Selected</SelectionBadge>
                     )}
                     {!table.isSuitable && (
                       <SuitabilityNote>{table.suitabilityNote}</SuitabilityNote>
                     )}
                   </TableInfo>
                 </TableCard>
               ))}
             </TableGrid>

             {selectedTables.length > 0 && (
               <SelectionSummary>
                 <h4>Selected Tables:</h4>
                 <p>
                   {selectedTables.map(tableId => {
                     const table = availableTables.find(t => t.tableId === tableId);
                     return table ? `Table ${table.tableNumber} (${table.capacity} seats)` : '';
                   }).join(', ')}
                 </p>
                 <p><strong>Total Capacity:</strong> {
                   availableTables
                     .filter(table => selectedTables.includes(table.tableId))
                     .reduce((sum, table) => sum + table.capacity, 0)
                 } guests</p>
               </SelectionSummary>
             )}

             <CreateBookingButton 
               onClick={createBooking}
               disabled={isCreatingBooking || selectedTables.length === 0}
             >
               {isCreatingBooking ? 'Creating...' : 'Confirm Booking'}
             </CreateBookingButton>
          </TableSelection>
        )}
      </BookingForm>

      <InfoSection>
        <h3>Restaurant Information</h3>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Opening Hours:</InfoLabel>
            <InfoValue>{restaurantInfo.openingHours}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Booking Time Margin:</InfoLabel>
            <InfoValue>{bookingRules.bookingTimeMargin} minutes</InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

const BookingForm = styled.div`
  margin-bottom: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  font-size: 1rem;
  transition: border-color 0.2s;
  
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
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const CheckAvailabilityButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover:not(:disabled) {
    background: #0891b2;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const MessageBox = styled.div<{ type: 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
  
  ${props => props.type === 'success' ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  `}
`;

const TableSelection = styled.div`
  margin-top: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TableCard = styled.div<{ selected: boolean; suitable: boolean }>`
  border: 2px solid ${props => {
    if (props.selected) return '#06b6d4';
    if (!props.suitable) return '#ef4444';
    return '#e2e8f0';
  }};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => {
    if (props.selected) return '#f0f9ff';
    if (!props.suitable) return '#fef2f2';
    return 'white';
  }};
  opacity: ${props => props.suitable ? 1 : 0.7};
  
  &:hover {
    border-color: ${props => props.suitable ? '#06b6d4' : '#ef4444'};
    background: ${props => props.suitable ? '#f0f9ff' : '#fef2f2'};
  }
`;

const TableNumber = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const TableInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const SuitabilityBadge = styled.span<{ suitable: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.suitable ? '#dcfce7' : '#fef2f2'};
  color: ${props => props.suitable ? '#166534' : '#dc2626'};
  border: 1px solid ${props => props.suitable ? '#bbf7d0' : '#fecaca'};
`;

const SuitabilityNote = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
  font-style: italic;
`;

const SelectionBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
`;

const SelectionSummary = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #0369a1;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CreateBookingButton = styled.button`
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover:not(:disabled) {
    background: #047857;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const InfoSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: #06b6d4;
  font-weight: 600;
  font-size: 0.875rem;
`;

export default BookingDemo;
