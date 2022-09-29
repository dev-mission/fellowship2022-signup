import { Route, Routes } from 'react-router-dom';

import LocationRoutes from './Locations/LocationRoutes';
import ProgramRoutes from './Programs/ProgramRoutes';
import ReportRoutes from './Reports/ReportRoutes';
import Dashboard from './Dashboard';

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="locations/*" element={<LocationRoutes />} />
      <Route path="programs/*" element={<ProgramRoutes />} />
      <Route path="reports/*" element={<ReportRoutes />} />
      <Route path="" element={<Dashboard />} />
    </Routes>
  );
}

export default DashboardRoutes;
