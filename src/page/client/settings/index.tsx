import styled from "styled-components";
import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('restaurant');

  const tabs = [
    { id: 'restaurant', label: 'Restaurant Details' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'booking-rules', label: 'Booking Rules' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <SettingsContainer>
      <PageHeader>
        <h1>Settings</h1>
        <p>Manage your restaurant preferences and account settings</p>
      </PageHeader>

      <SettingsContent>
        <TabsContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsContainer>

        <TabContent>
          {activeTab === 'restaurant' && (
            <RestaurantDetails>
              <SectionCard>
                <SectionHeader>
                  <h3>Restaurant Information</h3>
                </SectionHeader>
                
                <FormGrid>
                  <FormGroup>
                    <Label>Restaurant Name</Label>
                    <Input type="text" defaultValue="Ristorante Bella Vista" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input type="tel" defaultValue="+39 123 456 789" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Email Address</Label>
                    <Input type="email" defaultValue="info@bella-vista.it" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Address</Label>
                    <Input type="text" defaultValue="Via Roma 123, Milano, Italy" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Capacity</Label>
                    <Input type="number" defaultValue="120" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Opening Hours</Label>
                    <Input type="text" defaultValue="12:00 - 23:00" />
                  </FormGroup>
                </FormGrid>
              </SectionCard>
            </RestaurantDetails>
          )}

          {activeTab === 'notifications' && (
            <NotificationsSettings>
              <SectionCard>
                <SectionHeader>
                  <h3>Notification Preferences</h3>
                </SectionHeader>
                
                <NotificationOptions>
                  <NotificationOption>
                    <div>
                      <h4>Email Notifications</h4>
                      <p>Receive booking confirmations and updates via email</p>
                    </div>
                    <ToggleSwitch defaultChecked />
                  </NotificationOption>
                  
                  <NotificationOption>
                    <div>
                      <h4>SMS Notifications</h4>
                      <p>Get instant SMS alerts for new bookings</p>
                    </div>
                    <ToggleSwitch />
                  </NotificationOption>
                  
                  <NotificationOption>
                    <div>
                      <h4>Push Notifications</h4>
                      <p>Real-time push notifications on your device</p>
                    </div>
                    <ToggleSwitch defaultChecked />
                  </NotificationOption>
                </NotificationOptions>
              </SectionCard>
            </NotificationsSettings>
          )}

          {activeTab === 'booking-rules' && (
            <BookingRules>
              <SectionCard>
                <SectionHeader>
                  <h3>Booking Rules & Policies</h3>
                </SectionHeader>
                
                <FormGrid>
                  <FormGroup>
                    <Label>Maximum Party Size</Label>
                    <Input type="number" defaultValue="12" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Advance Booking Limit (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Cancellation Policy (hours)</Label>
                    <Input type="number" defaultValue="24" />
                  </FormGroup>
                </FormGrid>
              </SectionCard>
            </BookingRules>
          )}

          {activeTab === 'account' && (
            <AccountSettings>
              <SectionCard>
                <SectionHeader>
                  <h3>Account Information</h3>
                </SectionHeader>
                
                <FormGrid>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input type="text" defaultValue="Marco Rossi" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" defaultValue="marco@bella-vista.it" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue="+39 123 456 789" />
                  </FormGroup>
                </FormGrid>
              </SectionCard>
            </AccountSettings>
          )}
        </TabContent>
      </SettingsContent>

      <SupportButton>
        Open Support Ticket
      </SupportButton>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
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

const SettingsContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 1rem 1.5rem;
  background: ${props => props.isActive ? '#06b6d4' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#64748b'};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? '#0891b2' : '#f8fafc'};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const SectionCard = styled.div``;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
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
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  
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
  background: #d1d5db;
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

const SupportButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    background: #0891b2;
    transform: translateY(-2px);
  }
`;

// Missing styled components
const RestaurantDetails = styled.div``;
const NotificationsSettings = styled.div``;
const BookingRules = styled.div``;
const AccountSettings = styled.div``;

export default SettingsPage;
