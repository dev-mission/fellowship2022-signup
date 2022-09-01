import { Route, Routes } from 'react-router-dom';

import Programs from './Programs';
import ProgramForm from './ProgramForm';

function ProgramRoutes() {
  return (
    <Routes>
      <Route path="new" element={<ProgramForm />} />
      <Route path=":id/edit" element={<ProgramForm />} />
      <Route path="" element={<Programs />} />
    </Routes>
  );
}

export default ProgramRoutes;
