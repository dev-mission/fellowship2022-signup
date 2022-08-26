import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Api from './Api';
import { useAuthContext } from './AuthContext';

function LocationSheet() {
  const { user } = useAuthContext();
  const [locations, setLocations] = useState([]); //item is what you put in []

  useEffect(function () {
    const request = fetch('/api/location');
    request
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLocations(data);
      });
  }, []);

  return (
    <main className="container">
      {/* <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4"> */}
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
                <Link to={`/dashboard/locations/${location.id}/edit`} className="btn btn-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* </div>
      </div> */}
    </main>
  );
}
export default LocationSheet;
