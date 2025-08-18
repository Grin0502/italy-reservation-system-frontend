import styled from "styled-components";
import { useState } from "react";
import RestaurantInfoSettings from "../../../components/RestaurantInfoSettings";
import NotificationSettings from "../../../components/NotificationSettings";
import BookingRulesSettings from "../../../components/BookingRulesSettings";
import BookingDemo from "../../../components/BookingDemo";
import RoleSwitcher from "../../../components/RoleSwitcher";
import { useUser } from "../../../contexts/UserContext";

type TabType = 'restaurant' | 'notifications' | 'booking-rules' | 'booking-demo';

const SettingsPage = () => {
  const { hasPermission } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('restaurant');

  const tabs = [
    { id: 'restaurant', label: 'Restaurant Details', icon: '🏪' },
    ...(hasPermission('manage_notifications') || hasPermission('view_notifications') ? [{ id: 'notifications', label: 'Notifications', icon: '🔔' }] : []),
    ...(hasPermission('manage_booking_rules') || hasPermission('view_booking_rules') ? [{ id: 'booking-rules', label: 'Booking Rules', icon: '📋' }] : []),
    { id: 'booking-demo', label: 'Booking Demo', icon: '🕐' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'restaurant':
        return <RestaurantInfoSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'booking-rules':
        return <BookingRulesSettings />;
      case 'booking-demo':
        return <BookingDemo />;
      default:
        return <RestaurantInfoSettings />;
    }
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <h1>Settings</h1>
        <p>Manage your restaurant preferences and account settings</p>
      </PageHeader>

      {/* Development Role Switcher */}
      <RoleSwitcher />

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
`;

export default SettingsPage;
