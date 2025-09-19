import styled from "styled-components";
import { useState } from "react";
import RestaurantInfoSettings from "../../../components/RestaurantInfoSettings";
import NotificationSettings from "../../../components/NotificationSettings";
import BookingRulesSettings from "../../../components/BookingRulesSettings";
import { useUser } from "../../../contexts/UserContext";

type TabType = 'restaurant' | 'notifications' | 'booking-rules';

const SettingsPage = () => {
  const { hasPermission } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('restaurant');

  const tabs = [
    ...(hasPermission('manage_restaurant_info') ? [{ id: 'restaurant', label: 'Restaurant Details', icon: '🏪' }] : []),
    ...(hasPermission('manage_notifications') ? [{ id: 'notifications', label: 'Notifications', icon: '🔔' }] : []),
    ...(hasPermission('manage_booking_rules') ? [{ id: 'booking-rules', label: 'Booking Rules', icon: '📋' }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'restaurant':
        return <RestaurantInfoSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'booking-rules':
        return <BookingRulesSettings />;
      default:
        return tabs.length > 0 ? <RestaurantInfoSettings /> : null;
    }
  };

  // If no tabs are available, show access denied
  if (tabs.length === 0) {
    return (
      <SettingsContainer>
        <PageHeader>
          <h1>Settings</h1>
          <p>Manage your restaurant preferences and account settings</p>
        </PageHeader>
        <AccessDenied>
          <h3>Access Denied</h3>
          <p>You don't have permission to access any settings.</p>
        </AccessDenied>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <PageHeader>
        <h1>Settings</h1>
        <p>Manage your restaurant preferences and account settings</p>
      </PageHeader>

      <SettingsContent>
        {tabs.length > 1 && (
          <TabsContainer>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <TabIcon>{tab.icon}</TabIcon>
                {tab.label}
              </TabButton>
            ))}
          </TabsContainer>
        )}

        <TabContent>
          {renderTabContent()}
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
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: #64748b;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
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
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const TabIcon = styled.span`
  font-size: 1.125rem;
`;

const TabContent = styled.div`
  padding: 0;
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
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const AccessDenied = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #ef4444;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export default SettingsPage;
