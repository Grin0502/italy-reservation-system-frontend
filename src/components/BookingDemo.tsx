import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useTableZone } from '../contexts/TableZoneContext';
import { 
  calculateNextAvailableTime, 
  isTableAvailable, 
  formatTimeMargin,
  type TableBooking 
} from '../utils/bookingUtils';

const BookingDemo: React.FC = () => {
  const { bookingRules, restaurantInfo } = useRestaurant();
  const { tables } = useTableZone();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingDuration, setBookingDuration] = useState<number>(60);
  const [existingBookings, setExistingBookings] = useState<TableBooking[]>([
    {
      id: '1',
      tableId: '1',
      startTime: new Date('2024-01-15T18:00:00'),
      endTime: new Date('2024-01-15T20:00:00'),
      customerName: 'John Doe',
      partySize: 4
    }
  ]);

  const handleAddBooking = () => {
    if (!selectedTable || !selectedDate || !selectedTime) return;

    const startTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + bookingDuration);

    // Check if table is available
    const tableBookings = existingBookings.filter(b => b.tableId === selectedTable);
    const available = isTableAvailable(startTime, endTime, tableBookings, bookingRules);

    if (available) {
      const newBooking: TableBooking = {
        id: Date.now().toString(),
        tableId: selectedTable,
        startTime,
        endTime,
        customerName: 'New Customer',
        partySize: 2
      };
      setExistingBookings([...existingBookings, newBooking]);
      alert('Booking added successfully!');
    } else {
      alert('Table is not available for this time slot!');
    }
  };

  const getTableAvailability = (tableId: string) => {
    const tableBookings = existingBookings.filter(b => b.tableId === tableId);
    return tableBookings.map(booking => {
      const nextAvailable = calculateNextAvailableTime(booking.endTime, bookingRules);
      return {
        booking,
        nextAvailable,
        marginApplied: formatTimeMargin(bookingRules.bookingTimeMargin)
      };
    });
  };

  return (
    <Container>
      <SectionHeader>
        <h3>Booking Time Margin Demo</h3>
        <p>See how the booking time margin affects table availability</p>
      </SectionHeader>

      <DemoSection>
        <CurrentSettings>
          <h4>Current Settings</h4>
          <SettingItem>
            <Label>Booking Time Margin:</Label>
            <Value>{formatTimeMargin(bookingRules.bookingTimeMargin)}</Value>
          </SettingItem>
          <SettingItem>
            <Label>Opening Hours:</Label>
            <Value>{restaurantInfo.openingHours}</Value>
          </SettingItem>
        </CurrentSettings>

        <BookingForm>
          <h4>Add New Booking</h4>
          <FormGrid>
            <FormGroup>
              <Label>Select Table:</Label>
              <Select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                <option value="">Choose a table</option>
                {tables.map(table => (
                  <option key={table.id} value={table.id}>
                    Table {table.number} ({table.capacity} seats)
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Date:</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Time:</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Duration (minutes):</Label>
              <Input
                type="number"
                value={bookingDuration}
                onChange={(e) => setBookingDuration(parseInt(e.target.value))}
                min="30"
                max="240"
                step="30"
              />
            </FormGroup>
          </FormGrid>

          <AddButton onClick={handleAddBooking}>Add Booking</AddButton>
        </BookingForm>
      </DemoSection>

      <BookingsSection>
        <h4>Current Bookings & Availability</h4>
        {tables.map(table => {
          const availability = getTableAvailability(table.id);
          return (
            <TableCard key={table.id}>
              <TableHeader>
                <h5>Table {table.number} ({table.capacity} seats)</h5>
              </TableHeader>
              
              {availability.length > 0 ? (
                <BookingList>
                  {availability.map(({ booking, nextAvailable, marginApplied }) => (
                    <BookingItem key={booking.id}>
                      <BookingTime>
                        <strong>Booking:</strong> {booking.startTime.toLocaleTimeString()} - {booking.endTime.toLocaleTimeString()}
                      </BookingTime>
                      <MarginInfo>
                        <strong>Time Margin Applied:</strong> {marginApplied}
                      </MarginInfo>
                      <NextAvailable>
                        <strong>Next Available:</strong> {nextAvailable.toLocaleTimeString()}
                      </NextAvailable>
                    </BookingItem>
                  ))}
                </BookingList>
              ) : (
                <NoBookings>No bookings for this table</NoBookings>
              )}
            </TableCard>
          );
        })}
      </BookingsSection>

      <InfoBox>
        <InfoTitle>How It Works</InfoTitle>
        <InfoText>
          When a booking ends, the table remains unavailable for the specified time margin. 
          This prevents overlapping reservations and allows time for cleanup and preparation.
        </InfoText>
        <InfoExample>
          <strong>Example:</strong> If a table is booked until 8:00 PM with a {formatTimeMargin(bookingRules.bookingTimeMargin)} margin, 
          the next available booking slot would be {calculateNextAvailableTime(new Date('2024-01-15T20:00:00'), bookingRules).toLocaleTimeString()}.
        </InfoExample>
      </InfoBox>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const DemoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CurrentSettings = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Value = styled.span`
  color: #06b6d4;
  font-weight: 600;
  font-size: 0.875rem;
`;

const BookingForm = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
  }
`;

const AddButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0891b2;
  }
`;

const BookingsSection = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }
`;

const TableCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f1f5f9;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

const BookingList = styled.div`
  padding: 1rem;
`;

const BookingItem = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BookingTime = styled.div`
  color: #1e293b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const MarginInfo = styled.div`
  color: #06b6d4;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const NextAvailable = styled.div`
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
`;

const NoBookings = styled.div`
  padding: 1rem;
  color: #6b7280;
  font-style: italic;
  text-align: center;
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1.5rem;
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 0.75rem;
`;

const InfoText = styled.p`
  color: #0369a1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const InfoExample = styled.div`
  color: #0369a1;
  font-size: 0.875rem;
  background: rgba(186, 230, 253, 0.3);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #0ea5e9;
`;

export default BookingDemo;
