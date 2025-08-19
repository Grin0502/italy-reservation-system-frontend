import { useState } from "react";
import styled from "styled-components";
import DynamicStatistics from "../../../components/DynamicStatistics";
import TableManagement from "../../../components/TableManagement";
import ZoneManagement from "../../../components/ZoneManagement";
import { useUser } from "../../../contexts/UserContext";

type TabType = 'statistics' | 'tables' | 'zones';

const StatisticsPage = () => {
  const { hasPermission } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('statistics');

  const tabs = [
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    ...(hasPermission('manage_tables') ? [{ id: 'tables', label: 'Table Management', icon: '🪑' }] : []),
    ...(hasPermission('manage_zones') ? [{ id: 'zones', label: 'Zone Management', icon: '🗺️' }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <DynamicStatistics />;
      case 'tables':
        return <TableManagement />;
      case 'zones':
        return <ZoneManagement />;
      default:
        return <DynamicStatistics />;
    }
  };

  return (
    <StatisticsContainer>
      
      {tabs.length > 1 && (
        <TabNavigation>
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
        </TabNavigation>
      )}
      
      <TabContent>
        {renderTabContent()}
      </TabContent>
    </StatisticsContainer>
  );
};

const StatisticsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.isActive ? '#06b6d4' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#64748b'};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? '#0891b2' : '#f1f5f9'};
  }
`;

const TabIcon = styled.span`
  font-size: 1.125rem;
`;

const TabContent = styled.div`
  min-height: 400px;
`;

export default StatisticsPage;
