import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ClientLayout from "../../layout/client";
import LoginForm from "../../components/LoginForm";
import {
  HomePage,
  FloorPlanPage,
  ZoneManagementPage,
  StatisticsPage,
  SettingsPage,
  BookingDemoPage
} from "../../page/client";

const ClientView = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="floor-plan" element={<FloorPlanPage />} />
          <Route path="zone-management" element={<ZoneManagementPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="booking-demo" element={<BookingDemoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ClientView;