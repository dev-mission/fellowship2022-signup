import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Api from './Api';
import { useAuthContext } from './AuthContext';

function LocationSheet() {
  const [locations, setLocations] = useState([]);
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(function () {
    Api.locations.index().then((response) => {
      setLocations(response.data);
    });
  }, []);

  async function onSetupTablet(event, locationId) {
    event.preventDefault();
    await Api.auth.logout();
    setUser(null);
    navigate(`/sheet/${locationId}`);
  }

  return (
    <main className="container">
      <h1>Locations</h1>
      <Link to="/dashboard/locations/new" className="btn btn-primary">
        Add New Location
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr>
              <td>{location.Name}</td>
              <td>{location.Address}</td>
              <td>
                <a onClick={(event) => onSetupTablet(event, location.id)} href={`/sheet/${location.id}`} className="btn btn-primary me-3">
                  Set Up Tablet
                </a>
                <Link to={`/dashboard/locations/${location.id}/edit`} className="btn btn-outline-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
export default LocationSheet;
