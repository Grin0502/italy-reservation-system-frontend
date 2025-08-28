import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useUser } from '../contexts/UserContext';

const NotificationSettings: React.FC = () => {
  const { notificationSettings, updateNotificationSettings, loading, error } = useRestaurant();
  const { hasPermission } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const canEdit = hasPermission('manage_notifications');

  const handleToggle = async (setting: keyof typeof notificationSettings) => {
    if (!canEdit || isUpdating) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      await updateNotificationSettings({
        [setting]: !notificationSettings[setting]
      });
      
      setUpdateSuccess(true);
      // Clear success message after 2 seconds
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update notification settings');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading notification settings...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeader>
        <div>
          <h3>Notification Preferences</h3>
          <p>Configure how you receive notifications and alerts</p>
        </div>
      </SectionHeader>

      {(error || updateError) && (
        <ErrorMessage>
          {error || updateError}
        </ErrorMessage>
      )}

      {updateSuccess && (
        <SuccessMessage>
          Notification settings updated successfully!
        </SuccessMessage>
      )}

      <NotificationOptions>
        <NotificationOption>
          <div>
            <h4>Email Notifications</h4>
            <p>Receive booking confirmations and updates via email</p>
          </div>
          <ToggleSwitch
            checked={notificationSettings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            disabled={!canEdit || isUpdating}
          />
        </NotificationOption>
        
        <NotificationOption>
          <div>
            <h4>SMS Notifications</h4>
            <p>Get instant SMS alerts for new bookings</p>
          </div>
          <ToggleSwitch
            checked={notificationSettings.smsNotifications}
            onChange={() => handleToggle('smsNotifications')}
            disabled={!canEdit || isUpdating}
          />
        </NotificationOption>
        
        <NotificationOption>
          <div>
            <h4>Push Notifications</h4>
            <p>Real-time push notifications on your device</p>
          </div>
          <ToggleSwitch
            checked={notificationSettings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
            disabled={!canEdit || isUpdating}
          />
        </NotificationOption>
      </NotificationOptions>

      {isUpdating && (
        <UpdatingMessage>
          Updating notification settings...
        </UpdatingMessage>
      )}

      {!canEdit && (
        <AccessNote>
          <InfoIcon>ℹ️</InfoIcon>
          <span>Only managers can modify notification settings. You can view the current configuration.</span>
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #dc2626;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #16a34a;
  font-size: 0.875rem;
`;

const UpdatingMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #06b6d4;
  font-size: 0.875rem;
  font-style: italic;
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

const NotificationOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NotificationOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f9fafb;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 48px;
  height: 24px;
  background: ${props => props.disabled ? '#e5e7eb' : (props.checked ? '#06b6d4' : '#d1d5db')};
  border-radius: 12px;
  position: relative;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  
  &:checked {
    background: ${props => props.disabled ? '#e5e7eb' : '#06b6d4'};
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
  
  &:disabled {
    opacity: 0.6;
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

export default NotificationSettings;
