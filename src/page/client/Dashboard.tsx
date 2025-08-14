import React, { useState } from 'react';
import DashboardLayout from '../../layout/client/DashboardLayout';
import HomePage from './home';
import FloorPlanPage from './floor-plan';
import StatisticsPage from './statistics';
import SettingsPage from './settings';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'floor-plan':
        return <FloorPlanPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </DashboardLayout>
  );
};

export default Dashboard;
