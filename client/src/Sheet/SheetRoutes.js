import { Route, Routes } from 'react-router-dom';

import Sheet from './Sheet';
import SignIn from './SignIn';

function SheetRoutes() {
  return (
    <Routes>
      <Route path=":id/sign-in" element={<SignIn />} />
      <Route path=":id" element={<Sheet />} />
    </Routes>
  );
}

export default SheetRoutes;
