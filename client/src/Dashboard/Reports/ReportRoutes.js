import { Route, Routes } from 'react-router-dom';

import Reports from './Reports';

function ReportRoutes() {
  return (
    <Routes>
      <Route path="" element={<Reports />} />
    </Routes>
  );
}

export default ReportRoutes;
