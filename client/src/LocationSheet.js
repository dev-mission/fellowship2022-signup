import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from './Api';

function LocationSheet() {
  const [locations, setLocations] = useState([]); //item is what you put in []

  useEffect(function () {
    Api.locations.index().then((response) => {
      setLocations(response.data);
    });
  }, []);

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
              <td>{location.Name}</td> <td>{location.Address}</td>{' '}
              <td>
                <Link to={`/sheet/${location.id}`} className="btn btn-primary">
                  Set Up Tablet
                </Link>
              </td>
              <td>
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
