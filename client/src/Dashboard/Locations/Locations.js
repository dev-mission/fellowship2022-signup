import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Api from '../../Api';
import { useAuthContext } from '../../AuthContext';

function Locations() {
  const [locations, setLocations] = useState([]);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(function () {
    Api.locations.index().then((response) => {
      setLocations(response.data);
    });
  }, []);

  async function onSetupTablet(event, locationId) {
    event.preventDefault();
    await Api.locations.setup(locationId);
    setUser(null);
    navigate(`/sheet/${locationId}`);
  }

  return (
    <main className="container">
      <h1>Locations</h1>
      {user?.isAdmin && (
        <div className="mb-3">
          <Link to="/dashboard/locations/new" className="btn btn-primary">
            Add New Location
          </Link>
        </div>
      )}
      <div className="table-responsive">
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
              <tr key={location.id}>
                <td className="text-nowrap">{location.Name}</td>
                <td className="text-nowrap">{location.Address}</td>
                <td className="text-nowrap">
                  <a onClick={(event) => onSetupTablet(event, location.id)} href={`/sheet/${location.id}`} className="btn btn-primary me-3">
                    Set Up Tablet
                  </a>
                  {user?.isAdmin && (
                    <Link to={`/dashboard/locations/${location.id}/edit`} className="btn btn-outline-primary">
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export default Locations;
