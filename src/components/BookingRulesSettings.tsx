import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useUser } from '../contexts/UserContext';
import { formatTimeMargin } from '../utils/bookingUtils';

const BookingRulesSettings: React.FC = () => {
  const { bookingRules, updateBookingRules } = useRestaurant();
  const { hasPermission } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(bookingRules);

  const canEdit = hasPermission('manage_booking_rules');

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(bookingRules);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(bookingRules);
  };

  const handleSave = () => {
    updateBookingRules(formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof bookingRules, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  return (
    <Container>
      <SectionHeader>
        <div>
          <h3>Booking Rules & Policies</h3>
          <p>Configure booking policies and operational rules</p>
        </div>
        {canEdit && (
          <ActionButtons>
            {isEditing ? (
              <>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <SaveButton onClick={handleSave}>Save Changes</SaveButton>
              </>
            ) : (
              <EditButton onClick={handleEdit}>Edit Rules</EditButton>
            )}
          </ActionButtons>
        )}
      </SectionHeader>

      <RulesGrid>
        <RuleCard>
          <RuleLabel>Maximum Party Size</RuleLabel>
          {isEditing ? (
            <Input
              type="number"
              value={formData.maxPartySize}
              onChange={(e) => handleInputChange('maxPartySize', parseInt(e.target.value))}
              min="1"
              max="50"
            />
          ) : (
            <RuleValue>{bookingRules.maxPartySize} people</RuleValue>
          )}
        </RuleCard>

        <RuleCard>
          <RuleLabel>Advance Booking Limit</RuleLabel>
          {isEditing ? (
            <Input
              type="number"
              value={formData.advanceBookingLimit}
              onChange={(e) => handleInputChange('advanceBookingLimit', parseInt(e.target.value))}
              min="1"
              max="365"
            />
          ) : (
            <RuleValue>{bookingRules.advanceBookingLimit} days</RuleValue>
          )}
        </RuleCard>

        <RuleCard>
          <RuleLabel>Cancellation Policy</RuleLabel>
          {isEditing ? (
            <Input
              type="number"
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange('cancellationPolicy', parseInt(e.target.value))}
              min="0"
              max="72"
            />
          ) : (
            <RuleValue>{bookingRules.cancellationPolicy} hours</RuleValue>
          )}
        </RuleCard>

        <RuleCard>
          <RuleLabel>Booking Time Margin</RuleLabel>
          {isEditing ? (
            <TimeMarginInput>
              <Input
                type="number"
                value={formData.bookingTimeMargin}
                onChange={(e) => handleInputChange('bookingTimeMargin', parseInt(e.target.value))}
                min="15"
                max="240"
                step="15"
              />
              <TimeUnit>minutes</TimeUnit>
            </TimeMarginInput>
          ) : (
            <RuleValue>
              {formatTimeMargin(bookingRules.bookingTimeMargin)}
              <TimeMarginNote>
                (Table remains unavailable after booking ends)
              </TimeMarginNote>
            </RuleValue>
          )}
        </RuleCard>

        <RuleCard>
          <RuleLabel>Deposit Required</RuleLabel>
          {isEditing ? (
            <ToggleSwitch
              checked={formData.depositRequired}
              onChange={(e) => handleInputChange('depositRequired', e.target.checked)}
            />
          ) : (
            <RuleValue>{bookingRules.depositRequired ? 'Yes' : 'No'}</RuleValue>
          )}
        </RuleCard>

        {bookingRules.depositRequired && (
          <RuleCard>
            <RuleLabel>Deposit Amount</RuleLabel>
            {isEditing ? (
              <Input
                type="number"
                value={formData.depositAmount || 0}
                onChange={(e) => handleInputChange('depositAmount', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            ) : (
              <RuleValue>€{bookingRules.depositAmount || 0}</RuleValue>
            )}
          </RuleCard>
        )}
      </RulesGrid>

      <InfoSection>
        <InfoTitle>About Booking Time Margin</InfoTitle>
        <InfoDescription>
          The booking time margin is the period after a booking ends during which the table remains unavailable for new bookings. 
          This allows time for table cleanup, preparation, and prevents overlapping reservations.
        </InfoDescription>
        <InfoExample>
          <strong>Example:</strong> If a table is booked until 8:00 PM with a 90-minute margin, 
          the next available booking slot would be 9:30 PM.
        </InfoExample>
      </InfoSection>

      {!canEdit && (
        <AccessNote>
          <InfoIcon>ℹ️</InfoIcon>
          <span>Only managers can modify booking rules. You can view the current policies.</span>
        </AccessNote>
      )}
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const EditButton = styled.button`
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0891b2;
  }
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const RuleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RuleLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const RuleValue = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.875rem;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const TimeMarginNote = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
`;

const TimeMarginInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeUnit = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  white-space: nowrap;
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

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 48px;
  height: 24px;
  background: ${props => props.checked ? '#06b6d4' : '#d1d5db'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:checked {
    background: #06b6d4;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
  
  &:checked::before {
    transform: translateX(24px);
  }
`;

const InfoSection = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 0.75rem;
`;

const InfoDescription = styled.p`
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

const AccessNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #0369a1;
  font-size: 0.875rem;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
`;

export default BookingRulesSettings;
