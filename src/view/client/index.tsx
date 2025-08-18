import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "../../layout/client";
import {
  HomePage,
  FloorPlanPage,
  StatisticsPage,
  SettingsPage,
  BookingDemoPage
} from "../../page/client";

const ClientView = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="floor-plan" element={<FloorPlanPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="booking-demo" element={<BookingDemoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ClientView;