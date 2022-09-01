import { Route, Routes } from 'react-router-dom';

import Locations from './Locations';
import LocationForm from './LocationForm';

function LocationRoutes() {
  return (
    <Routes>
      <Route path="new" element={<LocationForm />} />
      <Route path=":id/edit" element={<LocationForm />} />
      <Route path="" element={<Locations />} />
    </Routes>
  );
}

export default LocationRoutes;
