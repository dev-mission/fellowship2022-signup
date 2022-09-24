import { Route, Routes } from 'react-router-dom';

import Sheet from './Sheet';
import SheetRedirect from './SheetRedirect';
import SignIn from './SignIn';

function SheetRoutes() {
  return (
    <Routes>
      <Route path=":id/sign-in" element={<SignIn />} />
      <Route path=":id" element={<Sheet />} />
      <Route path="" element={<SheetRedirect />} />
    </Routes>
  );
}

export default SheetRoutes;
