import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useUser } from '../contexts/UserContext';
import { useTableZone } from '../contexts/TableZoneContext';

const RestaurantInfoSettings: React.FC = () => {
  const { restaurantInfo, updateRestaurantInfo } = useRestaurant();
  const { hasPermission } = useUser();
  const { tables } = useTableZone();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(restaurantInfo);

  // Calculate total capacity from all tables
  const totalCapacity = tables.reduce((sum, table) => {
    const zoneId = typeof table.zoneId === 'object' ? table.zoneId._id : table.zoneId;
    const zone = useTableZone().zones.find(z => z._id === zoneId);
    return sum + (zone?.seatsPerTable || 0);
  }, 0);

  const canEdit = hasPermission('manage_restaurant_info');

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(restaurantInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(restaurantInfo);
  };

  const handleSave = () => {
    updateRestaurantInfo(formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof restaurantInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <SectionHeader>
        <div>
          <h3>Restaurant Information</h3>
          <p>Manage your restaurant's basic information and contact details</p>
        </div>
        {canEdit && (
          <ActionButtons>
            {isEditing ? (
              <>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <SaveButton onClick={handleSave}>Save Changes</SaveButton>
              </>
            ) : (
              <EditButton onClick={handleEdit}>Edit Information</EditButton>
            )}
          </ActionButtons>
        )}
      </SectionHeader>

      <InfoGrid>
        <InfoCard>
          <InfoLabel>Restaurant Name</InfoLabel>
          {isEditing ? (
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          ) : (
            <InfoValue>{restaurantInfo.name}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Phone Number</InfoLabel>
          {isEditing ? (
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          ) : (
            <InfoValue>{restaurantInfo.phone}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Email Address</InfoLabel>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          ) : (
            <InfoValue>{restaurantInfo.email}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Address</InfoLabel>
          {isEditing ? (
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          ) : (
            <InfoValue>{restaurantInfo.address}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Total Capacity</InfoLabel>
          <InfoValue>
            {totalCapacity} seats
            <CapacityNote>
              (Calculated from {tables.length} tables)
            </CapacityNote>
          </InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>Opening Hours</InfoLabel>
          {isEditing ? (
            <Input
              type="text"
              value={formData.openingHours}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
              placeholder="e.g., 12:00 - 23:00"
            />
          ) : (
            <InfoValue>{restaurantInfo.openingHours}</InfoValue>
          )}
        </InfoCard>

        <InfoCard fullWidth>
          <InfoLabel>Description</InfoLabel>
          {isEditing ? (
            <Textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your restaurant"
              rows={3}
            />
          ) : (
            <InfoValue>{restaurantInfo.description || 'No description provided'}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Website</InfoLabel>
          {isEditing ? (
            <Input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.your-restaurant.com"
            />
          ) : (
            <InfoValue>
              {restaurantInfo.website ? (
                <WebsiteLink href={restaurantInfo.website} target="_blank" rel="noopener noreferrer">
                  {restaurantInfo.website}
                </WebsiteLink>
              ) : (
                'No website provided'
              )}
            </InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Cuisine Type</InfoLabel>
          {isEditing ? (
            <Input
              type="text"
              value={formData.cuisine || ''}
              onChange={(e) => handleInputChange('cuisine', e.target.value)}
              placeholder="e.g., Italian, French, Asian"
            />
          ) : (
            <InfoValue>{restaurantInfo.cuisine || 'Not specified'}</InfoValue>
          )}
        </InfoCard>

        <InfoCard>
          <InfoLabel>Price Range</InfoLabel>
          {isEditing ? (
            <Select
              value={formData.priceRange || ''}
              onChange={(e) => handleInputChange('priceRange', e.target.value)}
            >
              <option value="">Select price range</option>
              <option value="€">€ (Inexpensive)</option>
              <option value="€€">€€ (Moderate)</option>
              <option value="€€€">€€€ (Expensive)</option>
              <option value="€€€€">€€€€ (Very Expensive)</option>
            </Select>
          ) : (
            <InfoValue>{restaurantInfo.priceRange || 'Not specified'}</InfoValue>
          )}
        </InfoCard>
      </InfoGrid>

      {!canEdit && (
        <AccessNote>
          <InfoIcon>ℹ️</InfoIcon>
          <span>Only managers can edit restaurant information. You can view the current settings.</span>
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const InfoLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const InfoValue = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.875rem;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
`;

const CapacityNote = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const WebsiteLink = styled.a`
  color: #06b6d4;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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

export default RestaurantInfoSettings;
