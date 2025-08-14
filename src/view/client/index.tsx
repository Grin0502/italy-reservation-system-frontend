import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "../../layout/client";
import {
  HomePage,
  FloorPlanPage,
  StatisticsPage,
  SettingsPage
} from "../../page/client";
import Dashboard from "../../page/client/Dashboard";

const ClientView = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ClientView;